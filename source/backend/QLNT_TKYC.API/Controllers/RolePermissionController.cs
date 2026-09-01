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
    public class RolePermissionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RolePermissionController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolePermission>>> GetRolePermissions()
        {
            return Ok(await _context.RolePermissions.AsNoTracking()
                .Include(x => x.Role).Include(x => x.Permission).Include(x => x.GrantedByNavigation)
                .OrderBy(x => x.RoleId).ThenBy(x => x.PermissionId).ToListAsync());
        }

        [HttpGet("{roleId:long}/{permissionId:long}")]
        public async Task<ActionResult<RolePermission>> GetRolePermission(long roleId, long permissionId)
        {
            var item = await _context.RolePermissions.AsNoTracking()
                .Include(x => x.Role).Include(x => x.Permission)
                .FirstOrDefaultAsync(x => x.RoleId == roleId && x.PermissionId == permissionId);
            return item == null ? NotFound(new { message = "Không tìm thấy quyền của vai trò." }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<RolePermission>> CreateRolePermission(RolePermission item)
        {
            if (!await _context.Roles.AnyAsync(r => r.RoleId == item.RoleId))
                return BadRequest(new { message = "Vai trò không tồn tại." });
            if (!await _context.Permissions.AnyAsync(p => p.PermissionId == item.PermissionId))
                return BadRequest(new { message = "Quyền không tồn tại." });
            if (await _context.RolePermissions.AnyAsync(x => x.RoleId == item.RoleId && x.PermissionId == item.PermissionId))
                return Conflict(new { message = "Vai trò đã có quyền này." });
            if (item.GrantedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.GrantedBy.Value))
                return BadRequest(new { message = "Người cấp quyền không tồn tại." });

            item.GrantedAt = DateTime.Now;
            _context.RolePermissions.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRolePermission), new { roleId = item.RoleId, permissionId = item.PermissionId }, item);
        }

        [HttpPut("{roleId:long}/{permissionId:long}")]
        public async Task<IActionResult> UpdateRolePermission(long roleId, long permissionId, RolePermission item)
        {
            var existing = await _context.RolePermissions.FirstOrDefaultAsync(x => x.RoleId == roleId && x.PermissionId == permissionId);
            if (existing == null) return NotFound(new { message = "Không tìm thấy quyền của vai trò." });

            if (item.GrantedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.GrantedBy.Value))
                return BadRequest(new { message = "Người cấp quyền không tồn tại." });

            existing.GrantedAt = item.GrantedAt;
            existing.GrantedBy = item.GrantedBy;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{roleId:long}/{permissionId:long}")]
        public async Task<IActionResult> DeleteRolePermission(long roleId, long permissionId)
        {
            var item = await _context.RolePermissions.FirstOrDefaultAsync(x => x.RoleId == roleId && x.PermissionId == permissionId);
            if (item == null) return NotFound(new { message = "Không tìm thấy quyền của vai trò." });
            _context.RolePermissions.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
