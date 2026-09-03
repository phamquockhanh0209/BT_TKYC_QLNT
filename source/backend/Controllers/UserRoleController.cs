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
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserRoleController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRole>>> GetUserRoles()
        {
            return Ok(await _context.UserRoles.AsNoTracking()
                .Include(x => x.User).Include(x => x.Role).Include(x => x.AssignedByNavigation)
                .OrderBy(x => x.UserId).ThenBy(x => x.RoleId).ToListAsync());
        }

        [HttpGet("{userId:long}/{roleId:long}")]
        public async Task<ActionResult<UserRole>> GetUserRole(long userId, long roleId)
        {
            var item = await _context.UserRoles.AsNoTracking()
                .Include(x => x.User).Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.UserId == userId && x.RoleId == roleId);
            return item == null ? NotFound(new { message = "Không tìm thấy phân quyền người dùng." }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<UserRole>> CreateUserRole(UserRole item)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == item.UserId))
                return BadRequest(new { message = "Người dùng không tồn tại." });
            if (!await _context.Roles.AnyAsync(r => r.RoleId == item.RoleId))
                return BadRequest(new { message = "Vai trò không tồn tại." });
            if (await _context.UserRoles.AnyAsync(x => x.UserId == item.UserId && x.RoleId == item.RoleId))
                return Conflict(new { message = "Người dùng đã được gán vai trò này." });

            if (item.AssignedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.AssignedBy.Value))
                return BadRequest(new { message = "Người thực hiện gán quyền không tồn tại." });

            item.AssignedAt = DateTime.Now;
            _context.UserRoles.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserRole), new { userId = item.UserId, roleId = item.RoleId }, item);
        }

        [HttpPut("{userId:long}/{roleId:long}")]
        public async Task<IActionResult> UpdateUserRole(long userId, long roleId, UserRole item)
        {
            var existing = await _context.UserRoles.FirstOrDefaultAsync(x => x.UserId == userId && x.RoleId == roleId);
            if (existing == null) return NotFound(new { message = "Không tìm thấy phân quyền người dùng." });

            if (item.AssignedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.AssignedBy.Value))
                return BadRequest(new { message = "Người thực hiện gán quyền không tồn tại." });

            existing.AssignedAt = item.AssignedAt;
            existing.AssignedBy = item.AssignedBy;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{userId:long}/{roleId:long}")]
        public async Task<IActionResult> DeleteUserRole(long userId, long roleId)
        {
            var item = await _context.UserRoles.FirstOrDefaultAsync(x => x.UserId == userId && x.RoleId == roleId);
            if (item == null) return NotFound(new { message = "Không tìm thấy phân quyền người dùng." });
            _context.UserRoles.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
