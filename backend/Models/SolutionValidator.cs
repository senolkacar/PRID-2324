using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using prid_2324.Helpers;

namespace prid_2324.Models;


public class SolutionValidator : AbstractValidator<Solution>{
    private readonly PridContext _context;

    public SolutionValidator(PridContext context)
    {
        _context = context;

        RuleFor(s => s.Sql)
            .NotEmpty()
            .Must(sql => sql.Trim().Length >= 1)
            .WithMessage("The sql cant be empty (excluding whitespace).");
        
         /*RuleFor(s => s.Order)
            .MustAsync(BeUniqueOrder)
            .WithMessage("'{PropertyName}' must be unique.");*/
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Solution solution){
        return await this.ValidateAsync(solution, o=>o.IncludeRuleSets("default", "create"));
    }

    public async Task<bool> BeUniqueOrder(Solution solution, int id, CancellationToken token) {
        return await _context.Solutions.AllAsync(s => s.QuestionId == solution.QuestionId && (s.Id == id || s.Order != solution.Order), token);
    }
}