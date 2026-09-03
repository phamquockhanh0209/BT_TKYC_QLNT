using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class RolePermission
{
    public long RoleId { get; set; }

    public long PermissionId { get; set; }

    public DateTime GrantedAt { get; set; }

    public long? GrantedBy { get; set; }

    public virtual User? GrantedByNavigation { get; set; }

    public virtual Permission Permission { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}
