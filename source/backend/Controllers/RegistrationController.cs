using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.DTOs.Registration;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RegistrationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAccessControlService _accessControl;
        private readonly IRegistrationService _registrationService;

        public RegistrationController(AppDbContext context, IAccessControlService accessControl, IRegistrationService registrationService)
        {
            _context = context;
            _accessControl = accessControl;
            _registrationService = registrationService;
        }

        // =====================================================
        // GET: api/Registration
        // Lấy tất cả hồ sơ đăng ký (có hỗ trợ lọc theo status & search)
        // =====================================================
        [HttpGet]
        [Authorize(Roles = "ADMIN,RECEIVER,OFFICER,PROCESSOR,REVIEWER,APPROVER,SENIOR_APPROVER")]
        public async Task<ActionResult<IEnumerable<Registration>>> GetRegistrations(
            [FromQuery] string? status,
            [FromQuery] string? search)
        {
            var query = _context.Registrations
                .AsNoTracking()
                .AsSplitQuery()
                .Include(r => r.Student)
                .Include(r => r.Addresses)
                    .ThenInclude(a => a.Landlord)
                .Include(r => r.Documents)
                    .ThenInclude(d => d.DocumentVersions)
                .Include(r => r.SlaTrackings)
                .Include(r => r.Approvals)
                    .ThenInclude(a => a.Approver)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && status.ToUpper() != "ALL")
            {
                var upperStatus = status.Trim().ToUpper();
                if (upperStatus == "OVERDUE")
                {
                    query = query.Where(r => r.SlaTrackings.Any(s => s.DueAt < DateTime.Now && s.Status != "COMPLETED") && r.Status != "APPROVED" && r.Status != "REJECTED");
                }
                else
                {
                    query = query.Where(r => r.Status == upperStatus);
                }
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(r =>
                    r.RegistrationCode.ToLower().Contains(s) ||
                    (r.Student != null && (r.Student.FullName.ToLower().Contains(s) || r.Student.StudentCode.ToLower().Contains(s))));
            }

            var registrations = await query
                .OrderByDescending(r => r.RegistrationId)
                .ToListAsync();

            return Ok(registrations);
        }

        // =====================================================
        // GET: api/Registration/1
        // Lấy hồ sơ theo ID (kèm toàn bộ quan hệ)
        // =====================================================
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Registration>> GetRegistration(long id)
        {
            if (!await _accessControl.CanAccessRegistrationAsync(User, id))
                return Forbid();

            var registration = await _context.Registrations
                .AsNoTracking()
                .AsSplitQuery()
                .Include(r => r.Student)
                .Include(r => r.Addresses)
                    .ThenInclude(a => a.Landlord)
                .Include(r => r.Documents)
                    .ThenInclude(d => d.DocumentVersions)
                .Include(r => r.SlaTrackings)
                .Include(r => r.Approvals)
                    .ThenInclude(a => a.Approver)
                .FirstOrDefaultAsync(r => r.RegistrationId == id);

            if (registration == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy hồ sơ đăng ký.",
                    registrationId = id
                });
            }

            return Ok(registration);
        }

        // =====================================================
        // GET: api/Registration/student/1
        // Lấy tất cả hồ sơ của một sinh viên
        // =====================================================
        [HttpGet("student/{studentId:long}")]
        public async Task<ActionResult<IEnumerable<Registration>>> GetRegistrationsByStudent(
            long studentId)
        {
            if (!await _accessControl.CanAccessStudentAsync(User, studentId))
                return Forbid();

            var studentExists = await _context.Students
                .AnyAsync(s => s.StudentId == studentId);

            if (!studentExists)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sinh viên.",
                    studentId = studentId
                });
            }

            var registrations = await _context.Registrations
                .AsNoTracking()
                .Include(r => r.Student)
                .Include(r => r.Addresses)
                    .ThenInclude(a => a.Landlord)
                .Include(r => r.Documents)
                    .ThenInclude(d => d.DocumentVersions)
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.RegistrationId)
                .ToListAsync();

            return Ok(registrations);
        }

        // =====================================================
        // POST: api/Registration/submit-full
        // Nộp hồ sơ đăng ký ngoại trú hoàn chỉnh (gồm địa chỉ, chủ trọ, SLA)
        // =====================================================
        [HttpPost("submit-full")]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<Registration>> SubmitFullRegistration(
            [FromBody] FullRegistrationRequestDto dto)
        {
            // The authenticated account, not the request body, determines ownership.
            var student = await _accessControl.GetCurrentStudentAsync(User);

            if (student == null)
                return Forbid();

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Kiểm tra ràng buộc nghiệp vụ: Không cho phép tạo nhiều hồ sơ ngoại trú
                // Nếu sinh viên đã có hồ sơ ACTIVE, PENDING (SUBMITTED, UNDER_REVIEW), hoặc NEED_MORE_INFO
                var existingRegs = await _context.Registrations
                    .Where(r => r.StudentId == student.StudentId)
                    .Select(r => new { r.RegistrationId, r.RegistrationCode, r.Status })
                    .ToListAsync();

                var activeReg = existingRegs.FirstOrDefault(r => r.Status == "ACTIVE" || r.Status == "APPROVED");
                if (activeReg != null)
                {
                    return BadRequest(new
                    {
                        message = "Bạn đã có hồ sơ ngoại trú đang hoạt động trên hệ thống. Nếu có thay đổi nơi ở, vui lòng tạo 'Yêu cầu chuyển nơi ở' thay vì tạo hồ sơ mới.",
                        registrationCode = activeReg.RegistrationCode,
                        status = activeReg.Status
                    });
                }

                var pendingReg = existingRegs.FirstOrDefault(r => r.Status == "SUBMITTED" || r.Status == "UNDER_REVIEW" || r.Status == "PROCESSING");
                if (pendingReg != null)
                {
                    return BadRequest(new
                    {
                        message = "Bạn đang có hồ sơ ngoại trú đang trong quá trình xét duyệt. Vui lòng chờ kết quả xử lý từ cán bộ nhà trường.",
                        registrationCode = pendingReg.RegistrationCode,
                        status = pendingReg.Status
                    });
                }

                var needInfoReg = existingRegs.FirstOrDefault(r => r.Status == "NEED_MORE_INFO");
                if (needInfoReg != null)
                {
                    return BadRequest(new
                    {
                        message = "Hồ sơ ngoại trú của bạn đang ở trạng thái cần bổ sung thông tin (NEED_MORE_INFO). Vui lòng cập nhật và nộp lại hồ sơ đó thay vì tạo hồ sơ mới.",
                        registrationCode = needInfoReg.RegistrationCode,
                        status = needInfoReg.Status
                    });
                }

                // 2. Tìm hoặc tạo Chủ trọ nếu có thông tin
                Landlord? landlord = null;
                if (!string.IsNullOrWhiteSpace(dto.LandlordPhone))
                {
                    landlord = await _context.Landlords.FirstOrDefaultAsync(l => l.Phone == dto.LandlordPhone);
                }
                if (landlord == null && !string.IsNullOrWhiteSpace(dto.LandlordFullName))
                {
                    landlord = new Landlord
                    {
                        FullName = dto.LandlordFullName,
                        Phone = dto.LandlordPhone ?? "0900000000",
                        IdentityNumber = dto.LandlordIdentityNumber,
                        Note = dto.RoomNumber != null ? $"Phòng {dto.RoomNumber}" : dto.Note,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };
                    _context.Landlords.Add(landlord);
                    await _context.SaveChangesAsync();
                }

                // 3. Tạo mã hồ sơ duy nhất
                int countToday = await _context.Registrations.CountAsync(r => r.CreatedAt.Date == DateTime.Today);
                string regCode = $"HS-{DateTime.Now:yyyyMMdd}-{countToday + 1:D3}";

                // 4. Tạo Registration (trạng thái SUBMITTED)
                var registration = new Registration
                {
                    StudentId = student.StudentId,
                    RegistrationCode = regCode,
                    Status = "SUBMITTED",
                    SubmittedAt = DateTime.Now,
                    StartDate = dto.StartDate,
                    ExpiryDate = dto.ExpiryDate,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Registrations.Add(registration);
                await _context.SaveChangesAsync();

                // 5. Tạo Address
                var address = new Address
                {
                    RegistrationId = registration.RegistrationId,
                    LandlordId = landlord?.LandlordId,
                    AddressLine = string.IsNullOrWhiteSpace(dto.RoomNumber) ? dto.AddressLine : $"{dto.AddressLine} (Phòng {dto.RoomNumber})",
                    Ward = dto.Ward,
                    District = dto.District,
                    Province = string.IsNullOrWhiteSpace(dto.Province) ? "TP. Hồ Chí Minh" : dto.Province,
                    AddressType = "TEMPORARY",
                    StartDate = dto.StartDate,
                    EndDate = dto.ExpiryDate,
                    Status = "CURRENT",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Addresses.Add(address);

                // 6. Tạo SLA Tracking 48h
                var sla = new SlaTracking
                {
                    RegistrationId = registration.RegistrationId,
                    SlaType = "REGISTRATION_REVIEW",
                    StartedAt = DateTime.Now,
                    DueAt = DateTime.Now.AddHours(48),
                    Status = "IN_PROGRESS",
                    CreatedAt = DateTime.Now
                };
                _context.SlaTrackings.Add(sla);

                await _context.SaveChangesAsync();

                // Trả về kèm đầy đủ navigation
                var result = await _context.Registrations
                    .AsNoTracking()
                    .Include(r => r.Student)
                    .Include(r => r.Addresses)
                        .ThenInclude(a => a.Landlord)
                    .Include(r => r.Documents)
                    .FirstOrDefaultAsync(r => r.RegistrationId == registration.RegistrationId);

                await transaction.CommitAsync();
                return Ok(result);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // =====================================================
        // POST: api/Registration/1/review-action
        // Thẩm định hồ sơ ngoại trú (Reviewer action: PASS, REQUEST_INFO, REJECT)
        // =====================================================
        [HttpPost("{id:long}/review-action")]
        [Authorize(Roles = "ADMIN,REVIEWER,OFFICER,APPROVER,SENIOR_APPROVER")]
        public async Task<IActionResult> ReviewAction(long id, [FromBody] ReviewActionDto dto)
        {
            var registration = await _context.Registrations
                .Include(r => r.Student)
                .Include(r => r.Addresses)
                .Include(r => r.Documents)
                .Include(r => r.SlaTrackings)
                .FirstOrDefaultAsync(r => r.RegistrationId == id);

            if (registration == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ đăng ký.", registrationId = id });
            }

            var action = dto.Action?.Trim().ToUpper();
            if (action != "APPROVE" && action != "PASS" && action != "REQUEST_INFO" && action != "REJECT")
            {
                return BadRequest(new { message = "Hành động xử lý không hợp lệ. Cho phép: APPROVE, PASS, REQUEST_INFO, REJECT." });
            }

            var canApprove = User.IsInRole("ADMIN") || User.IsInRole("APPROVER") || User.IsInRole("SENIOR_APPROVER") || User.IsInRole("REVIEWER") || User.IsInRole("OFFICER");
            var canReview = canApprove || User.IsInRole("RECEIVER") || User.IsInRole("PROCESSOR");
            if ((action is "APPROVE" or "REJECT") && !canApprove || (action is "PASS" or "REQUEST_INFO") && !canReview)
                return Forbid();

            var username = User.Identity?.Name;
            var currentUser = string.IsNullOrWhiteSpace(username)
                ? null
                : await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            
            long? approverId = currentUser?.UserId;
            if (!approverId.HasValue && long.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var claimUserId))
            {
                approverId = claimUserId;
            }
            if (!approverId.HasValue && dto.ApproverId.HasValue)
            {
                approverId = dto.ApproverId;
            }

            if (!approverId.HasValue || !await _context.Users.AnyAsync(u => u.UserId == approverId.Value))
            {
                return BadRequest(new { message = "Không xác định được tài khoản cán bộ xử lý." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                string newStatus;
                string decision;
                string notifTitle;
                string notifMessage;

                if (action == "APPROVE")
                {
                    newStatus = "ACTIVE";
                    decision = "APPROVED";
                    registration.ApprovedAt = DateTime.Now;
                    notifTitle = "Hồ sơ ngoại trú đã được duyệt chính thức";
                    notifMessage = $"Chúc mừng! Hồ sơ {registration.RegistrationCode} của bạn đã được Cán bộ Quản lý phê duyệt chính thức. Nơi ở ngoại trú hiện đã có hiệu lực trên hệ thống.";

                    // Cập nhật địa chỉ sang hiệu lực
                    foreach (var addr in registration.Addresses)
                    {
                        addr.Status = "CURRENT";
                        addr.UpdatedAt = DateTime.Now;
                    }

                    // Phê duyệt hồ sơ chính thức cũng phê duyệt các giấy tờ đính kèm.
                    foreach (var document in registration.Documents)
                    {
                        document.DocumentStatus = "VALID";
                        document.UpdatedAt = DateTime.Now;
                    }
                }
                else if (action == "PASS")
                {
                    newStatus = "UNDER_REVIEW";
                    decision = "APPROVED";
                    notifTitle = "Hồ sơ đã qua vòng thẩm định";
                    notifMessage = $"Hồ sơ {registration.RegistrationCode} của bạn đã được Cán bộ thẩm định đạt yêu cầu và chuyển tiếp sang bước phê duyệt cấp trường. Ghi chú: {dto.Note ?? "Đầy đủ hồ sơ, hợp lệ."}";
                }
                else if (action == "REQUEST_INFO")
                {
                    newStatus = "NEED_MORE_INFO";
                    decision = "NEED_MORE_INFO";
                    notifTitle = "Yêu cầu bổ sung hồ sơ ngoại trú";
                    notifMessage = $"Cán bộ yêu cầu bạn bổ sung/chỉnh sửa giấy tờ cho hồ sơ {registration.RegistrationCode}. Lý do: {dto.Note}";
                }
                else // REJECT
                {
                    newStatus = "REJECTED";
                    decision = "REJECTED";
                    registration.RejectedAt = DateTime.Now;
                    registration.RejectionReason = dto.Note ?? "Hồ sơ không đủ điều kiện.";
                    notifTitle = "Hồ sơ ngoại trú bị từ chối";
                    notifMessage = $"Hồ sơ {registration.RegistrationCode} của bạn đã bị từ chối. Lý do: {dto.Note}";
                }

                registration.Status = newStatus;
                registration.UpdatedAt = DateTime.Now;

                // 1. Tạo Approval record
                var approval = new Approval
                {
                    RegistrationId = registration.RegistrationId,
                    ApproverId = approverId.Value,
                    ApprovalType = "REGISTRATION",
                    Decision = decision,
                    Reason = dto.Note ?? (action == "PASS" ? "Hồ sơ hợp lệ" : "Từ chối/Bổ sung"),
                    DecidedAt = DateTime.Now
                };
                _context.Approvals.Add(approval);

                // 2. Tạo Notification cho sinh viên nếu có tài khoản User
                if (registration.Student != null)
                {
                    var studentUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == registration.Student.StudentCode);
                    if (studentUser != null)
                    {
                        var notif = new Notification
                        {
                            UserId = studentUser.UserId,
                            RegistrationId = registration.RegistrationId,
                            NotificationType = (action == "PASS" || action == "APPROVE") ? "SUCCESS" : "WARNING",
                            Title = notifTitle,
                            Message = notifMessage,
                            IsRead = false,
                            CreatedAt = DateTime.Now
                        };
                        _context.Notifications.Add(notif);
                    }
                }

                // 3. Cập nhật SLA tracking nếu có
                var sla = registration.SlaTrackings.FirstOrDefault();
                if (sla != null && action == "PASS")
                {
                    sla.Status = "IN_PROGRESS";
                }
                else if (sla != null)
                {
                    sla.Status = "COMPLETED";
                    sla.CompletedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = action == "APPROVE" ? "Phê duyệt chính thức hồ sơ thành công." : "Thẩm định hồ sơ thành công.",
                    registrationId = registration.RegistrationId,
                    status = registration.Status,
                    action = action
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // =====================================================
        // POST: api/Registration/1/resubmit
        // Sinh viên nộp lại hồ sơ sau khi được yêu cầu bổ sung
        // =====================================================
        [HttpPost("{id:long}/resubmit")]
        [Authorize(Roles = "STUDENT,ADMIN")]
        public async Task<IActionResult> ResubmitRegistration(long id)
        {
            try
            {
                var registration = await _context.Registrations
                    .FirstOrDefaultAsync(r => r.RegistrationId == id);

                if (registration == null)
                {
                    return NotFound(new { message = "Không tìm thấy hồ sơ đăng ký.", registrationId = id });
                }

                if (User.IsInRole("STUDENT"))
                {
                    var student = await _accessControl.GetCurrentStudentAsync(User);
                    if (student == null || registration.StudentId != student.StudentId)
                        return Forbid();
                }

                var updatedReg = await _registrationService.ResubmitRegistrationAsync(id);

                return Ok(new
                {
                    message = "Nộp lại hồ sơ thành công.",
                    registrationId = updatedReg.RegistrationId,
                    status = updatedReg.Status
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // =====================================================
        // POST: api/Registration
        // Tạo hồ sơ đăng ký
        // =====================================================
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<Registration>> CreateRegistration(
            Registration registration)
        {
            // Kiểm tra sinh viên tồn tại
            var studentExists = await _context.Students
                .AnyAsync(s => s.StudentId == registration.StudentId);

            if (!studentExists)
            {
                return BadRequest(new
                {
                    message = "Sinh viên không tồn tại.",
                    studentId = registration.StudentId
                });
            }

            // Kiểm tra mã hồ sơ trùng
            var duplicateCode = await _context.Registrations
                .AnyAsync(r =>
                    r.RegistrationCode == registration.RegistrationCode);

            if (duplicateCode)
            {
                return Conflict(new
                {
                    message = "Mã đăng ký đã tồn tại.",
                    registrationCode = registration.RegistrationCode
                });
            }

            // Giá trị mặc định
            registration.Status = "DRAFT";
            registration.CreatedAt = DateTime.Now;
            registration.UpdatedAt = DateTime.Now;

            _context.Registrations.Add(registration);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetRegistration),
                new { id = registration.RegistrationId },
                registration
            );
        }

        // =====================================================
        // PUT: api/Registration/1
        // Cập nhật hồ sơ đăng ký
        // =====================================================
        [HttpPut("{id:long}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateRegistration(
            long id,
            Registration registration)
        {
            if (id != registration.RegistrationId)
            {
                return BadRequest(new
                {
                    message = "ID trên URL không trùng với RegistrationId."
                });
            }

            var existingRegistration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == id);

            if (existingRegistration == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy hồ sơ đăng ký.",
                    registrationId = id
                });
            }

            // Kiểm tra sinh viên
            var studentExists = await _context.Students
                .AnyAsync(s => s.StudentId == registration.StudentId);

            if (!studentExists)
            {
                return BadRequest(new
                {
                    message = "Sinh viên không tồn tại.",
                    studentId = registration.StudentId
                });
            }

            // Kiểm tra mã đăng ký trùng
            var duplicateCode = await _context.Registrations
                .AnyAsync(r =>
                    r.RegistrationCode == registration.RegistrationCode &&
                    r.RegistrationId != id);

            if (duplicateCode)
            {
                return Conflict(new
                {
                    message = "Mã đăng ký đã được sử dụng.",
                    registrationCode = registration.RegistrationCode
                });
            }

            // Cập nhật
            existingRegistration.StudentId = registration.StudentId;
            existingRegistration.RegistrationCode =
                registration.RegistrationCode;

            existingRegistration.Status =
                registration.Status;

            existingRegistration.SubmittedAt =
                registration.SubmittedAt;

            existingRegistration.ApprovedAt =
                registration.ApprovedAt;

            existingRegistration.RejectedAt =
                registration.RejectedAt;

            existingRegistration.RejectionReason =
                registration.RejectionReason;

            existingRegistration.StartDate =
                registration.StartDate;

            existingRegistration.ExpiryDate =
                registration.ExpiryDate;

            existingRegistration.TerminatedAt =
                registration.TerminatedAt;

            // Không cho client sửa CreatedAt
            existingRegistration.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // =====================================================
        // DELETE: api/Registration/1
        // Xóa hồ sơ đăng ký
        // =====================================================
        [HttpDelete("{id:long}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteRegistration(long id)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == id);

            if (registration == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy hồ sơ đăng ký.",
                    registrationId = id
                });
            }

            _context.Registrations.Remove(registration);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}