using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class SlaTracking
{
    public long SlaTrackingId { get; set; }

    public long? RegistrationId { get; set; }

    public long? RequestId { get; set; }

    public string SlaType { get; set; } = null!;

    public DateTime StartedAt { get; set; }

    public DateTime DueAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? OverdueAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Escalation> Escalations { get; set; } = new List<Escalation>();

    public virtual Registration? Registration { get; set; }

    public virtual Request? Request { get; set; }
}
