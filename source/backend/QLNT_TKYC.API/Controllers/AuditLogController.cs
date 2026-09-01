using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class AuditLogController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuditLogController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs()
        {
            return Ok(await _context.AuditLogs.AsNoTracking()
                .Include(a => a.User)
                .OrderByDescending(a => a.AuditLogId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<AuditLog>> GetAuditLog(long id)
        {
            var item = await _context.AuditLogs.AsNoTracking().Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AuditLogId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy audit log.", auditLogId = id }) : Ok(item);
        }

        [HttpGet("entity/{entityType}/{entityId:long}")]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetByEntity(string entityType, long entityId)
        {
            return Ok(await _context.AuditLogs.AsNoTracking()
                .Where(a => a.EntityType == entityType && a.EntityId == entityId)
                .OrderByDescending(a => a.CreatedAt).ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<AuditLog>> CreateAuditLog(AuditLog item)
        {
            if (item.UserId.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.UserId.Value))
                return BadRequest(new { message = "Người dùng không tồn tại." });
            item.CreatedAt = DateTime.Now;
            _context.AuditLogs.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAuditLog), new { id = item.AuditLogId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateAuditLog(long id, AuditLog item)
        {
            if (id != item.AuditLogId) return BadRequest(new { message = "ID trên URL không trùng AuditLogId." });
            var existing = await _context.AuditLogs.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy audit log.", auditLogId = id });

            existing.UserId = item.UserId;
            existing.Action = item.Action;
            existing.EntityType = item.EntityType;
            existing.EntityId = item.EntityId;
            existing.OldValue = item.OldValue;
            existing.NewValue = item.NewValue;
            existing.Reason = item.Reason;
            existing.Source = item.Source;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteAuditLog(long id)
        {
            var item = await _context.AuditLogs.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy audit log.", auditLogId = id });
            _context.AuditLogs.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
