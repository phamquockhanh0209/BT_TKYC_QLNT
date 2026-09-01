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

    public SeedDataController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Nạp dữ liệu mẫu sinh viên, chủ trọ, địa chỉ, hồ sơ ngoại trú và SLA để test & xem báo cáo
    /// </summary>
    [HttpPost("seed-all")]
    public async Task<IActionResult> SeedAll()
    {
        // 1. Thêm danh sách sinh viên mẫu phong phú nếu chưa có
        var existingStudents = await _context.Students.ToListAsync();
        var studentData = new List<Student>
        {
            new Student { StudentCode = "SV001", FullName = "Nguyễn Văn An", Email = "an.nguyen@student.edu.vn", Phone = "0901234001", Faculty = "Công nghệ Thông tin", ClassName = "D21CNTT01", DateOfBirth = new DateOnly(2003, 5, 12), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV002", FullName = "Trần Thị Bình", Email = "binh.tran@student.edu.vn", Phone = "0901234002", Faculty = "Công nghệ Thông tin", ClassName = "D21CNTT02", DateOfBirth = new DateOnly(2003, 8, 20), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV003", FullName = "Lê Minh Châu", Email = "chau.le@student.edu.vn", Phone = "0901234003", Faculty = "Quản trị Kinh doanh", ClassName = "D21QTKD01", DateOfBirth = new DateOnly(2003, 11, 3), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV004", FullName = "Phạm Quốc Dũng", Email = "dung.pham@student.edu.vn", Phone = "0901234004", Faculty = "Kinh tế & Kế toán", ClassName = "D22KTOAN01", DateOfBirth = new DateOnly(2004, 2, 18), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV005", FullName = "Hoàng Ngọc Mai", Email = "mai.hoang@student.edu.vn", Phone = "0901234005", Faculty = "Ngoại ngữ", ClassName = "D21NNA01", DateOfBirth = new DateOnly(2003, 9, 25), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV006", FullName = "Vũ Hải Nam", Email = "nam.vu@student.edu.vn", Phone = "0901234006", Faculty = "Điện - Điện tử", ClassName = "D20DDT01", DateOfBirth = new DateOnly(2002, 3, 14), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV007", FullName = "Đỗ Thị Quỳnh", Email = "quynh.do@student.edu.vn", Phone = "0901234007", Faculty = "Công nghệ Thông tin", ClassName = "D22CNTT01", DateOfBirth = new DateOnly(2004, 7, 30), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV008", FullName = "Bùi Văn Thái", Email = "thai.bui@student.edu.vn", Phone = "0901234008", Faculty = "Điện - Điện tử", ClassName = "D21TDH01", DateOfBirth = new DateOnly(2003, 1, 9), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV009", FullName = "Đinh Thùy Trang", Email = "trang.dinh@student.edu.vn", Phone = "0901234009", Faculty = "Quản trị Kinh doanh", ClassName = "D21QTKD01", DateOfBirth = new DateOnly(2003, 12, 1), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
            new Student { StudentCode = "SV010", FullName = "Hồ Gia Huy", Email = "huy.ho@student.edu.vn", Phone = "0901234010", Faculty = "Ngoại ngữ", ClassName = "D22NNA02", DateOfBirth = new DateOnly(2004, 6, 17), AcademicStatus = "ENROLLED", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
        };

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
            }
        }
        await _context.SaveChangesAsync();

        var allStudents = await _context.Students.ToListAsync();

        // 2. Thêm Chủ trọ mẫu
        var existingLandlords = await _context.Landlords.ToListAsync();
        if (!existingLandlords.Any())
        {
            var landlords = new List<Landlord>
            {
                new Landlord { FullName = "Nguyễn Văn Hùng", Phone = "0918889901", IdentityNumber = "079085001234", Email = "hung.nhatro@gmail.com", Note = "Dãy trọ 12 phòng, an ninh tốt", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new Landlord { FullName = "Lê Thị Cúc", Phone = "0918889902", IdentityNumber = "079085001235", Email = "cuc.chutro@gmail.com", Note = "Nhà nguyên căn chia phòng cho sinh viên", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new Landlord { FullName = "Phạm Đình Trọng", Phone = "0918889903", IdentityNumber = "079085001236", Email = "trong.pham@gmail.com", Note = "Ký túc xá tư nhân cao cấp", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now },
                new Landlord { FullName = "Võ Minh Đức", Phone = "0918889904", IdentityNumber = "079085001237", Email = "duc.vominh@gmail.com", Note = "Chung cư mini", CreatedAt = DateTime.Now, UpdatedAt = DateTime.Now }
            };
            _context.Landlords.AddRange(landlords);
            await _context.SaveChangesAsync();
            existingLandlords = await _context.Landlords.ToListAsync();
        }

        // 3. Thêm Hồ sơ ngoại trú mẫu
        var existingRegs = await _context.Registrations.ToListAsync();
        
        var sampleRegistrations = new List<(string Code, long StudentIdx, string Status, string? Reason, string AddressLine, string District, string Ward, long LandlordIdx)>
        {
            ("HS-2026-001", 0, "APPROVED", null, "128/4 Võ Văn Ngân", "TP. Thủ Đức", "Linh Chiểu", 0),
            ("HS-2026-002", 1, "APPROVED", null, "45 Lê Văn Việt", "TP. Thủ Đức", "Tăng Nhơn Phú A", 1),
            ("HS-2026-003", 2, "PENDING_REVIEW", null, "72 Tô Hiến Thành", "Quận 10", "Phường 15", 2),
            ("HS-2026-004", 3, "APPROVED", null, "15/3 Điện Biên Phủ", "Quận Bình Thạnh", "Phường 25", 0),
            ("HS-2026-005", 4, "REJECTED", "Ảnh chụp Hợp đồng thuê nhà bị mờ, không rõ chữ ký bên cho thuê.", "88 Nguyễn Thái Sơn", "Quận Gò Vấp", "Phường 3", 3),
            ("HS-2026-006", 5, "APPROVED", null, "200 Hoàng Diệu 2", "TP. Thủ Đức", "Linh Trung", 1),
            ("HS-2026-007", 6, "PENDING_REVIEW", null, "330 Huỳnh Tấn Phát", "Quận 7", "Tân Thuận Đông", 2),
            ("HS-2026-008", 7, "DRAFT", null, "50 Nguyễn Kiệm", "Quận Phú Nhuận", "Phường 4", 3)
        };

        foreach (var item in sampleRegistrations)
        {
            if (item.StudentIdx < allStudents.Count && !existingRegs.Any(r => r.RegistrationCode == item.Code))
            {
                var student = allStudents[(int)item.StudentIdx];
                var landlord = existingLandlords[(int)(item.LandlordIdx % existingLandlords.Count)];

                var reg = new Registration
                {
                    StudentId = student.StudentId,
                    RegistrationCode = item.Code,
                    Status = item.Status,
                    SubmittedAt = item.Status != "DRAFT" ? DateTime.Now.AddDays(-5) : null,
                    ApprovedAt = item.Status == "APPROVED" ? DateTime.Now.AddDays(-2) : null,
                    RejectedAt = item.Status == "REJECTED" ? DateTime.Now.AddDays(-1) : null,
                    RejectionReason = item.Reason,
                    StartDate = new DateOnly(2026, 9, 1),
                    ExpiryDate = new DateOnly(2027, 6, 30),
                    CreatedAt = DateTime.Now.AddDays(-7),
                    UpdatedAt = DateTime.Now
                };
                _context.Registrations.Add(reg);
                await _context.SaveChangesAsync();

                // Địa chỉ đính kèm
                var addr = new Address
                {
                    RegistrationId = reg.RegistrationId,
                    LandlordId = landlord.LandlordId,
                    AddressLine = item.AddressLine,
                    Ward = item.Ward,
                    District = item.District,
                    Province = "TP. Hồ Chí Minh",
                    AddressType = "TEMPORARY",
                    StartDate = new DateOnly(2026, 9, 1),
                    EndDate = new DateOnly(2027, 6, 30),
                    Status = "ACTIVE",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Addresses.Add(addr);

                // Thêm tài liệu mẫu
                var doc = new Document
                {
                    RegistrationId = reg.RegistrationId,
                    DocumentType = "RENTAL_CONTRACT",
                    DocumentStatus = item.Status == "APPROVED" ? "APPROVED" : (item.Status == "REJECTED" ? "REJECTED" : "PENDING"),
                    CurrentVersion = 1,
                    RequiredFlag = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                _context.Documents.Add(doc);

                // Thêm SLA Tracking
                var sla = new SlaTracking
                {
                    RegistrationId = reg.RegistrationId,
                    SlaType = "REGISTRATION_REVIEW",
                    StartedAt = DateTime.Now.AddDays(-5),
                    DueAt = DateTime.Now.AddDays(-2),
                    CompletedAt = item.Status == "APPROVED" || item.Status == "REJECTED" ? DateTime.Now.AddDays(-2) : null,
                    Status = item.Status == "APPROVED" || item.Status == "REJECTED" ? "COMPLETED" : "IN_PROGRESS",
                    CreatedAt = DateTime.Now
                };
                _context.SlaTrackings.Add(sla);
            }
        }
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Đã nạp toàn bộ dữ liệu mẫu thành công!",
            totalStudents = await _context.Students.CountAsync(),
            totalLandlords = await _context.Landlords.CountAsync(),
            totalRegistrations = await _context.Registrations.CountAsync(),
            totalAddresses = await _context.Addresses.CountAsync()
        });
    }
}
