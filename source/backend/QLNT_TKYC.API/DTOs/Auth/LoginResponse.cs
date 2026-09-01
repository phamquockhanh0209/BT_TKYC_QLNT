namespace QLNT_TKYC.API.DTOs.Auth;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;

    public long UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string? Role { get; set; }

    public DateTime ExpiresAt { get; set; }
}