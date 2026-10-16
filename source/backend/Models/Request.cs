using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Request
{
    public long RequestId { get; set; }

    public long RegistrationId { get; set; }

    public long? CreatedBy { get; set; }

    public long? ProcessedBy { get; set; }

    public string RequestCode { get; set; } = null!;

    public string RequestType { get; set; } = null!;

    public string? Status { get; set; }

    public string? Reason { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime? RejectedAt { get; set; }

    public string? RejectionReason { get; set; }

    // FIX: Cột địa chỉ mới cho CHANGE_ADDRESS request (thêm bởi 07-fix-constraints.sql)
    public string? NewAddressLine { get; set; }
    public string? NewWard { get; set; }
    public string? NewDistrict { get; set; }
    public string? NewCity { get; set; }
    public long? NewLandlordId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual User? ProcessedByNavigation { get; set; }

    public virtual Registration? Registration { get; set; }

    public virtual ICollection<RequestHistory> RequestHistories { get; set; } = new List<RequestHistory>();

    public virtual ICollection<SlaTracking> SlaTrackings { get; set; } = new List<SlaTracking>();
}
