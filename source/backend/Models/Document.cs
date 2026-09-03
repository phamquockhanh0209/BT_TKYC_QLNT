using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Document
{
    public long DocumentId { get; set; }

    public long RegistrationId { get; set; }

    public string DocumentType { get; set; } = null!;

    public string? DocumentStatus { get; set; }

    public int CurrentVersion { get; set; }

    public bool RequiredFlag { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<DocumentVersion> DocumentVersions { get; set; } = new List<DocumentVersion>();

    public virtual Registration? Registration { get; set; }
}
