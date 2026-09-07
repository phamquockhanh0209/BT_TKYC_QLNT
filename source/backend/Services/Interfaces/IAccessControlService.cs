using System.Security.Claims;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Services.Interfaces;

public interface IAccessControlService
{
    bool IsStaff(ClaimsPrincipal user);
    Task<Student?> GetCurrentStudentAsync(ClaimsPrincipal user);
    Task<bool> CanAccessStudentAsync(ClaimsPrincipal user, long studentId);
    Task<bool> CanAccessRegistrationAsync(ClaimsPrincipal user, long registrationId);
    Task<bool> CanAccessRequestAsync(ClaimsPrincipal user, long requestId);
    Task<bool> CanAccessDocumentAsync(ClaimsPrincipal user, long documentId);
}