using System.Threading.Tasks;

namespace QLNT_TKYC.API.Services.Interfaces
{
    public interface ISlaService
    {
        Task StartSlaTrackingAsync(string slaType, long? registrationId = null, long? requestId = null);
        Task MarkCompletedAsync(long slaTrackingId);
    }
}
