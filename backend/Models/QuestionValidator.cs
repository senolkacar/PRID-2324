using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using prid_2324.Helpers;

namespace prid_2324.Models;


public class QuestionValidator : AbstractValidator<Question>{
    private readonly PridContext _context;

    public QuestionValidator(PridContext context)
    {
        _context = context;

        RuleFor(q => q.Body)
            .NotEmpty()
            .MinimumLength(2)
            .Must(body => body.Trim().Length >= 2)
            .WithMessage("The body must have a minimum length of 2 characters (excluding whitespace).");
        
        /*RuleFor(q => q.Order)
            .MustAsync(BeUniqueOrder())
            .WithMessage("'{PropertyName}' must be unique.");*/

        RuleFor(q => q.Solutions)
            .NotEmpty()
            .WithMessage("'{PropertyName}' must not be empty.");
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Question question){
        return await this.ValidateAsync(question, o=>o.IncludeRuleSets("default", "create"));
    }
    public async Task<bool> BeUniqueOrder(Question question, int id, CancellationToken token) {
        return await _context.Questions.AllAsync(q => q.QuizId == question.QuizId && (q.Id == id || q.Order != question.Order), token);
    }
}