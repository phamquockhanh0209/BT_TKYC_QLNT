using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Approval> Approvals { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<Configuration> Configurations { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<DocumentVersion> DocumentVersions { get; set; }

    public virtual DbSet<Escalation> Escalations { get; set; }

    public virtual DbSet<Landlord> Landlords { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Registration> Registrations { get; set; }

    public virtual DbSet<Request> Requests { get; set; }

    public virtual DbSet<RequestHistory> RequestHistories { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<SlaTracking> SlaTrackings { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<StudentCache> StudentCaches { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.ToTable("ADDRESS");

            entity.HasIndex(e => e.LandlordId, "IX_ADDRESS_LANDLORD");

            entity.HasIndex(e => e.RegistrationId, "IX_ADDRESS_REGISTRATION");

            entity.Property(e => e.AddressId).HasColumnName("address_id");
            entity.Property(e => e.AddressLine)
                .HasMaxLength(255)
                .HasColumnName("address_line");
            entity.Property(e => e.AddressType)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("address_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_ADDRESS_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.District)
                .HasMaxLength(100)
                .HasColumnName("district");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.LandlordId).HasColumnName("landlord_id");
            entity.Property(e => e.Province)
                .HasMaxLength(100)
                .HasColumnName("province");
            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("CURRENT", "DF_ADDRESS_STATUS")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_ADDRESS_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.Ward)
                .HasMaxLength(100)
                .HasColumnName("ward");

            entity.HasOne(d => d.Landlord).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.LandlordId)
                .HasConstraintName("FK_ADDRESS_LANDLORD");

            entity.HasOne(d => d.Registration).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.RegistrationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ADDRESS_REGISTRATION");
        });

        modelBuilder.Entity<Approval>(entity =>
        {
            entity.ToTable("APPROVAL");

            entity.HasIndex(e => e.ApproverId, "IX_APPROVAL_APPROVER");

            entity.HasIndex(e => e.RegistrationId, "IX_APPROVAL_REGISTRATION");

            entity.HasIndex(e => e.RequestId, "IX_APPROVAL_REQUEST");

            entity.Property(e => e.ApprovalId).HasColumnName("approval_id");
            entity.Property(e => e.ApprovalType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("approval_type");
            entity.Property(e => e.ApproverId).HasColumnName("approver_id");
            entity.Property(e => e.DecidedAt)
                .HasDefaultValueSql("(getdate())", "DF_APPROVAL_DECIDED_AT")
                .HasColumnType("datetime")
                .HasColumnName("decided_at");
            entity.Property(e => e.Decision)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("decision");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.RequestId).HasColumnName("request_id");

            entity.HasOne(d => d.Approver).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.ApproverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_APPROVAL_APPROVER");

            entity.HasOne(d => d.Registration).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.RegistrationId)
                .HasConstraintName("FK_APPROVAL_REGISTRATION");

            entity.HasOne(d => d.Request).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK_APPROVAL_REQUEST");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AUDIT_LOG");

            entity.HasIndex(e => e.UserId, "IX_AUDIT_LOG_USER");

            entity.Property(e => e.AuditLogId).HasColumnName("audit_log_id");
            entity.Property(e => e.Action)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("action");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_AUDIT_LOG_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.EntityId).HasColumnName("entity_id");
            entity.Property(e => e.EntityType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("entity_type");
            entity.Property(e => e.NewValue).HasColumnName("new_value");
            entity.Property(e => e.OldValue).HasColumnName("old_value");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.Source)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("source");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_AUDIT_LOG_USER");
        });

        modelBuilder.Entity<Configuration>(entity =>
        {
            entity.ToTable("CONFIGURATION");

            entity.HasIndex(e => e.UpdatedBy, "IX_CONFIGURATION_USER");

            entity.HasIndex(e => e.ConfigKey, "UQ_CONFIGURATION_KEY").IsUnique();

            entity.Property(e => e.ConfigurationId).HasColumnName("configuration_id");
            entity.Property(e => e.ConfigKey)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("config_key");
            entity.Property(e => e.ConfigValue).HasColumnName("config_value");
            entity.Property(e => e.DataType)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("data_type");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_CONFIGURATION_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.Configurations)
                .HasForeignKey(d => d.UpdatedBy)
                .HasConstraintName("FK_CONFIGURATION_USER");
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.ToTable("DOCUMENT");

            entity.HasIndex(e => e.RegistrationId, "IX_DOCUMENT_REGISTRATION");

            entity.Property(e => e.DocumentId).HasColumnName("document_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_DOCUMENT_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CurrentVersion)
                .HasDefaultValue(1, "DF_DOCUMENT_CURRENT_VERSION")
                .HasColumnName("current_version");
            entity.Property(e => e.DocumentStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("PENDING", "DF_DOCUMENT_STATUS")
                .HasColumnName("document_status");
            entity.Property(e => e.DocumentType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("document_type");
            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.RequiredFlag)
                .HasDefaultValue(true, "DF_DOCUMENT_REQUIRED_FLAG")
                .HasColumnName("required_flag");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_DOCUMENT_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Registration).WithMany(p => p.Documents)
                .HasForeignKey(d => d.RegistrationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DOCUMENT_REGISTRATION");
        });

        modelBuilder.Entity<DocumentVersion>(entity =>
        {
            entity.ToTable("DOCUMENT_VERSION");

            entity.HasIndex(e => e.DocumentId, "IX_DOCUMENT_VERSION_DOCUMENT");

            entity.HasIndex(e => e.UploadedBy, "IX_DOCUMENT_VERSION_USER");

            entity.Property(e => e.DocumentVersionId).HasColumnName("document_version_id");
            entity.Property(e => e.DocumentId).HasColumnName("document_id");
            entity.Property(e => e.FileHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("file_hash");
            entity.Property(e => e.FileName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("file_name");
            entity.Property(e => e.FilePath)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("file_path");
            entity.Property(e => e.IsCurrent)
                .HasDefaultValue(true, "DF_DOCUMENT_VERSION_IS_CURRENT")
                .HasColumnName("is_current");
            entity.Property(e => e.ReplacementReason).HasColumnName("replacement_reason");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())", "DF_DOCUMENT_VERSION_UPLOADED_AT")
                .HasColumnType("datetime")
                .HasColumnName("uploaded_at");
            entity.Property(e => e.UploadedBy).HasColumnName("uploaded_by");
            entity.Property(e => e.VersionNo).HasColumnName("version_no");

            entity.HasOne(d => d.Document).WithMany(p => p.DocumentVersions)
                .HasForeignKey(d => d.DocumentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DOCUMENT_VERSION_DOCUMENT");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.DocumentVersions)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_DOCUMENT_VERSION_USER");
        });

        modelBuilder.Entity<Escalation>(entity =>
        {
            entity.ToTable("ESCALATION");

            entity.HasIndex(e => e.SlaTrackingId, "IX_ESCALATION_SLA");

            entity.HasIndex(e => e.AssignedTo, "IX_ESCALATION_USER");

            entity.Property(e => e.EscalationId).HasColumnName("escalation_id");
            entity.Property(e => e.AssignedTo).HasColumnName("assigned_to");
            entity.Property(e => e.EscalatedAt)
                .HasDefaultValueSql("(getdate())", "DF_ESCALATION_ESCALATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("escalated_at");
            entity.Property(e => e.EscalationLevel).HasColumnName("escalation_level");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.ResolvedAt)
                .HasColumnType("datetime")
                .HasColumnName("resolved_at");
            entity.Property(e => e.SlaTrackingId).HasColumnName("sla_tracking_id");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("OPEN", "DF_ESCALATION_STATUS")
                .HasColumnName("status");

            entity.HasOne(d => d.AssignedToNavigation).WithMany(p => p.Escalations)
                .HasForeignKey(d => d.AssignedTo)
                .HasConstraintName("FK_ESCALATION_USER");

            entity.HasOne(d => d.SlaTracking).WithMany(p => p.Escalations)
                .HasForeignKey(d => d.SlaTrackingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ESCALATION_SLA");
        });

        modelBuilder.Entity<Landlord>(entity =>
        {
            entity.ToTable("LANDLORD");

            entity.HasIndex(e => e.IdentityNumber, "UQ_LANDLORD_IDENTITY").IsUnique();

            entity.Property(e => e.LandlordId).HasColumnName("landlord_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_LANDLORD_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.IdentityNumber)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("identity_number");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_LANDLORD_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("NOTIFICATION");

            entity.HasIndex(e => e.RegistrationId, "IX_NOTIFICATION_REGISTRATION");

            entity.HasIndex(e => e.RequestId, "IX_NOTIFICATION_REQUEST");

            entity.HasIndex(e => e.UserId, "IX_NOTIFICATION_USER");

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_NOTIFICATION_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.NotificationType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("notification_type");
            entity.Property(e => e.ReadAt)
                .HasColumnType("datetime")
                .HasColumnName("read_at");
            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Registration).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RegistrationId)
                .HasConstraintName("FK_NOTIFICATION_REGISTRATION");

            entity.HasOne(d => d.Request).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK_NOTIFICATION_REQUEST");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NOTIFICATION_USER");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.ToTable("PERMISSION");

            entity.HasIndex(e => e.PermissionCode, "UQ_PERMISSION_CODE").IsUnique();

            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.PermissionCode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("permission_code");
            entity.Property(e => e.PermissionName)
                .HasMaxLength(150)
                .HasColumnName("permission_name");
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.ToTable("REGISTRATION");

            entity.HasIndex(e => e.StudentId, "IX_REGISTRATION_STUDENT");

            entity.HasIndex(e => e.RegistrationCode, "UQ_REGISTRATION_CODE").IsUnique();

            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.ApprovedAt)
                .HasColumnType("datetime")
                .HasColumnName("approved_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_REGISTRATION_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExpiryDate).HasColumnName("expiry_date");
            entity.Property(e => e.RegistrationCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("registration_code");
            entity.Property(e => e.RejectedAt)
                .HasColumnType("datetime")
                .HasColumnName("rejected_at");
            entity.Property(e => e.RejectionReason).HasColumnName("rejection_reason");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("DRAFT", "DF_REGISTRATION_STATUS")
                .HasColumnName("status");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.SubmittedAt)
                .HasColumnType("datetime")
                .HasColumnName("submitted_at");
            entity.Property(e => e.TerminatedAt)
                .HasColumnType("datetime")
                .HasColumnName("terminated_at");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_REGISTRATION_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Student).WithMany(p => p.Registrations)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_REGISTRATION_STUDENT");
        });

        modelBuilder.Entity<Request>(entity =>
        {
            entity.ToTable("REQUEST");

            entity.HasIndex(e => e.CreatedBy, "IX_REQUEST_CREATED_BY");

            entity.HasIndex(e => e.ProcessedBy, "IX_REQUEST_PROCESSED_BY");

            entity.HasIndex(e => e.RegistrationId, "IX_REQUEST_REGISTRATION");

            entity.HasIndex(e => e.RequestCode, "UQ_REQUEST_CODE").IsUnique();

            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.ApprovedAt)
                .HasColumnType("datetime")
                .HasColumnName("approved_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_REQUEST_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.ProcessedAt)
                .HasColumnType("datetime")
                .HasColumnName("processed_at");
            entity.Property(e => e.ProcessedBy).HasColumnName("processed_by");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.RejectedAt)
                .HasColumnType("datetime")
                .HasColumnName("rejected_at");
            entity.Property(e => e.RejectionReason).HasColumnName("rejection_reason");
            entity.Property(e => e.RequestCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("request_code");
            entity.Property(e => e.RequestType)
                .HasMaxLength(50)
                .HasColumnName("request_type");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("DRAFT", "DF_REQUEST_STATUS")
                .HasColumnName("status");
            entity.Property(e => e.SubmittedAt)
                .HasColumnType("datetime")
                .HasColumnName("submitted_at");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_REQUEST_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RequestCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_REQUEST_CREATED_BY");

            entity.HasOne(d => d.ProcessedByNavigation).WithMany(p => p.RequestProcessedByNavigations)
                .HasForeignKey(d => d.ProcessedBy)
                .HasConstraintName("FK_REQUEST_PROCESSED_BY");

            entity.HasOne(d => d.Registration).WithMany(p => p.Requests)
                .HasForeignKey(d => d.RegistrationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_REQUEST_REGISTRATION");
        });

        modelBuilder.Entity<RequestHistory>(entity =>
        {
            entity.ToTable("REQUEST_HISTORY");

            entity.HasIndex(e => e.RequestId, "IX_REQUEST_HISTORY_REQUEST");

            entity.HasIndex(e => e.ChangedBy, "IX_REQUEST_HISTORY_USER");

            entity.Property(e => e.RequestHistoryId).HasColumnName("request_history_id");
            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("(getdate())", "DF_REQUEST_HISTORY_CHANGED_AT")
                .HasColumnType("datetime")
                .HasColumnName("changed_at");
            entity.Property(e => e.ChangedBy).HasColumnName("changed_by");
            entity.Property(e => e.NewStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("new_status");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.OldStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("old_status");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.RequestId).HasColumnName("request_id");

            entity.HasOne(d => d.ChangedByNavigation).WithMany(p => p.RequestHistories)
                .HasForeignKey(d => d.ChangedBy)
                .HasConstraintName("FK_REQUEST_HISTORY_USER");

            entity.HasOne(d => d.Request).WithMany(p => p.RequestHistories)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_REQUEST_HISTORY_REQUEST");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("ROLE");

            entity.HasIndex(e => e.RoleCode, "UQ_ROLE_CODE").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.RoleCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("role_code");
            entity.Property(e => e.RoleName)
                .HasMaxLength(100)
                .HasColumnName("role_name");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("ACTIVE", "DF_ROLE_STATUS")
                .HasColumnName("status");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.PermissionId });

            entity.ToTable("ROLE_PERMISSION");

            entity.HasIndex(e => e.GrantedBy, "IX_ROLE_PERMISSION_GRANTED_BY");

            entity.HasIndex(e => e.PermissionId, "IX_ROLE_PERMISSION_PERMISSION");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.GrantedAt)
                .HasDefaultValueSql("(getdate())", "DF_ROLE_PERMISSION_GRANTED_AT")
                .HasColumnType("datetime")
                .HasColumnName("granted_at");
            entity.Property(e => e.GrantedBy).HasColumnName("granted_by");

            entity.HasOne(d => d.GrantedByNavigation).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.GrantedBy)
                .HasConstraintName("FK_ROLE_PERMISSION_GRANTED_BY");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ROLE_PERMISSION_PERMISSION");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ROLE_PERMISSION_ROLE");
        });

        modelBuilder.Entity<SlaTracking>(entity =>
        {
            entity.ToTable("SLA_TRACKING");

            entity.HasIndex(e => e.RegistrationId, "IX_SLA_TRACKING_REGISTRATION");

            entity.HasIndex(e => e.RequestId, "IX_SLA_TRACKING_REQUEST");

            entity.Property(e => e.SlaTrackingId).HasColumnName("sla_tracking_id");
            entity.Property(e => e.CompletedAt)
                .HasColumnType("datetime")
                .HasColumnName("completed_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_SLA_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DueAt)
                .HasColumnType("datetime")
                .HasColumnName("due_at");
            entity.Property(e => e.OverdueAt)
                .HasColumnType("datetime")
                .HasColumnName("overdue_at");
            entity.Property(e => e.RegistrationId).HasColumnName("registration_id");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.SlaType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("sla_type");
            entity.Property(e => e.StartedAt)
                .HasColumnType("datetime")
                .HasColumnName("started_at");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("IN_PROGRESS", "DF_SLA_STATUS")
                .HasColumnName("status");

            entity.HasOne(d => d.Registration).WithMany(p => p.SlaTrackings)
                .HasForeignKey(d => d.RegistrationId)
                .HasConstraintName("FK_SLA_REGISTRATION");

            entity.HasOne(d => d.Request).WithMany(p => p.SlaTrackings)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK_SLA_REQUEST");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.ToTable("STUDENT");

            entity.HasIndex(e => e.StudentCode, "UQ_STUDENT_CODE").IsUnique();

            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.AcademicStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("academic_status");
            entity.Property(e => e.ClassName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("class_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_STUDENT_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Faculty)
                .HasMaxLength(150)
                .HasColumnName("faculty");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.SisUpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("sis_updated_at");
            entity.Property(e => e.StudentCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("student_code");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_STUDENT_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<StudentCache>(entity =>
        {
            entity.ToTable("STUDENT_CACHE");

            entity.HasIndex(e => e.StudentCode, "UQ_STUDENT_CACHE_CODE").IsUnique();

            entity.Property(e => e.StudentCacheId).HasColumnName("student_cache_id");
            entity.Property(e => e.AcademicStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("academic_status");
            entity.Property(e => e.ClassName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("class_name");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Faculty)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("faculty");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.LastSyncAt)
                .HasDefaultValueSql("(getdate())", "DF_STUDENT_CACHE_LAST_SYNC")
                .HasColumnType("datetime")
                .HasColumnName("last_sync_at");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.SisUpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("sis_updated_at");
            entity.Property(e => e.StudentCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("student_code");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("USER");

            entity.HasIndex(e => e.Email, "UQ_USER_EMAIL").IsUnique();

            entity.HasIndex(e => e.Username, "UQ_USER_USERNAME").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())", "DF_USER_CREATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(150)
                .HasColumnName("full_name");
            entity.Property(e => e.LastLoginAt)
                .HasColumnType("datetime")
                .HasColumnName("last_login_at");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("ACTIVE", "DF_USER_STATUS")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())", "DF_USER_UPDATED_AT")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });

            entity.ToTable("USER_ROLE");

            entity.HasIndex(e => e.AssignedBy, "IX_USER_ROLE_ASSIGNED_BY");

            entity.HasIndex(e => e.RoleId, "IX_USER_ROLE_ROLE");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.AssignedAt)
                .HasDefaultValueSql("(getdate())", "DF_USER_ROLE_ASSIGNED_AT")
                .HasColumnType("datetime")
                .HasColumnName("assigned_at");
            entity.Property(e => e.AssignedBy).HasColumnName("assigned_by");

            entity.HasOne(d => d.AssignedByNavigation).WithMany(p => p.UserRoleAssignedByNavigations)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("FK_USER_ROLE_ASSIGNED_BY");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE_ROLE");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoleUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE_USER");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
