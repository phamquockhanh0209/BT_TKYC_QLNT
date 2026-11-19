using System.Threading;
using System.Threading.Tasks;

namespace QLNT_TKYC.API.Services.Interfaces
{
    public interface ISystemSchedulerService
    {
        Task<SchedulerExecutionResult> RunScheduledTasksAsync(CancellationToken cancellationToken = default);
    }

    public class SchedulerExecutionResult
    {
        public int ExpiredRegistrationsCount { get; set; }
        public int UpcomingRemindersCount { get; set; }
        public int OverdueSlaCount { get; set; }
        public int EscalationsCreatedCount { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
