using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class User
{
    public long UserId { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? LastLoginAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Approval> Approvals { get; set; } = new List<Approval>();

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();

    public virtual ICollection<DocumentVersion> DocumentVersions { get; set; } = new List<DocumentVersion>();

    public virtual ICollection<Escalation> Escalations { get; set; } = new List<Escalation>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Request> RequestCreatedByNavigations { get; set; } = new List<Request>();

    public virtual ICollection<RequestHistory> RequestHistories { get; set; } = new List<RequestHistory>();

    public virtual ICollection<Request> RequestProcessedByNavigations { get; set; } = new List<Request>();

    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    public virtual ICollection<UserRole> UserRoleAssignedByNavigations { get; set; } = new List<UserRole>();

    public virtual ICollection<UserRole> UserRoleUsers { get; set; } = new List<UserRole>();
}
