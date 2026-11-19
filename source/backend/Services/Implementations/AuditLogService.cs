using System;
using System.Threading.Tasks;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations
{
    public class AuditLogService : IAuditLogService
    {
        private readonly AppDbContext _context;

        public AuditLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(
            long? userId,
            string action,
            string entityType,
            long? entityId = null,
            string? oldValue = null,
            string? newValue = null,
            string? reason = null,
            string? source = null)
        {
            try
            {
                var log = new AuditLog
                {
                    UserId = userId,
                    Action = action,
                    EntityType = entityType,
                    EntityId = entityId,
                    OldValue = oldValue,
                    NewValue = newValue,
                    Reason = reason,
                    Source = source ?? "SYSTEM",
                    CreatedAt = DateTime.Now
                };

                _context.AuditLogs.Add(log);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Never let audit log failure break the main business flow, but record error to console
                Console.WriteLine($"[AuditLogError] Failed to write audit log: {ex.Message}");
            }
        }
    }
}
