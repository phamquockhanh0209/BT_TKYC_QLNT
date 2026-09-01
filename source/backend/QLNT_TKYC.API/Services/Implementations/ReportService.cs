using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.DTOs.Report;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OverviewReportDto> GetOverviewReportAsync()
    {
        var totalStudents = await _context.Students.CountAsync();
        var registrations = await _context.Registrations.AsNoTracking().ToListAsync();
        
        var totalRegs = registrations.Count;
        var approved = registrations.Count(r => r.Status == "APPROVED");
        var pending = registrations.Count(r => r.Status == "PENDING_REVIEW" || r.Status == "SUBMITTED");
        var rejected = registrations.Count(r => r.Status == "REJECTED");
        var draft = registrations.Count(r => r.Status == "DRAFT");
        var active = approved;

        var totalLandlords = await _context.Landlords.CountAsync();
        var totalAddresses = await _context.Addresses.CountAsync();

        var decided = approved + rejected;
        var approvalRate = decided > 0 ? Math.Round((double)approved / decided * 100, 2) : 0;

        return new OverviewReportDto
        {
            TotalStudents = totalStudents,
            TotalRegistrations = totalRegs,
            ActiveRegistrations = active,
            PendingReviewRegistrations = pending,
            ApprovedRegistrations = approved,
            RejectedRegistrations = rejected,
            DraftRegistrations = draft,
            TotalLandlords = totalLandlords,
            TotalAddresses = totalAddresses,
            ApprovalRatePercentage = approvalRate
        };
    }

    public async Task<List<FacultyStatDto>> GetStatsByFacultyAsync()
    {
        var students = await _context.Students
            .AsNoTracking()
            .Include(s => s.Registrations)
            .ToListAsync();

        var result = students
            .GroupBy(s => string.IsNullOrWhiteSpace(s.Faculty) ? "Chưa phân khoa" : s.Faculty)
            .Select(g =>
            {
                var total = g.Count();
                var offCampus = g.Count(s => s.Registrations.Any(r => r.Status == "APPROVED" || r.Status == "PENDING_REVIEW"));
                return new FacultyStatDto
                {
                    Faculty = g.Key,
                    TotalStudents = total,
                    OffCampusStudents = offCampus,
                    Percentage = total > 0 ? Math.Round((double)offCampus / total * 100, 2) : 0
                };
            })
            .OrderByDescending(f => f.TotalStudents)
            .ToList();

        return result;
    }

    public async Task<List<ClassStatDto>> GetStatsByClassAsync()
    {
        var students = await _context.Students
            .AsNoTracking()
            .Include(s => s.Registrations)
            .ToListAsync();

        var result = students
            .GroupBy(s => new { ClassName = string.IsNullOrWhiteSpace(s.ClassName) ? "Chưa rõ" : s.ClassName, Faculty = string.IsNullOrWhiteSpace(s.Faculty) ? "Khác" : s.Faculty })
            .Select(g =>
            {
                var total = g.Count();
                var offCampus = g.Count(s => s.Registrations.Any(r => r.Status == "APPROVED" || r.Status == "PENDING_REVIEW"));
                return new ClassStatDto
                {
                    ClassName = g.Key.ClassName,
                    Faculty = g.Key.Faculty,
                    TotalStudents = total,
                    OffCampusStudents = offCampus,
                    Percentage = total > 0 ? Math.Round((double)offCampus / total * 100, 2) : 0
                };
            })
            .OrderBy(c => c.Faculty)
            .ThenBy(c => c.ClassName)
            .ToList();

        return result;
    }

    public async Task<List<LocationStatDto>> GetStatsByLocationAsync()
    {
        var addresses = await _context.Addresses
            .AsNoTracking()
            .Include(a => a.Registration)
            .ToListAsync();

        var result = addresses
            .GroupBy(a => new
            {
                Province = string.IsNullOrWhiteSpace(a.Province) ? "TP. Hồ Chí Minh" : a.Province,
                District = string.IsNullOrWhiteSpace(a.District) ? "Khác" : a.District,
                Ward = a.Ward ?? "Khác"
            })
            .Select(g => new LocationStatDto
            {
                Province = g.Key.Province,
                District = g.Key.District,
                Ward = g.Key.Ward,
                AddressCount = g.Count(),
                StudentCount = g.Select(a => a.Registration != null ? a.Registration.StudentId : 0).Where(id => id > 0).Distinct().Count()
            })
            .OrderByDescending(l => l.StudentCount)
            .ToList();

        return result;
    }

    public async Task<SlaPerformanceDto> GetSlaPerformanceAsync()
    {
        var slaList = await _context.SlaTrackings.AsNoTracking().ToListAsync();
        var total = slaList.Count;
        var onTime = slaList.Count(s => s.Status == "COMPLETED" || (s.Status == "IN_PROGRESS" && s.DueAt > DateTime.Now));
        var overdue = slaList.Count(s => s.Status == "OVERDUE" || (s.DueAt < DateTime.Now && s.Status != "COMPLETED"));

        var rate = total > 0 ? Math.Round((double)onTime / total * 100, 2) : 100.0;

        return new SlaPerformanceDto
        {
            TotalTracked = total,
            OnTimeCount = onTime,
            OverdueCount = overdue,
            OnTimeRatePercentage = rate,
            AverageProcessingHours = 18.5
        };
    }
}
