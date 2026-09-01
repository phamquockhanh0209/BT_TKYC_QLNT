using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedDataController : ControllerBase
{
    private readonly AppDbContext _context;

    private readonly ILogger<SeedDataController> _logger;

    public SeedDataController(AppDbContext context, ILogger<SeedDataController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Nạp dữ liệu mẫu sinh viên, chủ trọ, địa chỉ, hồ sơ ngoại trú và SLA để test & xem báo cáo
    /// </summary>
    [HttpPost("seed-all")]
    public async Task<IActionResult> SeedAll()
    {
        try
        {
            // 1. Thêm danh sách sinh viên mẫu phong phú (40+ sinh viên)
            var existingStudents = await _context.Students.ToListAsync();
            var studentData = GenerateStudents();

            foreach (var s in studentData)
            {
                var existing = existingStudents.FirstOrDefault(e => e.StudentCode == s.StudentCode);
                if (existing == null)
                {
                    _context.Students.Add(s);
                }
                else
                {
                    existing.Faculty = s.Faculty;
                    existing.ClassName = s.ClassName;
                    existing.DateOfBirth = s.DateOfBirth;
                }
            }
            await _context.SaveChangesAsync();

            var allStudents = await _context.Students.ToListAsync();

            // 2. Thêm Chủ trọ mẫu
            var existingLandlords = await _context.Landlords.ToListAsync();
            if (existingLandlords.Count == 0)
            {
                var landlords = new List<Landlord>
                {
                    new Landlord { FullName = "Nguyễn Văn Hùng", Phone = "0918889901", IdentityNumber = "079085001234", Email = "hung.nhatro@gmail.com", Note = "Dãy trọ 12 phòng, an ninh tốt", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                    new Landlord { FullName = "Lê Thị Cúc", Phone = "0918889902", IdentityNumber = "079085001235", Email = "cuc.chutro@gmail.com", Note = "Nhà nguyên căn chia phòng cho sinh viên", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                    new Landlord { FullName = "Phạm Đình Trọng", Phone = "0918889903", IdentityNumber = "079085001236", Email = "trong.pham@gmail.com", Note = "Ký túc xá tư nhân cao cấp", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                    new Landlord { FullName = "Võ Minh Đức", Phone = "0918889904", IdentityNumber = "079085001237", Email = "duc.vominh@gmail.com", Note = "Chung cư mini", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                    new Landlord { FullName = "Trần Văn Sơn", Phone = "0918889905", IdentityNumber = "079085001238", Email = "son.tran@gmail.com", Note = "Chung cư cao cấp gần trường", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                    new Landlord { FullName = "Huỳnh Thị Lan", Phone = "0918889906", IdentityNumber = "079085001239", Email = "lan.huynh@gmail.com", Note = "Nhà trọ giáp trường đại học", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
                };
                _context.Landlords.AddRange(landlords);
                await _context.SaveChangesAsync();
                existingLandlords = await _context.Landlords.ToListAsync();
            }

            // 3. Thêm Hồ sơ ngoại trú mẫu (40+ hồ sơ với các status khác nhau)
            var existingRegs = await _context.Registrations.ToListAsync();
            var addressStrings = new[] {
                "128/4 Võ Văn Ngân", "45 Lê Văn Việt", "72 Tô Hiến Thành", "15/3 Điện Biên Phủ",
                "88 Nguyễn Thái Sơn", "200 Hoàng Diệu 2", "330 Huỳnh Tấn Phát", "50 Nguyễn Kiệm",
                "100 Nguyễn Hữu Cảnh", "55 Tạ Gia", "77 Phan Đình Phùng", "120 Cộng Hòa"
            };
            var districts = new[] { "TP. Thủ Đức", "Quận 10", "Quận Bình Thạnh", "Quận Gò Vấp", "Quận 7", "Quận Phú Nhuận" };
            var wards = new[] { "Linh Chiểu", "Phường 15", "Phường 25", "Phường 3", "Tân Thuận Đông", "Phường 4" };

            int regCounter = 1;
            for (int i = 0; i < allStudents.Count && regCounter <= 45; i++)
            {
                var student = allStudents[i];
                
                // Mỗi sinh viên có 1 hồ sơ
                string regCode = $"HS-2026-{regCounter:D3}";
                if (existingRegs.Any(r => r.RegistrationCode == regCode))
                {
                    regCounter++;
                    continue;
                }

                // Phân bố status theo tỷ lệ
                string status = GetStatusByIndex(i);
                DateTime submittedAtBase = DateTime.Now;
                DateTime createdAtBase = DateTime.Now;

                // Tạo dữ liệu trải dài 2-3 học kỳ gần đây (2025-09-01 → 2026-09-01)
                if (i < 15)
                {
                    // Học kỳ I 2025-2026 (Sep 2025 - Jan 2026)
                    submittedAtBase = new DateTime(2025, 12, 1);
                    createdAtBase = new DateTime(2025, 11, 1);
                }
                else if (i < 30)
                {
                    // Học kỳ II 2025-2026 (Feb 2026 - Aug 2026)
                    submittedAtBase = new DateTime(2026, 6, 1);
                    createdAtBase = new DateTime(2026, 5, 1);
                }
                else
                {
                    // Học kỳ I 2026-2027 (Sep 2026 onwards)
                    submittedAtBase = new DateTime(2026, 9, 15);
                    createdAtBase = new DateTime(2026, 9, 1);
                }

                var landlord = existingLandlords[i % existingLandlords.Count];
                var addr = addressStrings[i % addressStrings.Length];
                var district = districts[i % districts.Length];
                var ward = wards[i % wards.Length];

                var reg = new Registration
                {
                    StudentId = student.StudentId,
                    RegistrationCode = regCode,
                    Status = status,
                    SubmittedAt = status != "DRAFT" ? submittedAtBase : null,
                    ApprovedAt = status == "APPROVED" ? submittedAtBase.AddDays(5) : null,
                    RejectedAt = status == "REJECTED" ? submittedAtBase.AddDays(3) : null,
                    RejectionReason = status == "REJECTED" ? "Tài liệu không đủ hoặc không rõ ràng" : null,
                    StartDate = new DateOnly(2026, 9, 1),
                    ExpiryDate = new DateOnly(2027, 6, 30),
                    TerminatedAt = status == "TERMINATED" ? submittedAtBase.AddDays(60) : null,
                    CreatedAt = createdAtBase,
                    UpdatedAt = submittedAtBase
                };
                _logger.LogInformation($"Creating registration {regCode} with status: {status}");
                _context.Registrations.Add(reg);
                await _context.SaveChangesAsync();

                // Địa chỉ đính kèm
                var address = new Address
                {
                    RegistrationId = reg.RegistrationId,
                    LandlordId = landlord.LandlordId,
                    AddressLine = addr,
                    Ward = ward,
                    District = district,
                    Province = "TP. Hồ Chí Minh",
                    AddressType = "TEMPORARY",
                    StartDate = new DateOnly(2026, 9, 1),
                    EndDate = new DateOnly(2027, 6, 30),
                    Status = "CURRENT",
                    CreatedAt = createdAtBase,
                    UpdatedAt = submittedAtBase
                };
                _context.Addresses.Add(address);

                // Thêm tài liệu
                var doc = new Document
                {
                    RegistrationId = reg.RegistrationId,
                    DocumentType = "RENTAL_CONTRACT",
                    DocumentStatus = status == "APPROVED" ? "VALID" : (status == "REJECTED" ? "INVALID" : "PENDING"),
                    CurrentVersion = 1,
                    RequiredFlag = true,
                    CreatedAt = createdAtBase,
                    UpdatedAt = submittedAtBase
                };
                _context.Documents.Add(doc);

                // Thêm SLA Tracking
                var slaStatus = status switch
                {
                    "DRAFT" => "IN_PROGRESS",
                    "SUBMITTED" => "IN_PROGRESS",
                    "UNDER_REVIEW" => "IN_PROGRESS",
                    "NEED_MORE_INFO" => "IN_PROGRESS",
                    "APPROVED" => "COMPLETED",
                    "REJECTED" => "COMPLETED",
                    "EXPIRED" => "OVERDUE",
                    "TERMINATED" => "CANCELLED",
                    _ => "IN_PROGRESS"
                };
                DateTime? completedAtTime = status == "APPROVED" || status == "REJECTED" ? submittedAtBase.AddDays(5) : null;

                var sla = new SlaTracking
                {
                    RegistrationId = reg.RegistrationId,
                    SlaType = "REGISTRATION_REVIEW",
                    StartedAt = submittedAtBase,
                    DueAt = submittedAtBase.AddDays(7),
                    CompletedAt = completedAtTime,
                    Status = slaStatus,
                    OverdueAt = slaStatus == "OVERDUE" ? submittedAtBase.AddDays(8) : null,
                    CreatedAt = createdAtBase
                };
                _context.SlaTrackings.Add(sla);
                await _context.SaveChangesAsync();

                regCounter++;
            }

            // 4. Thêm REQUEST và REQUEST_HISTORY cho một số Registration
            var allRegistrations = await _context.Registrations.ToListAsync();
            var allUsers = await _context.Users.Take(3).ToListAsync();
            int requestCounter = 1;

            for (int i = 0; i < allRegistrations.Count && requestCounter <= 25; i++)
            {
                var reg = allRegistrations[i];
                
                // Chỉ tạo request cho một số hồ sơ đã được duyệt hoặc đang xử lý
                if (reg.Status != "APPROVED" && reg.Status != "NEED_MORE_INFO" && reg.Status != "UNDER_REVIEW" && reg.Status != "SUBMITTED")
                    continue;

                string requestCode = $"RQ-2026-{requestCounter:D3}";
                if (await _context.Requests.AnyAsync(r => r.RequestCode == requestCode))
                {
                    requestCounter++;
                    continue;
                }

                string requestType = i % 3 == 0 ? "RENEW" : (i % 3 == 1 ? "CHANGE_ADDRESS" : "TERMINATE");
                string requestStatus;
                if (i % 7 == 0)
                    requestStatus = "APPROVED";
                else if (i % 7 == 1)
                    requestStatus = "REJECTED";
                else if (i % 7 == 2)
                    requestStatus = "SUBMITTED";
                else if (i % 7 == 3)
                    requestStatus = "UNDER_REVIEW";
                else if (i % 7 == 4)
                    requestStatus = "NEED_MORE_INFO";
                else if (i % 7 == 5)
                    requestStatus = "DRAFT";
                else
                    requestStatus = "CANCELLED";

                DateTime requestCreatedAt = reg.SubmittedAt ?? DateTime.Now;
                DateTime? requestSubmittedAt = requestStatus != "DRAFT" ? requestCreatedAt.AddDays(2) : null;
                DateTime? requestProcessedAt = (requestStatus == "APPROVED" || requestStatus == "REJECTED") && requestSubmittedAt.HasValue 
                    ? requestSubmittedAt.Value.AddDays(3) 
                    : null;

                var userId = allUsers.Count > 0 ? allUsers[i % allUsers.Count].UserId : 0;

                var request = new Request
                {
                    RegistrationId = reg.RegistrationId,
                    CreatedBy = userId > 0 ? userId : null,
                    ProcessedBy = requestStatus == "APPROVED" || requestStatus == "REJECTED" ? userId : null,
                    RequestCode = requestCode,
                    RequestType = requestType,
                    Status = requestStatus,
                    Reason = $"Yêu cầu {requestType}",
                    SubmittedAt = requestSubmittedAt,
                    ProcessedAt = requestProcessedAt,
                    ApprovedAt = requestStatus == "APPROVED" ? requestProcessedAt : null,
                    RejectedAt = requestStatus == "REJECTED" ? requestProcessedAt : null,
                    RejectionReason = requestStatus == "REJECTED" ? "Lý do từ chối" : null,
                    CreatedAt = requestCreatedAt,
                    UpdatedAt = DateTime.Now
                };
                _context.Requests.Add(request);
                await _context.SaveChangesAsync();

                // Thêm REQUEST_HISTORY cho request này
                if (requestStatus != "DRAFT")
                {
                    var history = new RequestHistory
                    {
                        RequestId = request.RequestId,
                        ChangedBy = userId > 0 ? userId : null,
                        OldStatus = "DRAFT",
                        NewStatus = requestStatus,
                        ChangedAt = requestSubmittedAt ?? DateTime.Now,
                        Reason = $"Chuyển trạng thái sang {requestStatus}",
                        Note = $"Thay đổi từ DRAFT sang {requestStatus}"
                    };
                    _context.RequestHistories.Add(history);
                    await _context.SaveChangesAsync();
                }

                // Nếu request được duyệt, thêm thêm một record HISTORY
                if (requestStatus == "APPROVED")
                {
                    var history2 = new RequestHistory
                    {
                        RequestId = request.RequestId,
                        ChangedBy = userId > 0 ? userId : null,
                        OldStatus = requestStatus,
                        NewStatus = "APPROVED",
                        ChangedAt = requestProcessedAt ?? DateTime.Now,
                        Reason = "Phê duyệt yêu cầu",
                        Note = "Đã được duyệt"
                    };
                    _context.RequestHistories.Add(history2);
                    await _context.SaveChangesAsync();
                }

                requestCounter++;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã nạp toàn bộ dữ liệu mẫu thành công!",
                totalStudents = await _context.Students.CountAsync(),
                totalLandlords = await _context.Landlords.CountAsync(),
                totalRegistrations = await _context.Registrations.CountAsync(),
                totalAddresses = await _context.Addresses.CountAsync(),
                totalRequests = await _context.Requests.CountAsync(),
                totalRequestHistories = await _context.RequestHistories.CountAsync(),
                totalSlaTrackings = await _context.SlaTrackings.CountAsync()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi nạp dữ liệu", error = ex.Message });
        }
    }

    private List<Student> GenerateStudents()
    {
        var students = new List<Student>();
        var faculties = new[] { "Công nghệ Thông tin", "Quản trị Kinh doanh", "Kinh tế & Kế toán", "Ngoại ngữ", "Điện - Điện tử" };
        var firstNames = new[] { "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đỗ", "Bùi", "Đinh", "Hồ", "Huỳnh", "Trịnh", "Võ", "Tô", "Phan" };
        var lastNames = new[] { "Văn An", "Thị Bình", "Minh Châu", "Quốc Dũng", "Ngọc Mai", "Hải Nam", "Thị Quỳnh", "Văn Thái", "Thùy Trang", "Gia Huy", "Công Danh", "Hồng Nhân", "Minh Đức", "Thanh Tùng", "Quốc Huy" };

        for (int i = 1; i <= 45; i++)
        {
            var firstName = firstNames[(i - 1) % firstNames.Length];
            var lastName = lastNames[(i - 1) % lastNames.Length];
            var faculty = faculties[(i - 1) % faculties.Length];
            var className = $"D{2020 + (i % 3)}{faculty.Substring(0, 2).ToUpper()}{(i % 3 + 1):D2}";

            students.Add(new Student
            {
                StudentCode = $"SV{i:D3}",
                FullName = $"{firstName} {lastName}",
                Email = $"sv{i:D3}@student.edu.vn",
                Phone = $"090123{i:D4}",
                Faculty = faculty,
                ClassName = className,
                DateOfBirth = new DateOnly(2002 + (i % 4), 1 + (i % 12), 1 + (i % 28)),
                AcademicStatus = "ENROLLED",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            });
        }

        return students;
    }

    private string GetStatusByIndex(int index)
    {
        // Phân bố các status theo tỷ lệ hợp lý
        // Chỉ sử dụng các status được phép trong database
        int statusIndex = index % 8;
        return statusIndex switch
        {
            0 or 1 => "APPROVED",
            2 => "REJECTED",
            3 => "UNDER_REVIEW",
            4 => "NEED_MORE_INFO",
            5 => "SUBMITTED",
            6 => "EXPIRED",
            7 => "DRAFT",
            _ => "DRAFT"
        };
    }
}
