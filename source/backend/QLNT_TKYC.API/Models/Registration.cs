using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Registration
{
    public long RegistrationId { get; set; }

    public long StudentId { get; set; }

    public string RegistrationCode { get; set; } = null!;

    public string? Status { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime? RejectedAt { get; set; }

    public string? RejectionReason { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public DateTime? TerminatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();

    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual ICollection<SlaTracking> SlaTrackings { get; set; } = new List<SlaTracking>();

    public virtual Student? Student { get; set; }
}
