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
    public class EscalationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EscalationController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Escalation>>> GetEscalations()
        {
            return Ok(await _context.Escalations.AsNoTracking()
                .Include(e => e.SlaTracking).Include(e => e.AssignedToNavigation)
                .OrderByDescending(e => e.EscalationId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Escalation>> GetEscalation(long id)
        {
            var item = await _context.Escalations.AsNoTracking()
                .Include(e => e.SlaTracking).Include(e => e.AssignedToNavigation)
                .FirstOrDefaultAsync(e => e.EscalationId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy escalation.", escalationId = id }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Escalation>> CreateEscalation(Escalation item)
        {
            if (!await _context.SlaTrackings.AnyAsync(s => s.SlaTrackingId == item.SlaTrackingId))
                return BadRequest(new { message = "SLA tracking không tồn tại." });
            if (item.AssignedTo.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.AssignedTo.Value))
                return BadRequest(new { message = "Người được phân công không tồn tại." });
            if (item.EscalationLevel < 1) return BadRequest(new { message = "EscalationLevel phải >= 1." });

            item.EscalatedAt = DateTime.Now;
            if (string.IsNullOrWhiteSpace(item.Status)) item.Status = "OPEN";
            _context.Escalations.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEscalation), new { id = item.EscalationId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateEscalation(long id, Escalation item)
        {
            if (id != item.EscalationId) return BadRequest(new { message = "ID trên URL không trùng EscalationId." });
            var existing = await _context.Escalations.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy escalation.", escalationId = id });

            if (!await _context.SlaTrackings.AnyAsync(s => s.SlaTrackingId == item.SlaTrackingId))
                return BadRequest(new { message = "SLA tracking không tồn tại." });

            existing.SlaTrackingId = item.SlaTrackingId;
            existing.AssignedTo = item.AssignedTo;
            existing.EscalationLevel = item.EscalationLevel;
            existing.Reason = item.Reason;
            existing.EscalatedAt = item.EscalatedAt;
            existing.ResolvedAt = item.ResolvedAt;
            existing.Status = item.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteEscalation(long id)
        {
            var item = await _context.Escalations.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy escalation.", escalationId = id });
            _context.Escalations.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
