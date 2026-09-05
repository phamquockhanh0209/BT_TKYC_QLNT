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
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RoleController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            return Ok(await _context.Roles.AsNoTracking()
                .Include(r => r.UserRoles)
                .OrderBy(r => r.RoleId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Role>> GetRole(long id)
        {
            var item = await _context.Roles.AsNoTracking().FirstOrDefaultAsync(r => r.RoleId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy vai trò.", roleId = id }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Role>> CreateRole(Role item)
        {
            if (await _context.Roles.AnyAsync(r => r.RoleCode == item.RoleCode))
                return Conflict(new { message = "RoleCode đã tồn tại.", roleCode = item.RoleCode });
            _context.Roles.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRole), new { id = item.RoleId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateRole(long id, Role item)
        {
            if (id != item.RoleId) return BadRequest(new { message = "ID trên URL không trùng RoleId." });
            var existing = await _context.Roles.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy vai trò.", roleId = id });
            if (await _context.Roles.AnyAsync(r => r.RoleCode == item.RoleCode && r.RoleId != id))
                return Conflict(new { message = "RoleCode đã được sử dụng." });

            existing.RoleCode = item.RoleCode;
            existing.RoleName = item.RoleName;
            existing.Description = item.Description;
            existing.Status = item.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteRole(long id)
        {
            var item = await _context.Roles.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy vai trò.", roleId = id });
            _context.Roles.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
