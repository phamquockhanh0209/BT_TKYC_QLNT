using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class StudentCache
{
    public long StudentCacheId { get; set; }

    public string StudentCode { get; set; } = null!;

    public string? FullName { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Faculty { get; set; }

    public string? ClassName { get; set; }

    public string? AcademicStatus { get; set; }

    public DateTime? SisUpdatedAt { get; set; }

    public DateTime LastSyncAt { get; set; }
}
