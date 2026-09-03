using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Configuration
{
    public long ConfigurationId { get; set; }

    public string ConfigKey { get; set; } = null!;

    public string? ConfigValue { get; set; }

    public string? DataType { get; set; }

    public string? Description { get; set; }

    public long? UpdatedBy { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User? UpdatedByNavigation { get; set; }
}
