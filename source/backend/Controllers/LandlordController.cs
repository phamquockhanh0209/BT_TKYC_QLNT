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
    public class LandlordController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LandlordController(AppDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET: api/Landlord
        // Lấy tất cả chủ trọ
        // =====================================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Landlord>>> GetLandlords()
        {
            var landlords = await _context.Landlords
                .AsNoTracking()
                .OrderByDescending(l => l.LandlordId)
                .ToListAsync();

            return Ok(landlords);
        }

        // =====================================================
        // GET: api/Landlord/1
        // Lấy chủ trọ theo ID
        // =====================================================
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Landlord>> GetLandlord(long id)
        {
            var landlord = await _context.Landlords
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.LandlordId == id);

            if (landlord == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy chủ trọ.",
                    landlordId = id
                });
            }

            return Ok(landlord);
        }

        // =====================================================
        // GET: api/Landlord/1/addresses
        // Lấy các địa chỉ của chủ trọ
        // =====================================================
        [HttpGet("{id:long}/addresses")]
        public async Task<ActionResult<IEnumerable<Address>>> GetLandlordAddresses(
            long id)
        {
            var landlordExists = await _context.Landlords
                .AnyAsync(l => l.LandlordId == id);

            if (!landlordExists)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy chủ trọ.",
                    landlordId = id
                });
            }

            var addresses = await _context.Addresses
                .AsNoTracking()
                .Where(a => a.LandlordId == id)
                .OrderByDescending(a => a.AddressId)
                .ToListAsync();

            return Ok(addresses);
        }

        // =====================================================
        // POST: api/Landlord
        // Tạo chủ trọ
        // =====================================================
        [HttpPost]
        public async Task<ActionResult<Landlord>> CreateLandlord(
            Landlord landlord)
        {
            // Kiểm tra số CCCD/CMND trùng
            if (!string.IsNullOrWhiteSpace(landlord.IdentityNumber))
            {
                var duplicateIdentity = await _context.Landlords
                    .AnyAsync(l =>
                        l.IdentityNumber == landlord.IdentityNumber);

                if (duplicateIdentity)
                {
                    return Conflict(new
                    {
                        message = "Số giấy tờ tùy thân đã tồn tại.",
                        identityNumber = landlord.IdentityNumber
                    });
                }
            }

            // Kiểm tra email trùng nếu có
            if (!string.IsNullOrWhiteSpace(landlord.Email))
            {
                var duplicateEmail = await _context.Landlords
                    .AnyAsync(l => l.Email == landlord.Email);

                if (duplicateEmail)
                {
                    return Conflict(new
                    {
                        message = "Email chủ trọ đã tồn tại.",
                        email = landlord.Email
                    });
                }
            }

            landlord.CreatedAt = DateTime.Now;
            landlord.UpdatedAt = DateTime.Now;

            _context.Landlords.Add(landlord);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetLandlord),
                new { id = landlord.LandlordId },
                landlord
            );
        }

        // =====================================================
        // PUT: api/Landlord/1
        // Cập nhật chủ trọ
        // =====================================================
        [HttpPut("{id:long}")]
        public async Task<IActionResult> UpdateLandlord(
            long id,
            Landlord landlord)
        {
            if (id != landlord.LandlordId)
            {
                return BadRequest(new
                {
                    message = "ID trên URL không trùng với LandlordId."
                });
            }

            var existingLandlord = await _context.Landlords
                .FirstOrDefaultAsync(l => l.LandlordId == id);

            if (existingLandlord == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy chủ trọ.",
                    landlordId = id
                });
            }

            // Kiểm tra IdentityNumber trùng với chủ trọ khác
            if (!string.IsNullOrWhiteSpace(landlord.IdentityNumber))
            {
                var duplicateIdentity = await _context.Landlords
                    .AnyAsync(l =>
                        l.IdentityNumber == landlord.IdentityNumber &&
                        l.LandlordId != id);

                if (duplicateIdentity)
                {
                    return Conflict(new
                    {
                        message = "Số giấy tờ tùy thân đã được sử dụng.",
                        identityNumber = landlord.IdentityNumber
                    });
                }
            }

            // Cập nhật dữ liệu
            existingLandlord.FullName = landlord.FullName;
            existingLandlord.Phone = landlord.Phone;
            existingLandlord.IdentityNumber = landlord.IdentityNumber;
            existingLandlord.Email = landlord.Email;
            existingLandlord.Note = landlord.Note;

            // Không cho client sửa CreatedAt
            existingLandlord.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // =====================================================
        // DELETE: api/Landlord/1
        // Xóa chủ trọ
        // =====================================================
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteLandlord(long id)
        {
            var landlord = await _context.Landlords
                .FirstOrDefaultAsync(l => l.LandlordId == id);

            if (landlord == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy chủ trọ.",
                    landlordId = id
                });
            }

            // Kiểm tra chủ trọ có đang được sử dụng bởi Address không
            var hasAddresses = await _context.Addresses
                .AnyAsync(a => a.LandlordId == id);

            if (hasAddresses)
            {
                return Conflict(new
                {
                    message = "Không thể xóa chủ trọ vì đang có địa chỉ sử dụng chủ trọ này.",
                    landlordId = id
                });
            }

            _context.Landlords.Remove(landlord);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}