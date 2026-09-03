using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class AuditLog
{
    public long AuditLogId { get; set; }

    public long? UserId { get; set; }

    public string Action { get; set; } = null!;

    public string EntityType { get; set; } = null!;

    public long? EntityId { get; set; }

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public string? Reason { get; set; }

    public string? Source { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
