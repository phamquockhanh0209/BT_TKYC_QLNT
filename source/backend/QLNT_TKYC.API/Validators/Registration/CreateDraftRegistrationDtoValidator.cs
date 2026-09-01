using FluentValidation;
using QLNT_TKYC.API.DTOs.Registration;

namespace QLNT_TKYC.API.Validators.Registration;

public class CreateDraftRegistrationDtoValidator : AbstractValidator<CreateDraftRegistrationDto>
{
    public CreateDraftRegistrationDtoValidator()
    {
        RuleFor(x => x.StudentId)
            .GreaterThan(0).WithMessage("StudentId must be a positive integer.");
        // Add more rules for other fields when they are added.
    }
}
