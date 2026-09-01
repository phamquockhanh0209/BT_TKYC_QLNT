using System.Threading.Tasks;
using QLNT_TKYC.API.Models;
using QLNT_TKYC.API.DTOs.Registration;

namespace QLNT_TKYC.API.Services.Interfaces;

public interface IRegistrationService
{
    Task<Registration> CreateDraftRegistrationAsync(CreateDraftRegistrationDto dto);
    Task<Registration> SubmitRegistrationAsync(long registrationId);
    Task<Registration> RequestMoreInfoAsync(long registrationId);
    Task<Registration> ResubmitRegistrationAsync(long registrationId);
    Task<bool> WithdrawRegistrationAsync(long registrationId);
}
