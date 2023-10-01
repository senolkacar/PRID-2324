using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

namespace prid_2324.Models;

public class UserValidator : AbstractValidator<User>
{
    private readonly UserContext _context;

    public UserValidator(UserContext context) {
        _context = context;

    
        RuleFor(u => u.Pseudo)
            .NotEmpty().WithMessage("'{PropertyName}' is required.")
            .Length(3,10).WithMessage("'{PropertyName}' must be between {MinLength} and {MaxLength} characters long.")
            .Must(isPseudoValid).WithMessage("'{PropertyName}' only letters, numbers and _ are allowed.")
            .Must(beginWithLetter).WithMessage("'{PropertyName}' must begin with a letter.")
            .MustAsync(isPseudoUnique).WithMessage("'{PropertyName}' must be unique.");

        RuleFor(u => u.Password)
            .NotEmpty()
            .Length(3,10);
        
        RuleFor(u => u.Email)
            .NotEmpty()
            .EmailAddress()
            .MustAsync(isEmailUnique).WithMessage("'{PropertyName}' must be unique.");

        RuleFor(u => u.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("'{PropertyName}' is required.")
            .When(u => !string.IsNullOrWhiteSpace(u.LastName))
            .Length(3,50).WithMessage("'{PropertyName}' must be between {MinLength} and {MaxLength} characters long.")
            .Must(containsWhiteSpaceOrTab).WithMessage("'{PropertyName}' must not begin or end with a whitespace or tab.");
        
        RuleFor(u => u.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("'{PropertyName}' is required.")
            .When(u => !string.IsNullOrWhiteSpace(u.FirstName))
            .Length(3,50).WithMessage("'{PropertyName}' must be between {MinLength} and {MaxLength} characters long.")
            .Must(containsWhiteSpaceOrTab).WithMessage("'{PropertyName}' must not begin or end with a whitespace or tab.");
        
        RuleFor(u => new {u.FirstName, u.LastName})
            .Must(u => u.FirstName != u.LastName)
            .WithMessage("'{PropertyName}' must be different.");
        
        RuleFor(u => u.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(u => u.Age)
                    .GreaterThanOrEqualTo(18)
                    .LessThanOrEqualTo(125);
            });

        // Validations spécifiques pour la création
        RuleSet("create", () => {
            RuleFor(u => u.Pseudo)
                .MustAsync(isPseudoUnique)
                .WithMessage("'{PropertyName}' must be unique.");
            RuleFor(u => u.Email)
                .MustAsync(isPseudoUnique)
                .WithMessage("'{PropertyName}' must be unique.");
        });
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(User User) {
        return await this.ValidateAsync(User, o => o.IncludeRuleSets("default", "create"));
    }

    private bool isPseudoValid(string pseudo){
        string pattern = @"^[A-Za-z0-9_]+$";
        return Regex.IsMatch(pseudo, pattern);
    }

    private bool beginWithLetter(string pseudo){
        if(string.IsNullOrEmpty(pseudo))
            return false;
        char firstChar = pseudo[0];
        return char.IsLetter(firstChar) && !char.IsWhiteSpace(firstChar);
    }

    private bool containsWhiteSpaceOrTab(string name){
        if(string.IsNullOrEmpty(name))
            return false;
        char firstChar = name[0];
        char lastChar = name[name.Length-1];
        return !char.IsWhiteSpace(firstChar) && !char.IsWhiteSpace(lastChar);
    }



    private async Task<bool> isPseudoUnique(string pseudo, CancellationToken token){
        return !await _context.Users.AnyAsync(u => u.Pseudo == pseudo);
    }

    private async Task<bool> isEmailUnique(string email, CancellationToken token){
        return !await _context.Users.AnyAsync(u => u.Email == email);
    }

    // private async Task<bool> BeUniqueFullName(string pseudo, string? fullName, CancellationToken token) {
    //     return !await _context.Users.AnyAsync(m => m.Pseudo != pseudo && m.FullName == fullName);
    // }
}
