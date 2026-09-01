using System.Threading.Tasks;

namespace QLNT_TKYC.API.Services.Interfaces;

public interface INotificationService
{
    Task SendAsync(string userId, string title, string message);
}
