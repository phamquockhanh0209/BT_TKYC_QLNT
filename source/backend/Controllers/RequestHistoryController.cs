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
    public class RequestHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RequestHistoryController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RequestHistory>>> GetHistories()
        {
            return Ok(await _context.RequestHistories.AsNoTracking()
                .Include(h => h.Request).Include(h => h.ChangedByNavigation)
                .OrderByDescending(h => h.RequestHistoryId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<RequestHistory>> GetHistory(long id)
        {
            var item = await _context.RequestHistories.AsNoTracking()
                .Include(h => h.Request).Include(h => h.ChangedByNavigation)
                .FirstOrDefaultAsync(h => h.RequestHistoryId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy lịch sử yêu cầu.", requestHistoryId = id }) : Ok(item);
        }

        [HttpGet("request/{requestId:long}")]
        public async Task<ActionResult<IEnumerable<RequestHistory>>> GetByRequest(long requestId)
        {
            if (!await _context.Requests.AnyAsync(r => r.RequestId == requestId))
                return NotFound(new { message = "Không tìm thấy yêu cầu.", requestId });
            return Ok(await _context.RequestHistories.AsNoTracking()
                .Where(h => h.RequestId == requestId).OrderByDescending(h => h.ChangedAt).ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<RequestHistory>> CreateHistory(RequestHistory item)
        {
            if (!await _context.Requests.AnyAsync(r => r.RequestId == item.RequestId))
                return BadRequest(new { message = "Yêu cầu không tồn tại." });
            if (item.ChangedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.ChangedBy.Value))
                return BadRequest(new { message = "Người thay đổi không tồn tại." });

            item.ChangedAt = DateTime.Now;
            _context.RequestHistories.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHistory), new { id = item.RequestHistoryId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateHistory(long id, RequestHistory item)
        {
            if (id != item.RequestHistoryId) return BadRequest(new { message = "ID trên URL không trùng RequestHistoryId." });
            var existing = await _context.RequestHistories.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy lịch sử yêu cầu.", requestHistoryId = id });

            if (!await _context.Requests.AnyAsync(r => r.RequestId == item.RequestId))
                return BadRequest(new { message = "Yêu cầu không tồn tại." });

            existing.RequestId = item.RequestId;
            existing.ChangedBy = item.ChangedBy;
            existing.OldStatus = item.OldStatus;
            existing.NewStatus = item.NewStatus;
            existing.ChangedAt = item.ChangedAt;
            existing.Reason = item.Reason;
            existing.Note = item.Note;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteHistory(long id)
        {
            var item = await _context.RequestHistories.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy lịch sử yêu cầu.", requestHistoryId = id });
            _context.RequestHistories.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
