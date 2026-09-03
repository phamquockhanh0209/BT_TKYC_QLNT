namespace QLNT_TKYC.API.DTOs.Registration;

public class CreateDraftRegistrationDto
{
    public long StudentId { get; set; }
    // TODO: add fields for initial address or other required data
}

public class RequestMoreInfoDto
{
    public string Reason { get; set; } = null!;
    public int AttemptNumber { get; set; }
}
