using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;
using System.Security.Claims;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAccessControlService _accessControl;
        private readonly IAuditLogService _auditLog;

        public RequestController(
            AppDbContext context,
            IAccessControlService accessControl,
            IAuditLogService auditLog)
        {
            _context = context;
            _accessControl = accessControl;
            _auditLog = auditLog;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN,RECEIVER,OFFICER,PROCESSOR,REVIEWER,APPROVER,SENIOR_APPROVER")]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequests()
        {
            return Ok(await _context.Requests.AsNoTracking()
                .Include(r => r.Registration).Include(r => r.CreatedByNavigation).Include(r => r.ProcessedByNavigation)
                .OrderByDescending(r => r.RequestId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Request>> GetRequest(long id)
        {
            if (!await _accessControl.CanAccessRequestAsync(User, id))
                return Forbid();

            var item = await _context.Requests.AsNoTracking()
                .Include(r => r.Registration).Include(r => r.CreatedByNavigation).Include(r => r.ProcessedByNavigation)
                .FirstOrDefaultAsync(r => r.RequestId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id }) : Ok(item);
        }

        [HttpGet("registration/{registrationId:long}")]
        public async Task<ActionResult<IEnumerable<Request>>> GetByRegistration(long registrationId)
        {
            if (!await _accessControl.CanAccessRegistrationAsync(User, registrationId))
                return Forbid();

            if (!await _context.Registrations.AnyAsync(r => r.RegistrationId == registrationId))
                return NotFound(new { message = "Không tìm thấy hồ sơ đăng ký.", registrationId });
            return Ok(await _context.Requests.AsNoTracking()
                .Where(r => r.RegistrationId == registrationId)
                .OrderByDescending(r => r.RequestId).ToListAsync());
        }

        // =====================================================
        // POST: api/Request
        // Sinh viên tạo yêu cầu phát sinh (RENEWAL, CHANGE_ADDRESS, TERMINATION)
        // =====================================================
        [HttpPost]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<Request>> CreateRequest(Request item)
        {
            if (!await _accessControl.CanAccessRegistrationAsync(User, item.RegistrationId))
                return Forbid();

            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == item.RegistrationId);

            if (registration == null)
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });

            // 1. Chỉ hồ sơ đang hoạt động hoặc đã duyệt mới được phép tạo yêu cầu phát sinh
            if (registration.Status != "ACTIVE" && registration.Status != "APPROVED")
            {
                return BadRequest(new
                {
                    message = $"Hồ sơ đang ở trạng thái '{registration.Status}'. Chỉ hồ sơ đang hoạt động (ACTIVE) mới được phép tạo yêu cầu phát sinh.",
                    status = registration.Status
                });
            }

            // 2. Ràng buộc nghiệp vụ quan trọng: Mỗi hồ sơ đang hoạt động chỉ có tối đa một yêu cầu đang chờ xử lý
            var pendingStatuses = new[] { "SUBMITTED", "UNDER_REVIEW", "PROCESSING", "NEED_MORE_INFO" };
            var existingPending = await _context.Requests
                .Where(r => r.RegistrationId == item.RegistrationId && pendingStatuses.Contains(r.Status))
                .Select(r => new { r.RequestId, r.RequestCode, r.RequestType, r.Status })
                .FirstOrDefaultAsync();

            if (existingPending != null)
            {
                return BadRequest(new
                {
                    message = $"Hồ sơ ngoại trú của bạn hiện đã có yêu cầu '{existingPending.RequestType}' ({existingPending.RequestCode}) đang trong quá trình xử lý (trạng thái: {existingPending.Status}). Vui lòng chờ hoàn tất yêu cầu trước khi tạo yêu cầu mới.",
                    existingRequestId = existingPending.RequestId,
                    existingRequestCode = existingPending.RequestCode,
                    existingStatus = existingPending.Status
                });
            }

            var username = User.Identity?.Name;
            var user = string.IsNullOrWhiteSpace(username)
                ? null
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return Unauthorized();

            // Tự sinh mã yêu cầu nếu client không truyền
            if (string.IsNullOrWhiteSpace(item.RequestCode))
            {
                int countToday = await _context.Requests.CountAsync(r => r.CreatedAt.Date == DateTime.Today);
                item.RequestCode = $"YC-{DateTime.Now:yyyyMMdd}-{countToday + 1:D3}";
            }
            else if (await _context.Requests.AnyAsync(r => r.RequestCode == item.RequestCode))
            {
                return Conflict(new { message = "Mã yêu cầu đã tồn tại.", requestCode = item.RequestCode });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                item.CreatedBy = user.UserId;
                item.ProcessedBy = null;
                item.Status = "SUBMITTED";
                item.SubmittedAt = DateTime.Now;
                item.CreatedAt = DateTime.Now;
                item.UpdatedAt = DateTime.Now;

                _context.Requests.Add(item);
                await _context.SaveChangesAsync();

                // Ghi lịch sử khởi tạo yêu cầu
                var history = new RequestHistory
                {
                    RequestId = item.RequestId,
                    OldStatus = null,
                    NewStatus = "SUBMITTED",
                    ChangedBy = user.UserId,
                    Reason = item.Reason,
                    Note = $"Khởi tạo yêu cầu {item.RequestType}",
                    ChangedAt = DateTime.Now
                };
                _context.RequestHistories.Add(history);

                // Khởi tạo SLA tracking 48h cho yêu cầu
                var sla = new SlaTracking
                {
                    RequestId = item.RequestId,
                    RegistrationId = null,
                    SlaType = $"REQUEST_{item.RequestType}",
                    StartedAt = DateTime.Now,
                    DueAt = DateTime.Now.AddHours(48),
                    Status = "IN_PROGRESS",
                    CreatedAt = DateTime.Now
                };
                _context.SlaTrackings.Add(sla);

                await _context.SaveChangesAsync();

                // Ghi AuditLog
                await _auditLog.LogAsync(
                    userId: user.UserId,
                    action: "CREATE_REQUEST",
                    entityType: "REQUEST",
                    entityId: item.RequestId,
                    oldValue: null,
                    newValue: "SUBMITTED",
                    reason: item.Reason,
                    source: "STUDENT_PORTAL"
                );

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetRequest), new { id = item.RequestId }, item);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // =====================================================
        // POST: api/Request/{id}/cancel
        // Sinh viên tự hủy yêu cầu đang ở trạng thái DRAFT hoặc SUBMITTED
        // =====================================================
        [HttpPost("{id:long}/cancel")]
        [Authorize(Roles = "STUDENT,ADMIN")]
        public async Task<IActionResult> CancelRequest(long id)
        {
            var request = await _context.Requests
                .Include(r => r.Registration)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id });

            if (!await _accessControl.CanAccessRequestAsync(User, id))
                return Forbid();

            if (request.Status != "SUBMITTED" && request.Status != "DRAFT")
            {
                return BadRequest(new
                {
                    message = $"Yêu cầu đang ở trạng thái {request.Status}. Chỉ yêu cầu ở trạng thái SUBMITTED hoặc DRAFT mới có thể hủy bỏ.",
                    currentStatus = request.Status
                });
            }

            var username = User.Identity?.Name;
            var currentUser = string.IsNullOrWhiteSpace(username)
                ? null
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            long? userId = currentUser?.UserId;
            if (!userId.HasValue && long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var claimId))
            {
                userId = claimId;
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var oldStatus = request.Status;
                request.Status = "CANCELLED";
                request.UpdatedAt = DateTime.Now;

                // Ghi RequestHistory
                _context.RequestHistories.Add(new RequestHistory
                {
                    RequestId = request.RequestId,
                    OldStatus = oldStatus,
                    NewStatus = "CANCELLED",
                    ChangedBy = userId,
                    Reason = "Sinh viên chủ động hủy yêu cầu",
                    ChangedAt = DateTime.Now
                });

                // Hủy SLA tracking nếu có
                var sla = await _context.SlaTrackings.FirstOrDefaultAsync(s => s.RequestId == id && s.Status == "IN_PROGRESS");
                if (sla != null)
                {
                    sla.Status = "CANCELLED";
                    sla.CompletedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                // Ghi AuditLog
                await _auditLog.LogAsync(
                    userId: userId,
                    action: "CANCEL_REQUEST",
                    entityType: "REQUEST",
                    entityId: request.RequestId,
                    oldValue: oldStatus,
                    newValue: "CANCELLED",
                    reason: "Sinh viên chủ động hủy yêu cầu",
                    source: "STUDENT_PORTAL"
                );

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Đã hủy yêu cầu thành công.",
                    requestId = request.RequestId,
                    status = request.Status
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpPut("{id:long}")]
        [Authorize(Roles = "ADMIN,OFFICER,PROCESSOR,REVIEWER,APPROVER,SENIOR_APPROVER")]
        public async Task<IActionResult> UpdateRequest(long id, Request item)
        {
            if (id != item.RequestId) return BadRequest(new { message = "ID trên URL không trùng RequestId." });
            var existing = await _context.Requests.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id });

            if (!await _context.Registrations.AnyAsync(r => r.RegistrationId == item.RegistrationId))
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });
            if (await _context.Requests.AnyAsync(r => r.RequestCode == item.RequestCode && r.RequestId != id))
                return Conflict(new { message = "Mã yêu cầu đã được sử dụng." });

            existing.RegistrationId = item.RegistrationId;
            existing.CreatedBy = item.CreatedBy;
            existing.ProcessedBy = item.ProcessedBy;
            existing.RequestCode = item.RequestCode;
            existing.RequestType = item.RequestType;
            existing.Status = item.Status;
            existing.Reason = item.Reason;
            existing.SubmittedAt = item.SubmittedAt;
            existing.ProcessedAt = item.ProcessedAt;
            existing.ApprovedAt = item.ApprovedAt;
            existing.RejectedAt = item.RejectedAt;
            existing.RejectionReason = item.RejectionReason;
            existing.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteRequest(long id)
        {
            var item = await _context.Requests.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id });
            _context.Requests.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // =====================================================
        // POST: api/Request/{id}/approve
        // Officer/Approver duyệt Request → tự động tác động lên Registration
        // - RENEWAL:        cộng thêm 1 năm vào expiry_date
        // - CHANGE_ADDRESS: cập nhật địa chỉ mới vào Registration
        // - TERMINATION:    chuyển Registration sang TERMINATED
        // =====================================================
        [HttpPost("{id:long}/approve")]
        [Authorize(Roles = "ADMIN,OFFICER,REVIEWER,APPROVER,SENIOR_APPROVER")]
        public async Task<IActionResult> ApproveRequest(long id)
        {
            var request = await _context.Requests
                .Include(r => r.Registration)
                    .ThenInclude(reg => reg!.Addresses)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id });

            if (request.Status == "APPROVED")
                return BadRequest(new { message = "Yêu cầu này đã được phê duyệt trước đó." });

            if (request.Status == "REJECTED")
                return BadRequest(new { message = "Yêu cầu này đã bị từ chối, không thể phê duyệt." });

            if (request.Status == "CANCELLED")
                return BadRequest(new { message = "Yêu cầu này đã bị hủy, không thể phê duyệt." });

            var registration = request.Registration;
            if (registration == null)
                return BadRequest(new { message = "Không tìm thấy hồ sơ gắn với yêu cầu này." });

            if (registration.Status != "ACTIVE" && registration.Status != "APPROVED")
                return BadRequest(new { message = $"Hồ sơ ngoại trú hiện ở trạng thái {registration.Status}, không thể thực hiện yêu cầu này." });

            var username = User.Identity?.Name;
            var currentUser = string.IsNullOrWhiteSpace(username)
                ? null
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            long? approverId = currentUser?.UserId;
            if (!approverId.HasValue && long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var claimUserId))
            {
                approverId = claimUserId;
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var oldStatus = request.Status;

                // 1. Cập nhật trạng thái Request
                request.Status = "APPROVED";
                request.ApprovedAt = DateTime.Now;
                request.ProcessedAt = DateTime.Now;
                request.UpdatedAt = DateTime.Now;
                if (approverId.HasValue) request.ProcessedBy = approverId.Value;

                // 2. Tác động lên Registration theo request_type
                switch (request.RequestType?.ToUpper())
                {
                    case "RENEWAL":
                        var currentExpiry = registration.ExpiryDate ?? DateOnly.FromDateTime(DateTime.Today);
                        registration.ExpiryDate = currentExpiry.AddYears(1);
                        registration.UpdatedAt = DateTime.Now;
                        break;

                    case "CHANGE_ADDRESS":
                        if (!string.IsNullOrWhiteSpace(request.NewAddressLine))
                        {
                            // Đánh dấu địa chỉ cũ thành OLD (khớp CHECK constraint CK_ADDRESS_STATUS)
                            foreach (var addr in registration.Addresses)
                            {
                                addr.Status = "OLD";
                                addr.EndDate = DateOnly.FromDateTime(DateTime.Today);
                                addr.UpdatedAt = DateTime.Now;
                            }

                            // Thêm địa chỉ mới
                            var newAddress = new Address
                            {
                                RegistrationId = registration.RegistrationId,
                                LandlordId = request.NewLandlordId,
                                AddressLine = request.NewAddressLine,
                                Ward = request.NewWard,
                                District = request.NewDistrict,
                                Province = string.IsNullOrWhiteSpace(request.NewCity) ? "TP. Hồ Chí Minh" : request.NewCity,
                                AddressType = "TEMPORARY",
                                StartDate = DateOnly.FromDateTime(DateTime.Today),
                                Status = "CURRENT",
                                CreatedAt = DateTime.Now,
                                UpdatedAt = DateTime.Now
                            };
                            _context.Addresses.Add(newAddress);
                        }
                        registration.UpdatedAt = DateTime.Now;
                        break;

                    case "TERMINATION":
                        registration.Status = "TERMINATED";
                        registration.TerminatedAt = DateTime.Now;
                        registration.UpdatedAt = DateTime.Now;

                        foreach (var addr in registration.Addresses)
                        {
                            addr.Status = "INACTIVE";
                            addr.EndDate = DateOnly.FromDateTime(DateTime.Today);
                            addr.UpdatedAt = DateTime.Now;
                        }
                        break;
                }

                // 3. Ghi nhận Approval
                if (approverId.HasValue)
                {
                    var approval = new Approval
                    {
                        RequestId = request.RequestId,
                        ApproverId = approverId.Value,
                        ApprovalType = "REQUEST",
                        Decision = "APPROVED",
                        Reason = $"Phê duyệt yêu cầu {request.RequestType}.",
                        DecidedAt = DateTime.Now
                    };
                    _context.Approvals.Add(approval);
                }

                // 4. Ghi nhận RequestHistory
                var history = new RequestHistory
                {
                    RequestId = request.RequestId,
                    OldStatus = oldStatus,
                    NewStatus = "APPROVED",
                    ChangedBy = approverId,
                    Reason = "Cán bộ phê duyệt yêu cầu.",
                    Note = request.Reason,
                    ChangedAt = DateTime.Now
                };
                _context.RequestHistories.Add(history);

                // 5. Cập nhật SLA tracking của request nếu có
                var requestSla = await _context.SlaTrackings.FirstOrDefaultAsync(s => s.RequestId == id && s.Status == "IN_PROGRESS");
                if (requestSla != null)
                {
                    requestSla.Status = "COMPLETED";
                    requestSla.CompletedAt = DateTime.Now;
                }

                // 6. Gửi thông báo cho người tạo yêu cầu
                var studentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == request.CreatedBy);
                if (studentUser != null)
                {
                    _context.Notifications.Add(new Notification
                    {
                        UserId = studentUser.UserId,
                        RequestId = request.RequestId,
                        NotificationType = "SUCCESS",
                        Title = $"Yêu cầu {request.RequestCode ?? request.RequestType} đã được phê duyệt",
                        Message = $"Yêu cầu {request.RequestType} của bạn đã được phê duyệt thành công vào lúc {DateTime.Now:HH:mm dd/MM/yyyy}.",
                        IsRead = false,
                        CreatedAt = DateTime.Now
                    });
                }

                // 7. Ghi AuditLog
                await _auditLog.LogAsync(
                    userId: approverId,
                    action: "APPROVE_REQUEST",
                    entityType: "REQUEST",
                    entityId: request.RequestId,
                    oldValue: oldStatus,
                    newValue: "APPROVED",
                    reason: $"Phê duyệt yêu cầu {request.RequestType}",
                    source: "OFFICER_PORTAL"
                );

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = $"Đã duyệt yêu cầu {request.RequestType} thành công.",
                    requestId = request.RequestId,
                    requestStatus = request.Status,
                    registrationId = registration.RegistrationId,
                    registrationStatus = registration.Status,
                    newExpiryDate = registration.ExpiryDate
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // =====================================================
        // POST: api/Request/{id}/reject
        // Officer/Approver từ chối Request
        // =====================================================
        [HttpPost("{id:long}/reject")]
        [Authorize(Roles = "ADMIN,OFFICER,REVIEWER,APPROVER,SENIOR_APPROVER")]
        public async Task<IActionResult> RejectRequest(long id, [FromBody] RejectRequestDto dto)
        {
            var request = await _context.Requests
                .Include(r => r.Registration)
                .FirstOrDefaultAsync(r => r.RequestId == id);

            if (request == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id });

            if (request.Status == "REJECTED")
                return BadRequest(new { message = "Yêu cầu này đã bị từ chối rồi." });

            if (request.Status == "APPROVED")
                return BadRequest(new { message = "Yêu cầu này đã được phê duyệt, không thể từ chối." });

            var username = User.Identity?.Name;
            var currentUser = string.IsNullOrWhiteSpace(username)
                ? null
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            long? approverId = currentUser?.UserId;
            if (!approverId.HasValue && long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var claimUserId))
            {
                approverId = claimUserId;
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var oldStatus = request.Status;
                var reason = dto?.Reason ?? "Không đủ điều kiện.";

                request.Status = "REJECTED";
                request.RejectedAt = DateTime.Now;
                request.RejectionReason = reason;
                request.ProcessedAt = DateTime.Now;
                request.UpdatedAt = DateTime.Now;
                if (approverId.HasValue) request.ProcessedBy = approverId.Value;

                // Ghi nhận Approval
                if (approverId.HasValue)
                {
                    var approval = new Approval
                    {
                        RequestId = request.RequestId,
                        ApproverId = approverId.Value,
                        ApprovalType = "REQUEST",
                        Decision = "REJECTED",
                        Reason = reason,
                        DecidedAt = DateTime.Now
                    };
                    _context.Approvals.Add(approval);
                }

                // Ghi nhận RequestHistory
                var history = new RequestHistory
                {
                    RequestId = request.RequestId,
                    OldStatus = oldStatus,
                    NewStatus = "REJECTED",
                    ChangedBy = approverId,
                    Reason = reason,
                    Note = dto?.Reason,
                    ChangedAt = DateTime.Now
                };
                _context.RequestHistories.Add(history);

                // Cập nhật SLA tracking của request nếu có
                var requestSla = await _context.SlaTrackings.FirstOrDefaultAsync(s => s.RequestId == id && s.Status == "IN_PROGRESS");
                if (requestSla != null)
                {
                    requestSla.Status = "COMPLETED";
                    requestSla.CompletedAt = DateTime.Now;
                }

                // Gửi thông báo cho người tạo yêu cầu
                var studentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == request.CreatedBy);
                if (studentUser != null)
                {
                    _context.Notifications.Add(new Notification
                    {
                        UserId = studentUser.UserId,
                        RequestId = request.RequestId,
                        NotificationType = "WARNING",
                        Title = $"Yêu cầu {request.RequestCode ?? request.RequestType} bị từ chối",
                        Message = $"Yêu cầu {request.RequestType} của bạn đã bị từ chối. Lý do: {reason}",
                        IsRead = false,
                        CreatedAt = DateTime.Now
                    });
                }

                // Ghi AuditLog
                await _auditLog.LogAsync(
                    userId: approverId,
                    action: "REJECT_REQUEST",
                    entityType: "REQUEST",
                    entityId: request.RequestId,
                    oldValue: oldStatus,
                    newValue: "REJECTED",
                    reason: reason,
                    source: "OFFICER_PORTAL"
                );

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Đã từ chối yêu cầu.",
                    requestId = request.RequestId,
                    requestStatus = request.Status
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }

    // DTO cho reject request
    public class RejectRequestDto
    {
        public string? Reason { get; set; }
    }
}
