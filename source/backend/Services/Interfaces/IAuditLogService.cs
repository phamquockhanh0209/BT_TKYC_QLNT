using System.Threading.Tasks;

namespace QLNT_TKYC.API.Services.Interfaces
{
    public interface IAuditLogService
    {
        Task LogAsync(
            long? userId,
            string action,
            string entityType,
            long? entityId = null,
            string? oldValue = null,
            string? newValue = null,
            string? reason = null,
            string? source = null);
    }
}
