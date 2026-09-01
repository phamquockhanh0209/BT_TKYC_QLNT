using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations
{
    public class SlaService : ISlaService
    {
        private readonly AppDbContext _context;
        private const int DefaultSlaHours = 72; // 3 days

        public SlaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task StartSlaTrackingAsync(string slaType, long? registrationId = null, long? requestId = null)
        {
            var now = DateTime.UtcNow;
            var sla = new SlaTracking
            {
                SlaType = slaType,
                RegistrationId = registrationId,
                RequestId = requestId,
                StartedAt = now,
                DueAt = now.AddHours(DefaultSlaHours),
                Status = "IN_PROGRESS",
                CreatedAt = now
            };

            _context.SlaTrackings.Add(sla);
            await _context.SaveChangesAsync();
        }

        public async Task MarkCompletedAsync(long slaTrackingId)
        {
            var sla = await _context.SlaTrackings.FirstOrDefaultAsync(s => s.SlaTrackingId == slaTrackingId);
            if (sla == null) throw new InvalidOperationException($"SLA {slaTrackingId} not found.");

            sla.CompletedAt = DateTime.UtcNow;
            sla.Status = "COMPLETED";
            await _context.SaveChangesAsync();
        }
    }
}
