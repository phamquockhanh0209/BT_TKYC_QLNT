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

public class FullRegistrationRequestDto
{
    public long StudentId { get; set; }
    public string? StudentCode { get; set; }

    // Địa chỉ ngoại trú
    public string AddressLine { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Province { get; set; } = "TP. Hồ Chí Minh";
    public DateOnly StartDate { get; set; }
    public DateOnly ExpiryDate { get; set; }

    // Thông tin chủ trọ
    public string? LandlordFullName { get; set; }
    public string? LandlordPhone { get; set; }
    public string? LandlordIdentityNumber { get; set; }
    public string? RoomNumber { get; set; }
    public string? Note { get; set; }
}

public class ReviewActionDto
{
    public string Action { get; set; } = null!; // "PASS", "REQUEST_INFO", "REJECT"
    public string? Note { get; set; }
    public long? ApproverId { get; set; }
}
