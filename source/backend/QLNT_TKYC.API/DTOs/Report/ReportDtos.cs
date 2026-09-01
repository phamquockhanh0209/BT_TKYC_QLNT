namespace QLNT_TKYC.API.DTOs.Report;

public class OverviewReportDto
{
    public int TotalStudents { get; set; }
    public int TotalRegistrations { get; set; }
    public int ActiveRegistrations { get; set; }
    public int PendingReviewRegistrations { get; set; }
    public int ApprovedRegistrations { get; set; }
    public int RejectedRegistrations { get; set; }
    public int DraftRegistrations { get; set; }
    public int TotalLandlords { get; set; }
    public int TotalAddresses { get; set; }
    public double ApprovalRatePercentage { get; set; }
}

public class FacultyStatDto
{
    public string Faculty { get; set; } = null!;
    public int TotalStudents { get; set; }
    public int OffCampusStudents { get; set; }
    public double Percentage { get; set; }
}

public class ClassStatDto
{
    public string ClassName { get; set; } = null!;
    public string Faculty { get; set; } = null!;
    public int TotalStudents { get; set; }
    public int OffCampusStudents { get; set; }
    public double Percentage { get; set; }
}

public class LocationStatDto
{
    public string Province { get; set; } = null!;
    public string District { get; set; } = null!;
    public string? Ward { get; set; }
    public int StudentCount { get; set; }
    public int AddressCount { get; set; }
}

public class SlaPerformanceDto
{
    public int TotalTracked { get; set; }
    public int OnTimeCount { get; set; }
    public int OverdueCount { get; set; }
    public double OnTimeRatePercentage { get; set; }
    public double AverageProcessingHours { get; set; }
}
