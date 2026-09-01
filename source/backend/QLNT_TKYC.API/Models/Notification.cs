using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Notification
{
    public long NotificationId { get; set; }

    public long UserId { get; set; }

    public long? RegistrationId { get; set; }

    public long? RequestId { get; set; }

    public string NotificationType { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ReadAt { get; set; }

    public virtual Registration? Registration { get; set; }

    public virtual Request? Request { get; set; }

    public virtual User User { get; set; } = null!;
}
