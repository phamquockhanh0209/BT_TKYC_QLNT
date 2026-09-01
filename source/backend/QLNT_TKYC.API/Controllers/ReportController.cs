using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLNT_TKYC.API.DTOs.Report;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Báo cáo tổng quan số lượng sinh viên, hồ sơ, chủ trọ và tỷ lệ duyệt
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<OverviewReportDto>> GetOverviewReport()
    {
        var result = await _reportService.GetOverviewReportAsync();
        return Ok(result);
    }

    /// <summary>
    /// Thống kê số lượng & tỷ lệ sinh viên ngoại trú theo từng Khoa
    /// </summary>
    [HttpGet("by-faculty")]
    public async Task<ActionResult<List<FacultyStatDto>>> GetStatsByFaculty()
    {
        var result = await _reportService.GetStatsByFacultyAsync();
        return Ok(result);
    }

    /// <summary>
    /// Thống kê số lượng & tỷ lệ sinh viên ngoại trú theo từng Lớp
    /// </summary>
    [HttpGet("by-class")]
    public async Task<ActionResult<List<ClassStatDto>>> GetStatsByClass()
    {
        var result = await _reportService.GetStatsByClassAsync();
        return Ok(result);
    }

    /// <summary>
    /// Thống kê phân bố sinh viên ngoại trú theo Khu vực (Tỉnh/Thành, Quận/Huyện, Phường/Xã)
    /// </summary>
    [HttpGet("by-location")]
    public async Task<ActionResult<List<LocationStatDto>>> GetStatsByLocation()
    {
        var result = await _reportService.GetStatsByLocationAsync();
        return Ok(result);
    }

    /// <summary>
    /// Thống kê hiệu suất xử lý hồ sơ và thời hạn SLA
    /// </summary>
    [HttpGet("sla-performance")]
    public async Task<ActionResult<SlaPerformanceDto>> GetSlaPerformance()
    {
        var result = await _reportService.GetSlaPerformanceAsync();
        return Ok(result);
    }
}
