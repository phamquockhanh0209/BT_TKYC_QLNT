using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RegistrationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegistrationController(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET: api/Registration
        // Lấy tất cả hồ sơ đăng ký
        // =====================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Registration>>> GetRegistrations()
        {
            var registrations = await _context.Registrations
                .AsNoTracking()
                .Include(r => r.Student)
                .OrderByDescending(r => r.RegistrationId)
                .ToListAsync();

            return Ok(registrations);
        }

        // =====================================================
        // GET: api/Registration/1
        // Lấy hồ sơ theo ID
        // =====================================================
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Registration>> GetRegistration(long id)
        {
            var registration = await _context.Registrations
                .AsNoTracking()
                .Include(r => r.Student)
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
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.RegistrationId)
                .ToListAsync();

            return Ok(registrations);
        }

        // =====================================================
        // POST: api/Registration
        // Tạo hồ sơ đăng ký
        // =====================================================
        [HttpPost]
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