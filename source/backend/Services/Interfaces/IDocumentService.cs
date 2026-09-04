using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Services.Interfaces
{
    /// <summary>
    /// Service for handling document upload and management.
    /// </summary>
    public interface IDocumentService
    {
        /// <summary>
        /// Upload a document file associated with a registration.
        /// </summary>
        /// <param name="file">The uploaded file (max 10 MB).</param>
        /// <param name="registrationId">Id of the registration to which the document belongs.</param>
        /// <returns>The created <see cref="Document"/> entity.</returns>
        Task<Document> UploadAsync(IFormFile file, long registrationId, string? documentType = null);

        /// <summary>
        /// Retrieves the current (latest) version of a document.
        /// </summary>
        /// <param name="documentId">Document identifier.</param>
        /// <returns>The current DocumentVersion or null if not found.</returns>
        Task<DocumentVersion?> GetCurrentVersionAsync(long documentId);
    }
}
