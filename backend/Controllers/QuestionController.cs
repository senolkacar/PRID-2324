using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324.Models;
using AutoMapper;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using prid_2324.Helpers;

namespace prid_2324.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]

public class QuestionController : ControllerBase{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public QuestionController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionWithSolutionAnswerDTO>> GetQuestion(int id) {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if (user == null)
        {
            return BadRequest();
        }
        var query = await _context.Questions
            .Include(q => q.Quiz)
            .ThenInclude(q => q.Attempts)
            .Include(q => q.Quiz)
            .ThenInclude(q => q.Database)
            .Include(a => a.Answers)
            .Include(s => s.Solutions)
            .Where(q => q.Id == id)
            .OrderBy(q => q.Order)
            .FirstOrDefaultAsync();
        
        query.HasAnswer = query.UserHasAnswered(user);

        var question = _mapper.Map<QuestionWithSolutionAnswerDTO>(query);

        var previousQuestion = await _context.Questions
            .Where(q => q.QuizId == question.Quiz.Id && q.Order < question.Order)
            .OrderByDescending(q => q.Order)
            .Select(q => q.Id)
            .FirstOrDefaultAsync();
        question.PreviousQuestionId = previousQuestion != 0 ? previousQuestion : null;

        var nextQuestion = await _context.Questions
            .Where(q => q.QuizId == question.Quiz.Id && q.Order > question.Order)
            .OrderBy(q => q.Order)
            .Select(q => q.Id)
            .FirstOrDefaultAsync();
        question.NextQuestionId = nextQuestion != 0 ? nextQuestion : null;


        return question;
    }

    [HttpGet("getQuestionsByQuizId/{id}")]
    public async Task<ActionResult<List<QuestionWithSolutionAnswerDTO>>> GetQuestionsByQuizId(int id) {
    var query = await _context.Questions
        .Include(q => q.Quiz)
        .Include(a => a.Answers)
        .Include(s => s.Solutions)
        .Where(q => q.QuizId == id)
        .ToListAsync();

    var questions = _mapper.Map<List<QuestionWithSolutionAnswerDTO>>(query);
    return questions;
    }

}