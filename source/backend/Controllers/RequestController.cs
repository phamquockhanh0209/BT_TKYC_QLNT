using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAccessControlService _accessControl;
        public RequestController(AppDbContext context, IAccessControlService accessControl)
        {
            _context = context;
            _accessControl = accessControl;
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

        [HttpPost]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<Request>> CreateRequest(Request item)
        {
            if (!await _accessControl.CanAccessRegistrationAsync(User, item.RegistrationId))
                return Forbid();
            if (!await _context.Registrations.AnyAsync(r => r.RegistrationId == item.RegistrationId))
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });
            if (await _context.Requests.AnyAsync(r => r.RequestCode == item.RequestCode))
                return Conflict(new { message = "Mã yêu cầu đã tồn tại.", requestCode = item.RequestCode });

            var username = User.Identity?.Name;
            var user = string.IsNullOrWhiteSpace(username)
                ? null
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return Unauthorized();

            item.CreatedBy = user.UserId;
            item.ProcessedBy = null;
            item.Status = "SUBMITTED";
            item.SubmittedAt = DateTime.Now;
            item.CreatedAt = DateTime.Now;
            item.UpdatedAt = DateTime.Now;
            _context.Requests.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRequest), new { id = item.RequestId }, item);
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
        [Authorize(Roles = "ADMIN,OFFICER,APPROVER,SENIOR_APPROVER")]
        public async Task<IActionResult> ApproveRequest(long id)
        {
            var request = await _context.Requests
                .Include(r => r.Registration)
                    .ThenInclude(reg => reg.Addresses)
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
            if (!approverId.HasValue && long.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var claimUserId))
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

                // 5. Gửi thông báo cho người tạo yêu cầu
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
        [Authorize(Roles = "ADMIN,OFFICER,APPROVER,SENIOR_APPROVER")]
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
            if (!approverId.HasValue && long.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var claimUserId))
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
