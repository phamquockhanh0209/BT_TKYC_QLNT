using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN,OFFICER")]
    public class StudentCacheController : ControllerBase
    {
        private readonly AppDbContext _context;
        public StudentCacheController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentCache>>> GetStudentCaches()
        {
            return Ok(await _context.StudentCaches.AsNoTracking()
                .OrderByDescending(s => s.StudentCacheId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<StudentCache>> GetStudentCache(long id)
        {
            var item = await _context.StudentCaches.AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentCacheId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy student cache.", studentCacheId = id }) : Ok(item);
        }

        [HttpGet("student-code/{studentCode}")]
        public async Task<ActionResult<StudentCache>> GetByStudentCode(string studentCode)
        {
            var item = await _context.StudentCaches.AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentCode == studentCode);
            return item == null ? NotFound(new { message = "Không tìm thấy student cache.", studentCode }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<StudentCache>> CreateStudentCache(StudentCache item)
        {
            if (await _context.StudentCaches.AnyAsync(s => s.StudentCode == item.StudentCode))
                return Conflict(new { message = "StudentCode đã tồn tại trong cache.", studentCode = item.StudentCode });

            item.LastSyncAt = DateTime.Now;
            _context.StudentCaches.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStudentCache), new { id = item.StudentCacheId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateStudentCache(long id, StudentCache item)
        {
            if (id != item.StudentCacheId) return BadRequest(new { message = "ID trên URL không trùng StudentCacheId." });
            var existing = await _context.StudentCaches.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy student cache.", studentCacheId = id });
            if (await _context.StudentCaches.AnyAsync(s => s.StudentCode == item.StudentCode && s.StudentCacheId != id))
                return Conflict(new { message = "StudentCode đã được sử dụng trong cache." });

            existing.StudentCode = item.StudentCode;
            existing.FullName = item.FullName;
            existing.DateOfBirth = item.DateOfBirth;
            existing.Gender = item.Gender;
            existing.Email = item.Email;
            existing.Phone = item.Phone;
            existing.Faculty = item.Faculty;
            existing.ClassName = item.ClassName;
            existing.AcademicStatus = item.AcademicStatus;
            existing.SisUpdatedAt = item.SisUpdatedAt;
            existing.LastSyncAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteStudentCache(long id)
        {
            var item = await _context.StudentCaches.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy student cache.", studentCacheId = id });
            _context.StudentCaches.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
