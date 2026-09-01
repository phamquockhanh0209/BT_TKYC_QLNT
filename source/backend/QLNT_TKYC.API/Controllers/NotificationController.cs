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
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NotificationController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            return Ok(await _context.Notifications.AsNoTracking()
                .Include(n => n.User).Include(n => n.Registration).Include(n => n.Request)
                .OrderByDescending(n => n.NotificationId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Notification>> GetNotification(long id)
        {
            var item = await _context.Notifications.AsNoTracking()
                .Include(n => n.User).Include(n => n.Registration).Include(n => n.Request)
                .FirstOrDefaultAsync(n => n.NotificationId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy thông báo.", notificationId = id }) : Ok(item);
        }

        [HttpGet("user/{userId:long}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetByUser(long userId)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == userId))
                return NotFound(new { message = "Không tìm thấy người dùng.", userId });
            return Ok(await _context.Notifications.AsNoTracking()
                .Where(n => n.UserId == userId).OrderByDescending(n => n.NotificationId).ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Notification>> CreateNotification(Notification item)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == item.UserId))
                return BadRequest(new { message = "Người dùng không tồn tại." });
            if (item.RegistrationId.HasValue && !await _context.Registrations.AnyAsync(r => r.RegistrationId == item.RegistrationId))
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });
            if (item.RequestId.HasValue && !await _context.Requests.AnyAsync(r => r.RequestId == item.RequestId))
                return BadRequest(new { message = "Yêu cầu không tồn tại." });

            item.CreatedAt = DateTime.Now;
            if (!item.IsRead) item.ReadAt = null;
            _context.Notifications.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNotification), new { id = item.NotificationId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateNotification(long id, Notification item)
        {
            if (id != item.NotificationId) return BadRequest(new { message = "ID trên URL không trùng NotificationId." });
            var existing = await _context.Notifications.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy thông báo.", notificationId = id });

            if (!await _context.Users.AnyAsync(u => u.UserId == item.UserId))
                return BadRequest(new { message = "Người dùng không tồn tại." });

            existing.UserId = item.UserId;
            existing.RegistrationId = item.RegistrationId;
            existing.RequestId = item.RequestId;
            existing.NotificationType = item.NotificationType;
            existing.Title = item.Title;
            existing.Message = item.Message;
            existing.IsRead = item.IsRead;
            existing.ReadAt = item.IsRead ? (item.ReadAt ?? DateTime.Now) : null;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id:long}/read")]
        public async Task<IActionResult> MarkAsRead(long id)
        {
            var item = await _context.Notifications.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy thông báo.", notificationId = id });
            item.IsRead = true;
            item.ReadAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteNotification(long id)
        {
            var item = await _context.Notifications.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy thông báo.", notificationId = id });
            _context.Notifications.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
