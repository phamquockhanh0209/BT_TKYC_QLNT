using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Student
{
    public long StudentId { get; set; }

    public string StudentCode { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Faculty { get; set; }

    public string? ClassName { get; set; }

    public string? AcademicStatus { get; set; }

    public DateTime? SisUpdatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
