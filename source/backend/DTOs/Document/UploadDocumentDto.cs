namespace QLNT_TKYC.API.DTOs.Document;

public class UploadDocumentDto
{
    public required IFormFile File { get; set; }
    public long RegistrationId { get; set; }
    public string? DocumentType { get; set; }
}
