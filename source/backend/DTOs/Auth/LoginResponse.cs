namespace QLNT_TKYC.API.DTOs.Auth;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;

    public long UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string? FullName { get; set; }

    public string? Role { get; set; }

    public DateTime ExpiresAt { get; set; }

    public StudentInfoDto? Student { get; set; }
}

public class StudentInfoDto
{
    public long StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Faculty { get; set; }
    public string? ClassName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}