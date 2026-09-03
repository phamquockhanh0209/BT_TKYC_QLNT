using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.DTOs.Registration;
using QLNT_TKYC.API.Common.Constants;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations
{
    public class RegistrationService : IRegistrationService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public RegistrationService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<Registration> CreateDraftRegistrationAsync(CreateDraftRegistrationDto dto)
        {
            // Verify student exists
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId);
            if (student == null)
            {
                throw new InvalidOperationException($"Student with Id {dto.StudentId} not found.");
            }

            // Ensure no ACTIVE registration for this student (BC‑STU‑02)
            var hasActive = await _context.Registrations
                .AnyAsync(r => r.StudentId == dto.StudentId && r.Status == RegistrationConstants.RegistrationStatus.ACTIVE.ToString());
            if (hasActive)
            {
                throw new InvalidOperationException("Student already has an ACTIVE registration.");
            }

            var registration = new Registration
            {
                StudentId = dto.StudentId,
                Status = RegistrationConstants.RegistrationStatus.DRAFT.ToString(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                // Additional fields can be set from DTO when needed
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();
            return registration;
        }

        public async Task<Registration> SubmitRegistrationAsync(long registrationId)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == registrationId);
            if (registration == null)
                throw new InvalidOperationException($"Registration {registrationId} not found.");

            if (registration.Status != RegistrationConstants.RegistrationStatus.DRAFT.ToString())
                throw new InvalidOperationException("Only DRAFT registrations can be submitted.");

            registration.Status = RegistrationConstants.RegistrationStatus.SUBMITTED.ToString();
            registration.SubmittedAt = DateTime.UtcNow;
            registration.UpdatedAt = DateTime.UtcNow;

            // TODO: start SLA tracking via ISlaService when implemented
            await _context.SaveChangesAsync();

            // Notify student (simplified – using studentId as userId)
            await _notificationService.SendAsync(registration.StudentId.ToString(), "Registration Submitted", "Your registration has been submitted for review.");

            return registration;
        }

        public async Task<Registration> RequestMoreInfoAsync(long registrationId)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == registrationId);
            if (registration == null)
                throw new InvalidOperationException($"Registration {registrationId} not found.");

            // Transition to NEED_MORE_INFO
            registration.Status = RegistrationConstants.RegistrationStatus.NEED_MORE_INFO.ToString();
            registration.UpdatedAt = DateTime.UtcNow;

            // Increment info request count – using a simple int column (InfoRequestCount) if present, otherwise ignore
            // This example assumes a nullable int column exists; adjust as needed.
            if (_context.Entry(registration).Property("InfoRequestCount") != null)
            {
                var current = (int?)_context.Entry(registration).Property("InfoRequestCount").CurrentValue ?? 0;
                var newCount = current + 1;
                _context.Entry(registration).Property("InfoRequestCount").CurrentValue = newCount;

                // Auto‑reject after 3 attempts (user‑approved rule)
                if (newCount >= 3)
                {
                    registration.Status = RegistrationConstants.RegistrationStatus.REJECTED.ToString();
                    // Optionally set RejectionReason
                }
            }

            await _context.SaveChangesAsync();

            await _notificationService.SendAsync(registration.StudentId.ToString(), "More Information Required", "Please provide the requested information for your registration.");
            return registration;
        }

        public async Task<Registration> ResubmitRegistrationAsync(long registrationId)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == registrationId);
            if (registration == null)
                throw new InvalidOperationException($"Registration {registrationId} not found.");

            if (registration.Status != RegistrationConstants.RegistrationStatus.NEED_MORE_INFO.ToString())
                throw new InvalidOperationException("Only registrations in NEED_MORE_INFO state can be resubmitted.");

            registration.Status = RegistrationConstants.RegistrationStatus.SUBMITTED.ToString();
            registration.UpdatedAt = DateTime.UtcNow;
            // Reset info request counter if present
            if (_context.Entry(registration).Property("InfoRequestCount") != null)
                _context.Entry(registration).Property("InfoRequestCount").CurrentValue = 0;

            await _context.SaveChangesAsync();
            await _notificationService.SendAsync(registration.StudentId.ToString(), "Registration Resubmitted", "Your registration has been resubmitted for review.");
            return registration;
        }

        public async Task<bool> WithdrawRegistrationAsync(long registrationId)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.RegistrationId == registrationId);
            if (registration == null)
                return false;

            // Allow withdrawal only from certain statuses
            var allowed = new[] {
                RegistrationConstants.RegistrationStatus.DRAFT.ToString(),
                RegistrationConstants.RegistrationStatus.SUBMITTED.ToString(),
                RegistrationConstants.RegistrationStatus.NEED_MORE_INFO.ToString()
            };
            if (Array.IndexOf(allowed, registration.Status) < 0)
                return false;

            registration.Status = RegistrationConstants.RegistrationStatus.WITHDRAWN.ToString();
            registration.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            await _notificationService.SendAsync(registration.StudentId.ToString(), "Registration Withdrawn", "Your registration has been withdrawn.");
            return true;
        }
    }
}
