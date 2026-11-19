using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.Services.Interfaces;

namespace QLNT_TKYC.API.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendAsync(string userIdOrCode, string title, string message)
        {
            try
            {
                User? user = null;
                if (long.TryParse(userIdOrCode, out var userId))
                {
                    user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                }

                if (user == null)
                {
                    user = await _context.Users.FirstOrDefaultAsync(u => u.Username == userIdOrCode);
                }

                if (user != null)
                {
                    await SendToUserAsync(user.UserId, title, message, "INFO");
                }
                else
                {
                    Console.WriteLine($"[NotificationService] Target user not found: {userIdOrCode}. Message: {title}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NotificationService Error] {ex.Message}");
            }
        }

        public async Task SendToUserAsync(
            long userId,
            string title,
            string message,
            string notificationType = "INFO",
            long? registrationId = null,
            long? requestId = null)
        {
            try
            {
                var notif = new Notification
                {
                    UserId = userId,
                    RegistrationId = registrationId,
                    RequestId = requestId,
                    NotificationType = notificationType,
                    Title = title,
                    Message = message,
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };

                _context.Notifications.Add(notif);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NotificationService SendToUserAsync Error] {ex.Message}");
            }
        }
    }
}
