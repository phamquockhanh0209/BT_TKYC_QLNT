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
    public class RequestController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RequestController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequests()
        {
            return Ok(await _context.Requests.AsNoTracking()
                .Include(r => r.Registration).Include(r => r.CreatedByNavigation).Include(r => r.ProcessedByNavigation)
                .OrderByDescending(r => r.RequestId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Request>> GetRequest(long id)
        {
            var item = await _context.Requests.AsNoTracking()
                .Include(r => r.Registration).Include(r => r.CreatedByNavigation).Include(r => r.ProcessedByNavigation)
                .FirstOrDefaultAsync(r => r.RequestId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id }) : Ok(item);
        }

        [HttpGet("registration/{registrationId:long}")]
        public async Task<ActionResult<IEnumerable<Request>>> GetByRegistration(long registrationId)
        {
            if (!await _context.Registrations.AnyAsync(r => r.RegistrationId == registrationId))
                return NotFound(new { message = "Không tìm thấy hồ sơ đăng ký.", registrationId });
            return Ok(await _context.Requests.AsNoTracking()
                .Where(r => r.RegistrationId == registrationId)
                .OrderByDescending(r => r.RequestId).ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Request>> CreateRequest(Request item)
        {
            if (!await _context.Registrations.AnyAsync(r => r.RegistrationId == item.RegistrationId))
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });
            if (item.CreatedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.CreatedBy.Value))
                return BadRequest(new { message = "Người tạo không tồn tại." });
            if (item.ProcessedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.ProcessedBy.Value))
                return BadRequest(new { message = "Người xử lý không tồn tại." });
            if (await _context.Requests.AnyAsync(r => r.RequestCode == item.RequestCode))
                return Conflict(new { message = "Mã yêu cầu đã tồn tại.", requestCode = item.RequestCode });

            item.Status = "DRAFT";
            item.CreatedAt = DateTime.Now;
            item.UpdatedAt = DateTime.Now;
            _context.Requests.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRequest), new { id = item.RequestId }, item);
        }

        [HttpPut("{id:long}")]
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
        public async Task<IActionResult> DeleteRequest(long id)
        {
            var item = await _context.Requests.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId = id });
            _context.Requests.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
