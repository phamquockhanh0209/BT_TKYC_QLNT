using System;
using System.Collections.Generic;

namespace QLNT_TKYC.API.Models;

public partial class Landlord
{
    public long LandlordId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Phone { get; set; }

    public string? IdentityNumber { get; set; }

    public string? Email { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
}
