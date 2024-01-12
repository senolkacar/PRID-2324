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
            .MinimumLength(3)
            .Must(name => name.Trim().Length >= 3)
            .WithMessage("The name must have a minimum length of 3 characters (excluding whitespace).");

        RuleFor(q => q.StartDate)
            .LessThan(q => q.EndDate)
            .When(q => q.StartDate != null && q.EndDate != null && q.IsTest)
            .WithMessage("The start date must be before the end date.");

        RuleFor(q => q.EndDate)
            .GreaterThan(q => q.StartDate)
            .When(q => q.StartDate != null && q.EndDate != null && q.IsTest)
            .WithMessage("The end date must be after the start date.");
        
        RuleSet("create",()=>{
            RuleFor(q => q.Name)
            .MustAsync(BeUniqueName)
            .WithMessage("'{PropertyName}' must be unique.");
        });
    }

    public async Task<bool> HasQuestions(int id, CancellationToken token) {
        return await _context.Quizzes.AnyAsync(q => q.Id == id && q.Questions.Count > 0, token);
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
