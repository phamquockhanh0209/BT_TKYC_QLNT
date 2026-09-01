using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Address
{
    public long AddressId { get; set; }

    public long RegistrationId { get; set; }

    public long? LandlordId { get; set; }

    public string AddressLine { get; set; } = null!;

    public string? Ward { get; set; }

    public string? District { get; set; }

    public string? Province { get; set; }

    public string? AddressType { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Landlord? Landlord { get; set; }

    public virtual Registration? Registration { get; set; }
}
