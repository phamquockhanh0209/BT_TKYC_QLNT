using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN,REVIEWER,OFFICER")]
    public class ApprovalController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ApprovalController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Approval>>> GetApprovals()
        {
            return Ok(await _context.Approvals.AsNoTracking()
                .Include(a => a.Approver)
                .Include(a => a.Registration)
                .Include(a => a.Request)
                .OrderByDescending(a => a.ApprovalId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<Approval>> GetApproval(long id)
        {
            var item = await _context.Approvals.AsNoTracking()
                .Include(a => a.Approver).Include(a => a.Registration).Include(a => a.Request)
                .FirstOrDefaultAsync(a => a.ApprovalId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy phê duyệt.", approvalId = id }) : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<Approval>> CreateApproval(Approval item)
        {
            if ((item.RegistrationId.HasValue ? 1 : 0) + (item.RequestId.HasValue ? 1 : 0) != 1)
                return BadRequest(new { message = "Approval phải thuộc Registration hoặc Request, không được đồng thời cả hai." });

            if (item.ApprovalType is not ("REGISTRATION" or "REQUEST"))
                return BadRequest(new { message = "ApprovalType không hợp lệ." });

            if (item.Decision is not ("APPROVED" or "REJECTED"))
                return BadRequest(new { message = "Decision không hợp lệ." });

            if (item.ApprovalType == "REGISTRATION" && !item.RegistrationId.HasValue ||
                item.ApprovalType == "REQUEST" && !item.RequestId.HasValue)
                return BadRequest(new { message = "ApprovalType không khớp đối tượng phê duyệt." });

            if (!await _context.Users.AnyAsync(u => u.UserId == item.ApproverId))
                return BadRequest(new { message = "Người phê duyệt không tồn tại.", approverId = item.ApproverId });

            if (item.RegistrationId.HasValue && !await _context.Registrations.AnyAsync(r => r.RegistrationId == item.RegistrationId))
                return BadRequest(new { message = "Hồ sơ đăng ký không tồn tại." });

            if (item.RequestId.HasValue && !await _context.Requests.AnyAsync(r => r.RequestId == item.RequestId))
                return BadRequest(new { message = "Yêu cầu không tồn tại." });

            item.DecidedAt = DateTime.Now;
            _context.Approvals.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetApproval), new { id = item.ApprovalId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateApproval(long id, Approval item)
        {
            if (id != item.ApprovalId) return BadRequest(new { message = "ID trên URL không trùng ApprovalId." });
            var existing = await _context.Approvals.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy phê duyệt.", approvalId = id });

            if ((item.RegistrationId.HasValue ? 1 : 0) + (item.RequestId.HasValue ? 1 : 0) != 1)
                return BadRequest(new { message = "Approval phải thuộc Registration hoặc Request." });

            if (item.ApproverId != existing.ApproverId &&
                !await _context.Users.AnyAsync(u => u.UserId == item.ApproverId))
                return BadRequest(new { message = "Người phê duyệt không tồn tại." });

            existing.RegistrationId = item.RegistrationId;
            existing.RequestId = item.RequestId;
            existing.ApproverId = item.ApproverId;
            existing.ApprovalType = item.ApprovalType;
            existing.Decision = item.Decision;
            existing.Reason = item.Reason;
            existing.DecidedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteApproval(long id)
        {
            var item = await _context.Approvals.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy phê duyệt.", approvalId = id });
            _context.Approvals.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
