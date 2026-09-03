using System;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations
{
    /// <summary>
    /// Handles document upload, storage and versioning.
    /// Enforces a maximum file size of 10 MiB.
    /// </summary>
    public class DocumentService : IDocumentService
    {
        private const long MaxFileSize = 10 * 1024 * 1024; // 10 MiB
        private readonly AppDbContext _dbContext;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DocumentService(AppDbContext dbContext, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Document> UploadAsync(IFormFile file, long registrationId)
        {
            if (file == null)
                throw new ArgumentNullException(nameof(file), "File must be provided.");

            if (file.Length > MaxFileSize)
                throw new InvalidOperationException($"File size exceeds the limit of {MaxFileSize / (1024 * 1024)} MiB.");

            // Ensure the registration exists
            var registration = await _dbContext.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == registrationId);
            if (registration == null)
                throw new InvalidOperationException($"Registration with ID {registrationId} not found.");

            // Determine storage path: uploads/documents/yyyy/MM/
            var now = DateTime.UtcNow;
            var relativePath = Path.Combine("uploads", "documents", now.Year.ToString(), now.Month.ToString("D2"));
            var absolutePath = Path.Combine(_env.ContentRootPath, relativePath);
            Directory.CreateDirectory(absolutePath);

            // Generate a unique file name to avoid collisions
            var safeFileName = Path.GetFileName(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
            var fullFilePath = Path.Combine(absolutePath, uniqueFileName);

            // Save the file to disk
            using (var stream = new FileStream(fullFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Compute SHA‑256 hash of the saved file
            string fileHash;
            using (var sha256 = SHA256.Create())
            using (var stream = new FileStream(fullFilePath, FileMode.Open, FileAccess.Read))
            {
                var hashBytes = await sha256.ComputeHashAsync(stream);
                fileHash = BitConverter.ToString(hashBytes).Replace("-", string.Empty).ToLowerInvariant();
            }

            // Retrieve or create the Document entity for the registration
            var document = await _dbContext.Documents
                .Include(d => d.DocumentVersions)
                .FirstOrDefaultAsync(d => d.RegistrationId == registrationId);

            if (document == null)
            {
                document = new Document
                {
                    RegistrationId = registrationId,
                    DocumentStatus = "PENDING",
                    DocumentType = "DEFAULT", // Adjust as needed
                    RequiredFlag = true,
                    CreatedAt = now,
                    UpdatedAt = now,
                    CurrentVersion = 1
                };
                _dbContext.Documents.Add(document);
                await _dbContext.SaveChangesAsync(); // obtain DocumentId
            }
            else
            {
                // Increment version number
                document.CurrentVersion += 1;
                document.UpdatedAt = now;
            }

            // Mark previous versions as not current
            if (document.DocumentVersions != null)
            {
                foreach (var oldVersion in document.DocumentVersions)
                {
                    oldVersion.IsCurrent = false;
                }
            }

            // Determine uploadedBy (user id) from JWT claim if available
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;
            long? uploadedBy = null;
            if (long.TryParse(userId, out var uid))
                uploadedBy = uid;

            var newVersion = new DocumentVersion
            {
                DocumentId = document.DocumentId,
                FileName = safeFileName,
                FilePath = Path.Combine(relativePath, uniqueFileName).Replace("\\", "/"), // store as forward‑slashes
                FileHash = fileHash,
                VersionNo = document.CurrentVersion,
                IsCurrent = true,
                UploadedAt = now,
                UploadedBy = uploadedBy
            };

            _dbContext.DocumentVersions.Add(newVersion);
            await _dbContext.SaveChangesAsync();

            return document;
        }

        /// <summary>
        /// Retrieves the current (latest) version of a document.
        /// </summary>
        public async Task<DocumentVersion?> GetCurrentVersionAsync(long documentId)
        {
            return await _dbContext.DocumentVersions
                .FirstOrDefaultAsync(v => v.DocumentId == documentId && v.IsCurrent);
        }
    }
}
