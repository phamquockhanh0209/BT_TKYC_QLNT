using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Permission
{
    public long PermissionId { get; set; }

    public string PermissionCode { get; set; } = null!;

    public string PermissionName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
