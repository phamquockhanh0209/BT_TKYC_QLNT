using FluentValidation;
using QLNT_TKYC.API.DTOs.Registration;

namespace QLNT_TKYC.API.Validators.Registration;

public class RequestMoreInfoDtoValidator : AbstractValidator<RequestMoreInfoDto>
{
    public RequestMoreInfoDtoValidator()
    {
        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Reason is required.");
        RuleFor(x => x.AttemptNumber)
            .GreaterThanOrEqualTo(1).WithMessage("AttemptNumber must be at least 1.");
    }
}
