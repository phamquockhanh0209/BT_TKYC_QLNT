using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Escalation
{
    public long EscalationId { get; set; }

    public long SlaTrackingId { get; set; }

    public long? AssignedTo { get; set; }

    public int EscalationLevel { get; set; }

    public string? Reason { get; set; }

    public DateTime EscalatedAt { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public string Status { get; set; } = null!;

    public virtual User? AssignedToNavigation { get; set; }

    public virtual SlaTracking SlaTracking { get; set; } = null!;
}
