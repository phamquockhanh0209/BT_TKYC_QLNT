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
    public class ConfigurationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ConfigurationController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Configuration>>> GetConfigurations()
        {
            return Ok(await _context.Configurations.AsNoTracking()
                .Include(c => c.UpdatedByNavigation)
                .OrderBy(c => c.ConfigurationId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Configuration>> GetConfiguration(long id)
        {
            var item = await _context.Configurations.AsNoTracking()
                .Include(c => c.UpdatedByNavigation)
                .FirstOrDefaultAsync(c => c.ConfigurationId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy cấu hình.", configurationId = id }) : Ok(item);
        }

        [HttpGet("key/{configKey}")]
        public async Task<ActionResult<Configuration>> GetByKey(string configKey)
        {
            var item = await _context.Configurations.AsNoTracking().FirstOrDefaultAsync(c => c.ConfigKey == configKey);
            return item == null ? NotFound(new { message = "Không tìm thấy cấu hình.", configKey }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Configuration>> CreateConfiguration(Configuration item)
        {
            if (await _context.Configurations.AnyAsync(c => c.ConfigKey == item.ConfigKey))
                return Conflict(new { message = "ConfigKey đã tồn tại.", configKey = item.ConfigKey });
            if (item.UpdatedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.UpdatedBy.Value))
                return BadRequest(new { message = "Người cập nhật không tồn tại." });

            item.UpdatedAt = DateTime.Now;
            _context.Configurations.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetConfiguration), new { id = item.ConfigurationId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateConfiguration(long id, Configuration item)
        {
            if (id != item.ConfigurationId) return BadRequest(new { message = "ID trên URL không trùng ConfigurationId." });
            var existing = await _context.Configurations.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy cấu hình.", configurationId = id });
            if (await _context.Configurations.AnyAsync(c => c.ConfigKey == item.ConfigKey && c.ConfigurationId != id))
                return Conflict(new { message = "ConfigKey đã được sử dụng." });

            existing.ConfigKey = item.ConfigKey;
            existing.ConfigValue = item.ConfigValue;
            existing.DataType = item.DataType;
            existing.Description = item.Description;
            existing.UpdatedBy = item.UpdatedBy;
            existing.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteConfiguration(long id)
        {
            var item = await _context.Configurations.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy cấu hình.", configurationId = id });
            _context.Configurations.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
