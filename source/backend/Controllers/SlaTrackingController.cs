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
    public class SlaTrackingController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SlaTrackingController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SlaTracking>>> GetSlaTrackings()
        {
            return Ok(await _context.SlaTrackings.AsNoTracking()
                .Include(s => s.Registration).Include(s => s.Request)
                .OrderByDescending(s => s.SlaTrackingId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<SlaTracking>> GetSlaTracking(long id)
        {
            var item = await _context.SlaTrackings.AsNoTracking()
                .Include(s => s.Registration).Include(s => s.Request)
                .FirstOrDefaultAsync(s => s.SlaTrackingId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy SLA tracking.", slaTrackingId = id }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<SlaTracking>> CreateSlaTracking(SlaTracking item)
        {
            if ((item.RegistrationId.HasValue ? 1 : 0) + (item.RequestId.HasValue ? 1 : 0) != 1)
                return BadRequest(new { message = "SLA phải gắn với Registration hoặc Request." });
            if (item.RegistrationId.HasValue && !await _context.Registrations.AnyAsync(r => r.RegistrationId == item.RegistrationId))
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });
            if (item.RequestId.HasValue && !await _context.Requests.AnyAsync(r => r.RequestId == item.RequestId))
                return BadRequest(new { message = "Yêu cầu không tồn tại." });
            if (item.DueAt < item.StartedAt) return BadRequest(new { message = "DueAt phải >= StartedAt." });

            item.CreatedAt = DateTime.Now;
            _context.SlaTrackings.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSlaTracking), new { id = item.SlaTrackingId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateSlaTracking(long id, SlaTracking item)
        {
            if (id != item.SlaTrackingId) return BadRequest(new { message = "ID trên URL không trùng SlaTrackingId." });
            var existing = await _context.SlaTrackings.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy SLA tracking.", slaTrackingId = id });
            if ((item.RegistrationId.HasValue ? 1 : 0) + (item.RequestId.HasValue ? 1 : 0) != 1)
                return BadRequest(new { message = "SLA phải gắn với Registration hoặc Request." });
            if (item.DueAt < item.StartedAt) return BadRequest(new { message = "DueAt phải >= StartedAt." });

            existing.RegistrationId = item.RegistrationId;
            existing.RequestId = item.RequestId;
            existing.SlaType = item.SlaType;
            existing.StartedAt = item.StartedAt;
            existing.DueAt = item.DueAt;
            existing.CompletedAt = item.CompletedAt;
            existing.Status = item.Status;
            existing.OverdueAt = item.OverdueAt;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteSlaTracking(long id)
        {
            var item = await _context.SlaTrackings.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy SLA tracking.", slaTrackingId = id });
            _context.SlaTrackings.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
