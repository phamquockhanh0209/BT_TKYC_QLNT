using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Approval
{
    public long ApprovalId { get; set; }

    public long? RegistrationId { get; set; }

    public long? RequestId { get; set; }

    public long ApproverId { get; set; }

    public string ApprovalType { get; set; } = null!;

    public string Decision { get; set; } = null!;

    public string? Reason { get; set; }

    public DateTime DecidedAt { get; set; }

    public virtual User? Approver { get; set; }

    public virtual Registration? Registration { get; set; }

    public virtual Request? Request { get; set; }
}
