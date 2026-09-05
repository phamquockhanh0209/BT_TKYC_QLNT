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
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return Ok(await _context.Users.AsNoTracking()
                .Include(u => u.UserRoleUsers).ThenInclude(ur => ur.Role)
                .OrderBy(u => u.UserId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var item = await _context.Users.AsNoTracking()
                .Include(u => u.UserRoleUsers).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy người dùng.", userId = id }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User item)
        {
            if (await _context.Users.AnyAsync(u => u.Username == item.Username))
                return Conflict(new { message = "Username đã tồn tại.", username = item.Username });
            item.CreatedAt = DateTime.Now;
            item.UpdatedAt = DateTime.Now;
            _context.Users.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = item.UserId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateUser(long id, User item)
        {
            if (id != item.UserId) return BadRequest(new { message = "ID trên URL không trùng UserId." });
            var existing = await _context.Users.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy người dùng.", userId = id });
            if (await _context.Users.AnyAsync(u => u.Username == item.Username && u.UserId != id))
                return Conflict(new { message = "Username đã được sử dụng." });

            existing.Username = item.Username;
            existing.PasswordHash = item.PasswordHash;
            existing.FullName = item.FullName;
            existing.Email = item.Email;
            existing.Phone = item.Phone;
            existing.Status = item.Status;
            existing.LastLoginAt = item.LastLoginAt;
            existing.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var item = await _context.Users.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy người dùng.", userId = id });
            _context.Users.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
