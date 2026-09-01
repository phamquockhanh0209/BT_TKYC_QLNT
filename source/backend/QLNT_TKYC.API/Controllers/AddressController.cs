using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNT_TKYC.API.Data;
using QLNT_TKYC.API.Models;

namespace QLNT_TKYC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressController(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET: api/Address
        // Lấy tất cả địa chỉ
        // =====================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Address>>> GetAddresses()
        {
            var addresses = await _context.Addresses
                .AsNoTracking()
                .Include(a => a.Registration)
                .Include(a => a.Landlord)
                .OrderByDescending(a => a.AddressId)
                .ToListAsync();

            return Ok(addresses);
        }

        // =====================================================
        // GET: api/Address/1
        // Lấy địa chỉ theo ID
        // =====================================================
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Address>> GetAddress(long id)
        {
            var address = await _context.Addresses
                .AsNoTracking()
                .Include(a => a.Registration)
                .Include(a => a.Landlord)
                .FirstOrDefaultAsync(a => a.AddressId == id);

            if (address == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy địa chỉ.",
                    addressId = id
                });
            }

            return Ok(address);
        }

        // =====================================================
        // GET: api/Address/registration/1
        // Lấy địa chỉ theo hồ sơ đăng ký
        // =====================================================
        [HttpGet("registration/{registrationId:long}")]
        public async Task<ActionResult<IEnumerable<Address>>> GetAddressesByRegistration(
            long registrationId)
        {
            var registrationExists = await _context.Registrations
                .AnyAsync(r => r.RegistrationId == registrationId);

            if (!registrationExists)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy hồ sơ đăng ký.",
                    registrationId = registrationId
                });
            }

            var addresses = await _context.Addresses
                .AsNoTracking()
                .Include(a => a.Landlord)
                .Where(a => a.RegistrationId == registrationId)
                .OrderByDescending(a => a.AddressId)
                .ToListAsync();

            return Ok(addresses);
        }

        // =====================================================
        // POST: api/Address
        // Tạo địa chỉ
        // =====================================================
        [HttpPost]
        public async Task<ActionResult<Address>> CreateAddress(Address address)
        {
            // Kiểm tra Registration tồn tại
            var registrationExists = await _context.Registrations
                .AnyAsync(r => r.RegistrationId == address.RegistrationId);

            if (!registrationExists)
            {
                return BadRequest(new
                {
                    message = "Hồ sơ đăng ký không tồn tại.",
                    registrationId = address.RegistrationId
                });
            }

            // Nếu có LandlordId thì kiểm tra chủ trọ
            if (address.LandlordId.HasValue)
            {
                var landlordExists = await _context.Landlords
                    .AnyAsync(l => l.LandlordId == address.LandlordId.Value);

                if (!landlordExists)
                {
                    return BadRequest(new
                    {
                        message = "Chủ trọ không tồn tại.",
                        landlordId = address.LandlordId
                    });
                }
            }

            address.CreatedAt = DateTime.Now;
            address.UpdatedAt = DateTime.Now;

            _context.Addresses.Add(address);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetAddress),
                new { id = address.AddressId },
                address
            );
        }

        // =====================================================
        // PUT: api/Address/1
        // Cập nhật địa chỉ
        // =====================================================
        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateAddress(
            long id,
            Address address)
        {
            if (id != address.AddressId)
            {
                return BadRequest(new
                {
                    message = "ID trên URL không trùng với AddressId."
                });
            }

            var existingAddress = await _context.Addresses
                .FirstOrDefaultAsync(a => a.AddressId == id);

            if (existingAddress == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy địa chỉ.",
                    addressId = id
                });
            }

            // Kiểm tra Registration
            var registrationExists = await _context.Registrations
                .AnyAsync(r => r.RegistrationId == address.RegistrationId);

            if (!registrationExists)
            {
                return BadRequest(new
                {
                    message = "Hồ sơ đăng ký không tồn tại.",
                    registrationId = address.RegistrationId
                });
            }

            // Kiểm tra Landlord
            if (address.LandlordId.HasValue)
            {
                var landlordExists = await _context.Landlords
                    .AnyAsync(l => l.LandlordId == address.LandlordId.Value);

                if (!landlordExists)
                {
                    return BadRequest(new
                    {
                        message = "Chủ trọ không tồn tại.",
                        landlordId = address.LandlordId
                    });
                }
            }

            existingAddress.RegistrationId = address.RegistrationId;
            existingAddress.LandlordId = address.LandlordId;
            existingAddress.AddressLine = address.AddressLine;
            existingAddress.Ward = address.Ward;
            existingAddress.District = address.District;
            existingAddress.Province = address.Province;
            existingAddress.AddressType = address.AddressType;
            existingAddress.Status = address.Status;
            existingAddress.StartDate = address.StartDate;
            existingAddress.EndDate = address.EndDate;

            existingAddress.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // =====================================================
        // DELETE: api/Address/1
        // Xóa địa chỉ
        // =====================================================
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteAddress(long id)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.AddressId == id);

            if (address == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy địa chỉ.",
                    addressId = id
                });
            }

            _context.Addresses.Remove(address);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}