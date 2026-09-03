using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QLNT_TKYC.API.Data;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on a custom port to avoid port conflicts
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5005); // HTTP on port 5005
});

// =====================================================
// Add services to the container
// =====================================================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// =====================================================
// Database - SQL Server
// =====================================================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// =====================================================
// JWT Authentication
// =====================================================

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key chưa được cấu hình trong appsettings.json."
    );
}

builder.Services
    .AddAuthentication(options =>
    {
        // Cơ chế xác thực mặc định
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

        // Cơ chế kiểm tra quyền truy cập
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Kiểm tra chữ ký Token
            ValidateIssuerSigningKey = true,

            // Secret Key dùng để kiểm tra chữ ký
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),

            // Kiểm tra Issuer
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            // Kiểm tra Audience
            ValidateAudience = true,
            ValidAudience = jwtAudience,

            // Kiểm tra thời hạn Token
            ValidateLifetime = true,

            // Không cho phép sai lệch thời gian quá nhiều
            ClockSkew = TimeSpan.Zero
        };
    });

// =====================================================
// Swagger + JWT Authorize Configuration
// =====================================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo
    {
        Title = "QLNT_TKYC.API",
        Version = "v1",
        Description = "Hệ thống Quản lý Ngoại trú Sinh viên (QLNT_TKYC)"
    });

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.ParameterLocation.Header,
        Description = "Nhập JWT Bearer token vào ô bên dưới."
    });

    options.AddSecurityRequirement(document => new Microsoft.OpenApi.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.OpenApiSecuritySchemeReference("Bearer", document),
            new List<string>()
        }
    });
});

// =====================================================
// CORS Configuration
// =====================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register business services
builder.Services.AddScoped<QLNT_TKYC.API.Services.Interfaces.IRegistrationService, QLNT_TKYC.API.Services.Implementations.RegistrationService>();
builder.Services.AddScoped<QLNT_TKYC.API.Services.Interfaces.INotificationService, QLNT_TKYC.API.Services.Implementations.NotificationService>();
builder.Services.AddScoped<QLNT_TKYC.API.Services.Interfaces.ISlaService, QLNT_TKYC.API.Services.Implementations.SlaService>();
builder.Services.AddScoped<QLNT_TKYC.API.Services.Interfaces.IDocumentService, QLNT_TKYC.API.Services.Implementations.DocumentService>();
builder.Services.AddScoped<QLNT_TKYC.API.Services.Interfaces.IReportService, QLNT_TKYC.API.Services.Implementations.ReportService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddValidatorsFromAssemblyContaining<QLNT_TKYC.API.Validators.Registration.CreateDraftRegistrationDtoValidator>();

var app = builder.Build();

// =====================================================
// Development
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =====================================================
// HTTP Pipeline
// =====================================================

app.UseHttpsRedirection();

// Cho phép load file tĩnh giao diện web
app.UseDefaultFiles();
app.UseStaticFiles();

// CORS
app.UseCors("AllowAll");

// JWT Authentication
app.UseAuthentication();

// Authorization
app.UseAuthorization();

app.MapControllers();

// Register business services


app.Run();