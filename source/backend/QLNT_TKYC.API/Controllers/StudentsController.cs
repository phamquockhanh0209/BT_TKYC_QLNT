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