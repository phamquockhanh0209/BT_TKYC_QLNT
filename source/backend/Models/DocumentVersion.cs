using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class DocumentVersion
{
    public long DocumentVersionId { get; set; }

    public long DocumentId { get; set; }

    public long? UploadedBy { get; set; }

    public int VersionNo { get; set; }

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string? FileHash { get; set; }

    public DateTime UploadedAt { get; set; }

    public string? ReplacementReason { get; set; }

    public bool IsCurrent { get; set; }

    public virtual Document Document { get; set; } = null!;

    public virtual User? UploadedByNavigation { get; set; }
}
