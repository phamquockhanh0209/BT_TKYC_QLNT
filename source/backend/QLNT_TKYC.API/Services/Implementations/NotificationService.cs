using System.Threading.Tasks;

namespace QLNT_TKYC.API.Services.Implementations
{
    public class NotificationService : QLNT_TKYC.API.Services.Interfaces.INotificationService
    {

        public Task SendAsync(string userId, string title, string message)
        {
            // Simple placeholder implementation – log to console.
            System.Console.WriteLine($"[Notification] UserId={userId}, Title={title}, Message={message}");
            return Task.CompletedTask;
        }
    }
}
