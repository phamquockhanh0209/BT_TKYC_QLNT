using System.Threading.Tasks;

namespace QLNT_TKYC.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendAsync(string userIdOrCode, string title, string message);
        Task SendToUserAsync(long userId, string title, string message, string notificationType = "INFO", long? registrationId = null, long? requestId = null);
    }
}
