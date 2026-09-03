using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using Microsoft.AspNetCore.Http;
using QLNT_TKYC.API.Services.Interfaces;
using QLNT_TKYC.API.DTOs.Document;
using System.IO;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDocumentService _documentService;

        public DocumentController(AppDbContext context, IDocumentService documentService)
        {
            _context = context;
            _documentService = documentService;
        }

        // =====================================================
        // GET: api/Document
        // Lấy tất cả tài liệu
        // =====================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Document>>> GetDocuments()
        {
            var documents = await _context.Documents
                .AsNoTracking()
                .Include(d => d.Registration)
                .OrderByDescending(d => d.DocumentId)
                .ToListAsync();

            return Ok(documents);
        }

        // =====================================================
        // GET: api/Document/1
        // Lấy tài liệu theo ID
        // =====================================================
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Document>> GetDocument(long id)
        {
            var document = await _context.Documents
                .AsNoTracking()
                .Include(d => d.Registration)
                .FirstOrDefaultAsync(d => d.DocumentId == id);

            if (document == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy tài liệu.",
                    documentId = id
                });
            }

            return Ok(document);
        }

        // =====================================================
        // GET: api/Document/registration/1
        // Lấy tài liệu theo hồ sơ đăng ký
        // =====================================================
        [HttpGet("registration/{registrationId:long}")]
        public async Task<ActionResult<IEnumerable<Document>>>
            GetDocumentsByRegistration(long registrationId)
        {
            var registrationExists = await _context.Registrations
                .AnyAsync(r => r.RegistrationId == registrationId);

            if (!registrationExists)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy hồ sơ đăng ký.",
                    registrationId = registrationId
                });
            }

            var documents = await _context.Documents
                .AsNoTracking()
                .Where(d => d.RegistrationId == registrationId)
                .OrderByDescending(d => d.DocumentId)
                .ToListAsync();

            return Ok(documents);
        }

        // =====================================================
        // POST: api/Document
        // Tạo tài liệu
        // =====================================================
        [HttpPost]
        public async Task<ActionResult<Document>> CreateDocument(
            Document document)
        {
            // Kiểm tra Registration tồn tại
            var registrationExists = await _context.Registrations
                .AnyAsync(r => r.RegistrationId == document.RegistrationId);

            if (!registrationExists)
            {
                return BadRequest(new
                {
                    message = "Hồ sơ đăng ký không tồn tại.",
                    registrationId = document.RegistrationId
                });
            }

            // Kiểm tra DocumentType
            if (string.IsNullOrWhiteSpace(document.DocumentType))
            {
                return BadRequest(new
                {
                    message = "DocumentType không được để trống."
                });
            }

            // Giá trị mặc định
            if (string.IsNullOrWhiteSpace(document.DocumentStatus))
            {
                document.DocumentStatus = "UPLOADED";
            }

            if (document.CurrentVersion <= 0)
            {
                document.CurrentVersion = 1;
            }

            document.CreatedAt = DateTime.Now;
            document.UpdatedAt = DateTime.Now;

            _context.Documents.Add(document);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetDocument),
                new { id = document.DocumentId },
                document
            );
        }

        // POST: api/Document/upload
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Document>> Upload([FromForm] UploadDocumentDto dto)
        {
            var doc = await _documentService.UploadAsync(dto.File, dto.RegistrationId);
            return CreatedAtAction(nameof(GetDocument), new { id = doc.DocumentId }, doc);
        }

        // =====================================================
        // PUT: api/Document/1
        // Cập nhật tài liệu
        // =====================================================
        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateDocument(
            long id,
            Document document)
        {
            if (id != document.DocumentId)
            {
                return BadRequest(new
                {
                    message = "ID trên URL không trùng với DocumentId."
                });
            }

            var existingDocument = await _context.Documents
                .FirstOrDefaultAsync(d => d.DocumentId == id);

            if (existingDocument == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy tài liệu.",
                    documentId = id
                });
            }

            // Kiểm tra Registration
            var registrationExists = await _context.Registrations
                .AnyAsync(r => r.RegistrationId == document.RegistrationId);

            if (!registrationExists)
            {
                return BadRequest(new
                {
                    message = "Hồ sơ đăng ký không tồn tại.",
                    registrationId = document.RegistrationId
                });
            }

            // Kiểm tra DocumentType
            if (string.IsNullOrWhiteSpace(document.DocumentType))
            {
                return BadRequest(new
                {
                    message = "DocumentType không được để trống."
                });
            }

            // Cập nhật
            existingDocument.RegistrationId = document.RegistrationId;
            existingDocument.DocumentType = document.DocumentType;
            existingDocument.DocumentStatus = document.DocumentStatus;
            existingDocument.CurrentVersion = document.CurrentVersion;
            existingDocument.RequiredFlag = document.RequiredFlag;

            // Không cho client sửa CreatedAt
            existingDocument.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // =====================================================
        // DELETE: api/Document/1
        // Xóa tài liệu
        // =====================================================
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteDocument(long id)
        {
            var document = await _context.Documents
                .FirstOrDefaultAsync(d => d.DocumentId == id);

            if (document == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy tài liệu.",
                    documentId = id
                });
            }

            _context.Documents.Remove(document);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}