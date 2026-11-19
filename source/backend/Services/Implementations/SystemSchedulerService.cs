using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations
{
    public class SystemSchedulerService : BackgroundService, ISystemSchedulerService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<SystemSchedulerService> _logger;
        private static readonly TimeSpan Interval = TimeSpan.FromHours(1);

        public SystemSchedulerService(
            IServiceScopeFactory scopeFactory,
            ILogger<SystemSchedulerService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SystemSchedulerService background worker started.");

            // Wait 5 seconds after startup before the first run
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Executing scheduled tasks at {Time}", DateTime.Now);
                    await RunScheduledTasksAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing scheduled tasks.");
                }

                try
                {
                    await Task.Delay(Interval, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }

            _logger.LogInformation("SystemSchedulerService background worker is stopping.");
        }

        public async Task<SchedulerExecutionResult> RunScheduledTasksAsync(CancellationToken cancellationToken = default)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var auditService = scope.ServiceProvider.GetRequiredService<IAuditLogService>();

            var result = new SchedulerExecutionResult();
            var today = DateOnly.FromDateTime(DateTime.Today);
            var now = DateTime.Now;

            // =================================================================
            // 1. Quét hồ sơ hết hạn: ACTIVE -> EXPIRED khi ExpiryDate < Today
            // =================================================================
            var expiredCandidates = await context.Registrations
                .Include(r => r.Student)
                .Include(r => r.Addresses)
                .Where(r => (r.Status == "ACTIVE" || r.Status == "APPROVED")
                            && r.ExpiryDate != null
                            && r.ExpiryDate.Value < today)
                .ToListAsync(cancellationToken);

            foreach (var reg in expiredCandidates)
            {
                var oldStatus = reg.Status;
                reg.Status = "EXPIRED";
                reg.UpdatedAt = now;

                // Cập nhật địa chỉ sang OLD/INACTIVE
                foreach (var addr in reg.Addresses.Where(a => a.Status == "CURRENT"))
                {
                    addr.Status = "OLD";
                    addr.EndDate ??= reg.ExpiryDate;
                    addr.UpdatedAt = now;
                }

                // Gửi thông báo đến sinh viên nếu chưa gửi
                if (reg.Student != null)
                {
                    var studentUser = await context.Users.FirstOrDefaultAsync(u => u.Username == reg.Student.StudentCode, cancellationToken);
                    if (studentUser != null)
                    {
                        var alreadyNotified = await context.Notifications.AnyAsync(
                            n => n.UserId == studentUser.UserId
                                 && n.RegistrationId == reg.RegistrationId
                                 && n.Title.Contains("hết hạn"),
                            cancellationToken);

                        if (!alreadyNotified)
                        {
                            context.Notifications.Add(new Notification
                            {
                                UserId = studentUser.UserId,
                                RegistrationId = reg.RegistrationId,
                                NotificationType = "WARNING",
                                Title = "Hồ sơ ngoại trú đã hết hạn",
                                Message = $"Hồ sơ {reg.RegistrationCode} của bạn đã hết hạn vào ngày {reg.ExpiryDate:dd/MM/yyyy}. Nơi ở ngoại trú hiện không còn hiệu lực. Vui lòng nộp hồ sơ mới nếu bạn tiếp tục ở ngoại trú.",
                                IsRead = false,
                                CreatedAt = now
                            });
                        }
                    }
                }

                // Ghi nhận AuditLog
                await auditService.LogAsync(
                    userId: null,
                    action: "AUTO_EXPIRE",
                    entityType: "REGISTRATION",
                    entityId: reg.RegistrationId,
                    oldValue: oldStatus,
                    newValue: "EXPIRED",
                    reason: $"Hồ sơ quá hạn ngoại trú ({reg.ExpiryDate:dd/MM/yyyy}) - System Scheduler tự động cập nhật.",
                    source: "SYSTEM_SCHEDULER"
                );

                result.ExpiredRegistrationsCount++;
            }

            // =================================================================
            // 2. Cảnh báo sắp hết hạn (trong vòng 15 ngày tới)
            // =================================================================
            var upcomingDeadline = today.AddDays(15);
            var upcomingCandidates = await context.Registrations
                .Include(r => r.Student)
                .Where(r => r.Status == "ACTIVE"
                            && r.ExpiryDate != null
                            && r.ExpiryDate.Value >= today
                            && r.ExpiryDate.Value <= upcomingDeadline)
                .ToListAsync(cancellationToken);

            foreach (var reg in upcomingCandidates)
            {
                if (reg.Student != null)
                {
                    var studentUser = await context.Users.FirstOrDefaultAsync(u => u.Username == reg.Student.StudentCode, cancellationToken);
                    if (studentUser != null)
                    {
                        var fifteenDaysAgo = now.AddDays(-15);
                        var alreadyReminded = await context.Notifications.AnyAsync(
                            n => n.UserId == studentUser.UserId
                                 && n.RegistrationId == reg.RegistrationId
                                 && n.Title.Contains("sắp hết hạn")
                                 && n.CreatedAt >= fifteenDaysAgo,
                            cancellationToken);

                        if (!alreadyReminded)
                        {
                            context.Notifications.Add(new Notification
                            {
                                UserId = studentUser.UserId,
                                RegistrationId = reg.RegistrationId,
                                NotificationType = "INFO",
                                Title = "Cảnh báo hồ sơ sắp hết hạn",
                                Message = $"Hồ sơ ngoại trú {reg.RegistrationCode} của bạn sẽ hết hạn vào ngày {reg.ExpiryDate:dd/MM/yyyy}. Bạn có thể tạo 'Yêu cầu gia hạn' trên hệ thống trước thời điểm này.",
                                IsRead = false,
                                CreatedAt = now
                            });
                            result.UpcomingRemindersCount++;
                        }
                    }
                }
            }

            // =================================================================
            // 3. Quét SLA quá hạn (SLA Overdue) và Tự động Escalation
            // =================================================================
            var overdueSlas = await context.SlaTrackings
                .Include(s => s.Registration)
                .Include(s => s.Request)
                .Where(s => s.Status == "IN_PROGRESS" && s.DueAt < now)
                .ToListAsync(cancellationToken);

            User? defaultStaff = null;
            if (overdueSlas.Count > 0)
            {
                defaultStaff = await context.UserRoles
                    .Include(ur => ur.User)
                    .Include(ur => ur.Role)
                    .Where(ur => ur.Role.RoleCode == "OFFICER" || ur.Role.RoleCode == "ADMIN")
                    .Select(ur => ur.User)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            foreach (var sla in overdueSlas)
            {
                sla.Status = "OVERDUE";
                sla.OverdueAt = now;
                result.OverdueSlaCount++;

                // Kiểm tra xem đã tạo Escalation cho SLA này chưa
                var hasEscalation = await context.Escalations.AnyAsync(e => e.SlaTrackingId == sla.SlaTrackingId, cancellationToken);
                if (!hasEscalation)
                {
                    var targetName = sla.Registration != null
                        ? $"Hồ sơ {sla.Registration.RegistrationCode}"
                        : (sla.Request != null ? $"Yêu cầu {sla.Request.RequestCode ?? sla.Request.RequestType}" : $"Mục #{sla.SlaTrackingId}");

                    var escalation = new Escalation
                    {
                        SlaTrackingId = sla.SlaTrackingId,
                        AssignedTo = defaultStaff?.UserId,
                        EscalationLevel = 1,
                        Reason = $"{targetName} vượt quá thời hạn xử lý SLA ({sla.SlaType}). Hạn chót: {sla.DueAt:dd/MM/yyyy HH:mm}.",
                        EscalatedAt = now,
                        Status = "OPEN"
                    };
                    context.Escalations.Add(escalation);
                    result.EscalationsCreatedCount++;

                    // Thông báo đến Cán bộ / Reviewer
                    if (defaultStaff != null)
                    {
                        context.Notifications.Add(new Notification
                        {
                            UserId = defaultStaff.UserId,
                            RegistrationId = sla.RegistrationId,
                            RequestId = sla.RequestId,
                            NotificationType = "WARNING",
                            Title = $"CẢNH BÁO QUÁ HẠN SLA: {sla.SlaType}",
                            Message = $"{targetName} đã quá hạn SLA lúc {sla.DueAt:dd/MM/yyyy HH:mm}. Đã kích hoạt Escalation chuyển cấp quản lý.",
                            IsRead = false,
                            CreatedAt = now
                        });
                    }

                    // Ghi AuditLog
                    await auditService.LogAsync(
                        userId: defaultStaff?.UserId,
                        action: "ESCALATION",
                        entityType: "SLA_TRACKING",
                        entityId: sla.SlaTrackingId,
                        oldValue: "IN_PROGRESS",
                        newValue: "OVERDUE",
                        reason: $"Quá hạn SLA tự động chuyển Escalation Level 1 cho cán bộ.",
                        source: "SYSTEM_SCHEDULER"
                    );
                }
            }

            await context.SaveChangesAsync(cancellationToken);

            result.Message = $"Scheduler hoàn tất: {result.ExpiredRegistrationsCount} hồ sơ hết hạn, {result.UpcomingRemindersCount} nhắc hạn, {result.OverdueSlaCount} SLA quá hạn, {result.EscalationsCreatedCount} escalation.";
            _logger.LogInformation(result.Message);

            return result;
        }
    }
}
