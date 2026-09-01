using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.DTOs.Auth;
using QLNT_TKYC.API.Models;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QLNT_TKYC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // =====================================================
    // POST: api/Auth/login
    // Đăng nhập
    // =====================================================

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request)
    {
        // -------------------------------------------------
        // 1. Kiểm tra dữ liệu đầu vào
        // -------------------------------------------------

        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Username và Password không được để trống."
            });
        }

        // -------------------------------------------------
        // 2. Tìm User
        // -------------------------------------------------

        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Username == request.Username);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Username hoặc Password không chính xác."
            });
        }

        // -------------------------------------------------
        // 3. Kiểm tra trạng thái User
        // -------------------------------------------------

        if (user.Status != "ACTIVE")
        {
            return Unauthorized(new
            {
                message = "Tài khoản hiện không hoạt động.",
                status = user.Status
            });
        }

        // -------------------------------------------------
        // 4. Kiểm tra Password
        // -------------------------------------------------

        bool passwordValid;

        try
        {
            passwordValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );
        }
        catch
        {
            return Unauthorized(new
            {
                message = "PasswordHash của tài khoản không hợp lệ."
            });
        }

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Username hoặc Password không chính xác."
            });
        }

        // -------------------------------------------------
        // 5. Lấy Role của User
        // User → UserRole → Role
        // -------------------------------------------------

        var roles = await _context.UserRoles
            .Where(ur => ur.UserId == user.UserId)
            .Include(ur => ur.Role)
            .Where(ur => ur.Role.Status == "ACTIVE")
            .Select(ur => ur.Role.RoleCode)
            .ToListAsync();

        // -------------------------------------------------
        // 6. Cập nhật LastLoginAt
        // -------------------------------------------------

        user.LastLoginAt = DateTime.Now;
        user.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        // -------------------------------------------------
        // 7. Tạo JWT Token
        // -------------------------------------------------

        var token = GenerateJwtToken(user, roles);

        var expiresAt = DateTime.Now.AddHours(2);

        return Ok(new LoginResponse
        {
            Token = token,
            UserId = user.UserId,
            Username = user.Username,

            // Nếu có nhiều Role thì lấy Role đầu tiên
            Role = roles.FirstOrDefault() ?? "STUDENT",

            ExpiresAt = expiresAt
        });
    }

    // =====================================================
    // POST: api/Auth/reset-default-passwords
    // Tự động khởi tạo/cập nhật mật khẩu '123456' cho các user mẫu
    // =====================================================

    [HttpPost("reset-default-passwords")]
    public async Task<IActionResult> ResetDefaultPasswords()
    {
        var defaultUsers = new[] { "admin", "officer01", "reviewer01", "student01", "student02" };
        var users = await _context.Users
            .Where(u => defaultUsers.Contains(u.Username))
            .ToListAsync();

        if (users.Count == 0)
        {
            return NotFound(new
            {
                message = "Không tìm thấy người dùng mẫu nào trong bảng USER. Vui lòng kiểm tra đã chạy seed data SQL chưa."
            });
        }

        string newHash = BCrypt.Net.BCrypt.HashPassword("123456");

        foreach (var u in users)
        {
            u.PasswordHash = newHash;
            u.Status = "ACTIVE";
            u.UpdatedAt = DateTime.Now;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Đã cập nhật mật khẩu '123456' thành công cho các tài khoản!",
            accounts = users.Select(u => new { u.UserId, u.Username, u.Status }),
            defaultPassword = "123456"
        });
    }

    // =====================================================
    // Tạo JWT Token
    // =====================================================

    private string GenerateJwtToken(
        Models.User user,
        List<string> roles)
    {
        var jwtKey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT Key chưa được cấu hình."
            );
        }

        // -------------------------------------------------
        // Claims
        // -------------------------------------------------

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.UserId.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.Username
            ),

            new Claim(
                "FullName",
                user.FullName
            )
        };

        // -------------------------------------------------
        // Thêm Role vào JWT
        // -------------------------------------------------

        foreach (var role in roles)
        {
            claims.Add(
                new Claim(ClaimTypes.Role, role)
            );
        }

        // -------------------------------------------------
        // Secret Key
        // -------------------------------------------------

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        // -------------------------------------------------
        // Tạo Token
        // -------------------------------------------------

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}