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
    public class DocumentVersionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DocumentVersionController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentVersion>>> GetDocumentVersions()
        {
            return Ok(await _context.DocumentVersions.AsNoTracking()
                .Include(v => v.Document).Include(v => v.UploadedByNavigation)
                .OrderByDescending(v => v.DocumentVersionId).ToListAsync());
        }

        [HttpGet("{id:long}")]
        public async Task<ActionResult<DocumentVersion>> GetDocumentVersion(long id)
        {
            var item = await _context.DocumentVersions.AsNoTracking()
                .Include(v => v.Document).Include(v => v.UploadedByNavigation)
                .FirstOrDefaultAsync(v => v.DocumentVersionId == id);
            return item == null ? NotFound(new { message = "Không tìm thấy phiên bản tài liệu.", documentVersionId = id }) : Ok(item);
        }

        [HttpGet("document/{documentId:long}")]
        public async Task<ActionResult<IEnumerable<DocumentVersion>>> GetByDocument(long documentId)
        {
            if (!await _context.Documents.AnyAsync(d => d.DocumentId == documentId))
                return NotFound(new { message = "Không tìm thấy tài liệu.", documentId });
            return Ok(await _context.DocumentVersions.AsNoTracking()
                .Where(v => v.DocumentId == documentId)
                .OrderByDescending(v => v.VersionNo).ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<DocumentVersion>> CreateDocumentVersion(DocumentVersion item)
        {
            if (!await _context.Documents.AnyAsync(d => d.DocumentId == item.DocumentId))
                return BadRequest(new { message = "Tài liệu không tồn tại.", documentId = item.DocumentId });

            if (item.UploadedBy.HasValue && !await _context.Users.AnyAsync(u => u.UserId == item.UploadedBy.Value))
                return BadRequest(new { message = "Người upload không tồn tại.", uploadedBy = item.UploadedBy });

            if (item.VersionNo < 1) return BadRequest(new { message = "VersionNo phải >= 1." });

            if (await _context.DocumentVersions.AnyAsync(v => v.DocumentId == item.DocumentId && v.VersionNo == item.VersionNo))
                return Conflict(new { message = "VersionNo đã tồn tại cho tài liệu này." });

            if (item.IsCurrent)
            {
                var current = await _context.DocumentVersions.Where(v => v.DocumentId == item.DocumentId && v.IsCurrent).ToListAsync();
                foreach (var v in current) v.IsCurrent = false;
            }

            item.UploadedAt = DateTime.Now;
            _context.DocumentVersions.Add(item);

            var document = await _context.Documents.FindAsync(item.DocumentId);
            if (document != null && item.VersionNo > document.CurrentVersion)
            {
                document.CurrentVersion = item.VersionNo;
                document.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDocumentVersion), new { id = item.DocumentVersionId }, item);
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateDocumentVersion(long id, DocumentVersion item)
        {
            if (id != item.DocumentVersionId) return BadRequest(new { message = "ID trên URL không trùng DocumentVersionId." });
            var existing = await _context.DocumentVersions.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy phiên bản tài liệu.", documentVersionId = id });

            if (!await _context.Documents.AnyAsync(d => d.DocumentId == item.DocumentId))
                return BadRequest(new { message = "Tài liệu không tồn tại." });

            if (await _context.DocumentVersions.AnyAsync(v => v.DocumentId == item.DocumentId && v.VersionNo == item.VersionNo && v.DocumentVersionId != id))
                return Conflict(new { message = "VersionNo đã tồn tại cho tài liệu này." });

            if (item.IsCurrent)
            {
                var others = await _context.DocumentVersions.Where(v => v.DocumentId == item.DocumentId && v.DocumentVersionId != id).ToListAsync();
                foreach (var v in others) v.IsCurrent = false;
            }

            existing.DocumentId = item.DocumentId;
            existing.UploadedBy = item.UploadedBy;
            existing.VersionNo = item.VersionNo;
            existing.FileName = item.FileName;
            existing.FilePath = item.FilePath;
            existing.FileHash = item.FileHash;
            existing.ReplacementReason = item.ReplacementReason;
            existing.IsCurrent = item.IsCurrent;

            var document = await _context.Documents.FindAsync(item.DocumentId);
            if (document != null && item.VersionNo > document.CurrentVersion)
            {
                document.CurrentVersion = item.VersionNo;
                document.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteDocumentVersion(long id)
        {
            var item = await _context.DocumentVersions.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy phiên bản tài liệu.", documentVersionId = id });
            _context.DocumentVersions.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
