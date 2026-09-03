using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class RequestHistory
{
    public long RequestHistoryId { get; set; }

    public long RequestId { get; set; }

    public long? ChangedBy { get; set; }

    public string? OldStatus { get; set; }

    public string NewStatus { get; set; } = null!;

    public DateTime ChangedAt { get; set; }

    public string? Reason { get; set; }

    public string? Note { get; set; }

    public virtual User? ChangedByNavigation { get; set; }

    public virtual Request Request { get; set; } = null!;
}
