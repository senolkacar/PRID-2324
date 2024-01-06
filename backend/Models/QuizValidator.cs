using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using prid_2324.Helpers;

namespace prid_2324.Models;


public class QuizValidator : AbstractValidator<Quiz>{

    private readonly PridContext _context;

    public QuizValidator(PridContext context) {
        _context = context;

        RuleFor(q => q.Name)
            .NotEmpty()
            .MinimumLength(3);

        RuleFor(q => q.StartDate)
            .LessThan(q => q.EndDate)
            .When(q => q.StartDate != null && q.EndDate != null && q.IsTest);

        RuleFor(q => q.EndDate)
            .GreaterThan(q => q.StartDate)
            .When(q => q.StartDate != null && q.EndDate != null && q.IsTest);
        
        RuleSet("create",()=>{
            RuleFor(q => q.Name)
            .MustAsync(BeUniqueName)
            .WithMessage("'{PropertyName}' must be unique.");
        });
    }

    private async Task<bool> isNameUnique(int id, string name, CancellationToken token) {
        return await _context.Quizzes.AllAsync(q => q.Id == id || q.Name != name, token);
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Quiz quiz){
        return await this.ValidateAsync(quiz, o=>o.IncludeRuleSets("default", "create"));
    }
    public async Task<bool> BeUniqueName(string name, CancellationToken token) {
        return string.IsNullOrEmpty(name) || !await _context.Quizzes.AnyAsync(q => q.Name == name, token);
    }

}
