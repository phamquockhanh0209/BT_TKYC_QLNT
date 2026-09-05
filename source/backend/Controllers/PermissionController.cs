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
    public class PermissionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PermissionController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Permission>>> GetPermissions()
        {
            return Ok(await _context.Permissions.AsNoTracking()
                .Include(p => p.RolePermissions).ThenInclude(rp => rp.Role)
                .OrderBy(p => p.PermissionId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Permission>> GetPermission(long id)
        {
            var item = await _context.Permissions.AsNoTracking().FirstOrDefaultAsync(p => p.PermissionId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy quyền.", permissionId = id }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Permission>> CreatePermission(Permission item)
        {
            if (await _context.Permissions.AnyAsync(p => p.PermissionCode == item.PermissionCode))
                return Conflict(new { message = "PermissionCode đã tồn tại.", permissionCode = item.PermissionCode });
            _context.Permissions.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPermission), new { id = item.PermissionId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdatePermission(long id, Permission item)
        {
            if (id != item.PermissionId) return BadRequest(new { message = "ID trên URL không trùng PermissionId." });
            var existing = await _context.Permissions.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy quyền.", permissionId = id });
            if (await _context.Permissions.AnyAsync(p => p.PermissionCode == item.PermissionCode && p.PermissionId != id))
                return Conflict(new { message = "PermissionCode đã được sử dụng." });

            existing.PermissionCode = item.PermissionCode;
            existing.PermissionName = item.PermissionName;
            existing.Description = item.Description;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeletePermission(long id)
        {
            var item = await _context.Permissions.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy quyền.", permissionId = id });
            _context.Permissions.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
