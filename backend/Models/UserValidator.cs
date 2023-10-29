using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using prid_2324.Helpers;

namespace prid_2324.Models;

public class UserValidator : AbstractValidator<User>
{
    private readonly PridContext _context;

    public UserValidator(PridContext context) {
        _context = context;

    
        RuleFor(u => u.Pseudo)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10)
            .Matches(@"^[a-z][a-z0-9_]*$", RegexOptions.IgnoreCase);

        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10);
        
        RuleFor(u => u.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(u => u.FirstName)
            .MinimumLength(3)
            .MaximumLength(50)
            .Matches(@"^\S.*\S$");
        
        RuleFor(u => u.LastName)
            .MinimumLength(3)
            .MaximumLength(50)
            .Matches(@"^\S.*\S$");
        
        RuleFor(u => new {u.FirstName, u.LastName})
            .Must(u => string.IsNullOrEmpty(u.FirstName) && string.IsNullOrEmpty(u.LastName) || 
                !string.IsNullOrEmpty(u.FirstName) && !string.IsNullOrEmpty(u.LastName))
            .WithMessage("Last Name and First Name must be both empty or both non empty.");

        RuleFor(u => new {u.Id, u.Pseudo})
            .MustAsync((u, token)=> isPseudoUnique(u.Id,u.Pseudo, token))
            .OverridePropertyName(nameof(User.Pseudo))
            .WithMessage("'{PropertyName}' must be unique.");
        
        RuleFor(u => new {u.Id, u.Email})
            .MustAsync((u, token)=> isEmailUnique(u.Id,u.Email, token))
            .OverridePropertyName(nameof(User.Email))
            .WithMessage("'{PropertyName}' must be unique.");

        RuleFor(u => new{u.Id, u.FirstName, u.LastName})
            .MustAsync((u, token)=> isFullNameUnique(u.Id,u.FirstName, u.LastName, token))
            .WithMessage("'{PropertyName}' must be unique.");
        
        RuleFor(u => u.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(u => u.Age)
                    .GreaterThanOrEqualTo(18)
                    .LessThanOrEqualTo(125);
            });

        RuleFor(u => u.Role)
            .IsInEnum();
        RuleSet("authenticate",()=>{
            RuleFor(u=>u.Token).NotNull().OverridePropertyName("Password").WithMessage("Incorrect Password");
            });

    }

    private async Task<bool> isPseudoUnique(int id,string pseudo, CancellationToken token){
        return !await _context.Users.AnyAsync(u => u.Id != id && u.Pseudo == pseudo, cancellationToken: token);
    }

    private async Task<bool> isEmailUnique(int id,string email, CancellationToken token){
        return !await _context.Users.AnyAsync(u => u.Id != id && u.Email == email, cancellationToken: token);
    }

    private async Task<bool> isFullNameUnique(int id,string? firstName, string? lastName, CancellationToken token){
        if(lastName == null || firstName == null)
            return true;
        return !await _context.Users.AnyAsync(u => u.Id != id && u.FirstName == firstName && u.LastName == lastName, cancellationToken: token);
    }

   public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(User? user) {
        if (user == null)
            return ValidatorHelper.CustomError("User not found.", "Pseudo");
        return await this.ValidateAsync(user!, u => u.IncludeRuleSets("authenticate"));
    }

}
