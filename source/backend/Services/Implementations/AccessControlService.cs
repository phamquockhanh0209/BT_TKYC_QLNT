using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations;

public class AccessControlService : IAccessControlService
{
    private static readonly string[] StaffRoles =
    {
        "ADMIN", "RECEIVER", "OFFICER", "PROCESSOR", "REVIEWER", "APPROVER", "SENIOR_APPROVER"
    };

    private readonly AppDbContext _context;

    public AccessControlService(AppDbContext context)
    {
        _context = context;
    }

    public bool IsStaff(ClaimsPrincipal user) =>
        StaffRoles.Any(user.IsInRole);

    public async Task<Student?> GetCurrentStudentAsync(ClaimsPrincipal user)
    {
        var studentCode = user.Identity?.Name;
        if (string.IsNullOrWhiteSpace(studentCode))
            return null;

        return await _context.Students
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentCode == studentCode);
    }

    public async Task<bool> CanAccessStudentAsync(ClaimsPrincipal user, long studentId)
    {
        if (IsStaff(user))
            return true;

        var student = await GetCurrentStudentAsync(user);
        return student?.StudentId == studentId;
    }

    public async Task<bool> CanAccessRegistrationAsync(ClaimsPrincipal user, long registrationId)
    {
        if (IsStaff(user))
            return true;

        var student = await GetCurrentStudentAsync(user);
        return student != null && await _context.Registrations
            .AsNoTracking()
            .AnyAsync(r => r.RegistrationId == registrationId && r.StudentId == student.StudentId);
    }

    public async Task<bool> CanAccessRequestAsync(ClaimsPrincipal user, long requestId)
    {
        if (IsStaff(user))
            return true;

        var student = await GetCurrentStudentAsync(user);
        return student != null && await _context.Requests
            .AsNoTracking()
            .AnyAsync(r => r.RequestId == requestId && r.RegistrationId != 0 &&
                _context.Registrations.Any(reg => reg.RegistrationId == r.RegistrationId && reg.StudentId == student.StudentId));
    }

    public async Task<bool> CanAccessDocumentAsync(ClaimsPrincipal user, long documentId)
    {
        if (IsStaff(user))
            return true;

        var student = await GetCurrentStudentAsync(user);
        return student != null && await _context.Documents
            .AsNoTracking()
            .AnyAsync(d => d.DocumentId == documentId && d.RegistrationId != 0 &&
                _context.Registrations.Any(reg => reg.RegistrationId == d.RegistrationId && reg.StudentId == student.StudentId));
    }
}