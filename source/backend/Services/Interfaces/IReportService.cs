using QLNT_TKYC.API.DTOs.Report;

namespace QLNT_TKYC.API.Services.Interfaces;

public interface IReportService
{
    Task<OverviewReportDto> GetOverviewReportAsync();
    Task<List<FacultyStatDto>> GetStatsByFacultyAsync();
    Task<List<ClassStatDto>> GetStatsByClassAsync();
    Task<List<LocationStatDto>> GetStatsByLocationAsync();
    Task<SlaPerformanceDto> GetSlaPerformanceAsync();
    Task<List<StatusStatDto>> GetStatsByStatusAsync();
    Task<List<TimeStatDto>> GetStatsByTimeAsync(DateTime? fromDate, DateTime? toDate);
}
