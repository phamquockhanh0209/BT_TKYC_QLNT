using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private const long MaxAvatarSize = 5 * 1024 * 1024;
        private static readonly HashSet<string> AvatarExtensions = new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET: api/Student
        // Lấy toàn bộ sinh viên
        // =====================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            var students = await _context.Students
                .AsNoTracking()
                .OrderBy(s => s.StudentId)
                .ToListAsync();

            return Ok(students);
        }


        // =====================================================
        // GET: api/Student/1
        // Lấy sinh viên theo ID
        // =====================================================
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Student>> GetStudent(long id)
        {
            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sinh viên.",
                    studentId = id
                });
            }

            return Ok(student);
        }

        // =====================================================
        // GET: api/Student/by-code/650101
        // Lấy sinh viên theo MSSV (StudentCode)
        // =====================================================
        [HttpGet("by-code/{studentCode}")]
        public async Task<ActionResult<Student>> GetStudentByCode(string studentCode)
        {
            var student = await _context.Students
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentCode == studentCode);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sinh viên với MSSV này.",
                    studentCode = studentCode
                });
            }

            return Ok(student);
        }

        [HttpPost("{id:long}/avatar")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Student>> UploadAvatar(long id, IFormFile file, IWebHostEnvironment environment)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Vui lòng chọn ảnh đại diện." });
            if (file.Length > MaxAvatarSize)
                return BadRequest(new { message = "Ảnh không được vượt quá 5 MB." });

            var extension = Path.GetExtension(file.FileName);
            if (!AvatarExtensions.Contains(extension))
                return BadRequest(new { message = "Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP." });

            var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentId == id);
            if (student == null)
                return NotFound(new { message = "Không tìm thấy sinh viên.", studentId = id });

            var relativeDirectory = Path.Combine("uploads", "students", student.StudentCode);
            var absoluteDirectory = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), relativeDirectory);
            Directory.CreateDirectory(absoluteDirectory);

            var fileName = $"avatar_{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
            var relativePath = Path.Combine(relativeDirectory, fileName).Replace("\\", "/");
            await using (var stream = System.IO.File.Create(Path.Combine(absoluteDirectory, fileName)))
            {
                await file.CopyToAsync(stream);
            }

            student.AvatarPath = $"/{relativePath}";
            student.PendingAvatarPath = null;
            student.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        [HttpPost("{id:long}/avatar/approve")]
        public async Task<ActionResult<Student>> ApproveAvatar(long id)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.StudentId == id);
            if (student == null)
                return NotFound(new { message = "Không tìm thấy sinh viên.", studentId = id });
            if (string.IsNullOrWhiteSpace(student.PendingAvatarPath))
                return BadRequest(new { message = "Sinh viên chưa gửi ảnh chờ xác nhận." });

            student.AvatarPath = student.PendingAvatarPath;
            student.PendingAvatarPath = null;
            student.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(student);
        }


        // =====================================================
        // POST: api/Student
        // Thêm sinh viên
        // =====================================================
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(Student student)
        {
            // Kiểm tra mã sinh viên đã tồn tại
            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentCode == student.StudentCode);

            if (existingStudent != null)
            {
                return Conflict(new
                {
                    message = "Mã sinh viên đã tồn tại.",
                    studentCode = student.StudentCode
                });
            }

            // Tự động tạo thời gian
            student.CreatedAt = DateTime.Now;
            student.UpdatedAt = DateTime.Now;

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetStudent),
                new { id = student.StudentId },
                student
            );
        }


        // =====================================================
        // PUT: api/Student/1
        // Cập nhật sinh viên
        // =====================================================
        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateStudent(
            long id,
            Student student)
        {
            if (id != student.StudentId)
            {
                return BadRequest(new
                {
                    message = "ID trên URL không trùng với StudentId."
                });
            }

            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (existingStudent == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sinh viên.",
                    studentId = id
                });
            }

            // Kiểm tra mã sinh viên trùng với sinh viên khác
            var duplicateCode = await _context.Students
                .AnyAsync(s =>
                    s.StudentCode == student.StudentCode &&
                    s.StudentId != id);

            if (duplicateCode)
            {
                return Conflict(new
                {
                    message = "Mã sinh viên đã được sử dụng.",
                    studentCode = student.StudentCode
                });
            }

            // Cập nhật dữ liệu
            existingStudent.StudentCode = student.StudentCode;
            existingStudent.FullName = student.FullName;
            existingStudent.DateOfBirth = student.DateOfBirth;
            existingStudent.Gender = student.Gender;
            existingStudent.Email = student.Email;
            existingStudent.Phone = student.Phone;
            existingStudent.Faculty = student.Faculty;
            existingStudent.ClassName = student.ClassName;
            existingStudent.AcademicStatus = student.AcademicStatus;
            existingStudent.SisUpdatedAt = student.SisUpdatedAt;

            // Không cho client thay đổi CreatedAt
            // Tự cập nhật UpdatedAt
            existingStudent.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // =====================================================
        // DELETE: api/Student/1
        // Xóa sinh viên
        // =====================================================
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteStudent(long id)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sinh viên.",
                    studentId = id
                });
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}