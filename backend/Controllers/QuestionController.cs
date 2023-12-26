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

    [Authorize]
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
        var q = query.Quiz;
        q.Statut = q.GetStatus(user);
        var lastAttempt = await _context.Attempts
            .Where(a => a.StudentId == user.Id && a.QuizId == q.Id)
            .OrderByDescending(a => a.Start)
            .FirstOrDefaultAsync();
        query.HasAnswer = query.Answers.Any(a => lastAttempt.Id == a.AttemptId && a.QuestionId == query.Id);
        query.Answer = query.Answers.LastOrDefault(a => a.AttemptId == lastAttempt.Id && a.Attempt.StudentId == user.Id && a.QuestionId == query.Id);

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

    [Authorize]
    [HttpPost("eval")]
    public async Task<ActionResult<Query>> Eval(EvalDTO evalDTO)
    {
        if (string.IsNullOrEmpty(evalDTO.Query))
        {
            return BadRequest("The query field is required.");
        }
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if (user == null)
        {
            return BadRequest();
        }

        var question = await _context.Questions
            .Include(q => q.Quiz)
            .ThenInclude(q => q.Database)
            .Include(s => s.Solutions)
            .Where(q => q.Id == evalDTO.QuestionId)
            .FirstOrDefaultAsync();

        var queryResult = question.eval(evalDTO.Query, question.Quiz.Database.Name);
        bool isCorrect = queryResult.Errors.Count == 0;

        var attempt = await _context.Attempts
            .Where(a => a.StudentId == user.Id && a.QuizId == question.QuizId)
            .OrderByDescending(a => a.Start)
            .FirstOrDefaultAsync();
        /*var attempt = new Attempt { Start = DateTimeOffset.Now, StudentId = user.Id, QuizId = question.QuizId };
        _context.Attempts.Add(attempt);
        await _context.SaveChangesAsync();*/
        var answer = new Answer { AttemptId = attempt.Id, QuestionId = question.Id, Sql = evalDTO.Query, Timestamp = DateTimeOffset.Now, IsCorrect = isCorrect };
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();
        
        return queryResult;
    }

    [Authorize]
    [HttpGet("getQuery/{id}")]
    public async Task<ActionResult<Query>> GetQuery(int id)
    {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if (user == null)
        {
            return BadRequest();
        }
        var question = await _context.Questions
            .Include(q => q.Quiz)
            .ThenInclude(q => q.Database)
            .Include(s => s.Solutions)
            .Where(q => q.Id == id)
            .FirstOrDefaultAsync();


        var lastAnswer = await _context.Answers
            .Where(a => a.QuestionId == question.Id)
            .OrderByDescending(a => a.Timestamp)
            .Include(a => a.Attempt)
            .Where(a => a.Attempt.StudentId == user.Id && a.QuestionId == question.Id)
            .FirstOrDefaultAsync();

        if (lastAnswer == null)
        {
            return BadRequest("No previous answer found.");
        }

        string sql = lastAnswer.Sql;
        var queryResult = question.eval(sql, question.Quiz.Database.Name);
        return queryResult;
    }

    [Authorize]
    [HttpGet("getQuestionsByQuizId/{id}")]
    public async Task<ActionResult<IEnumerable<QuestionWithSolutionAnswerDTO>>> GetQuestionsByQuizId(int id)
    {
        var pseudo = User.Identity!.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if (user == null)
        {
            return BadRequest();
        }
        var query = await _context.Questions
          .Include(s => s.Solutions)
          .Where(q => q.QuizId == id)
            .OrderBy(q => q.Order)
            .ToListAsync();

        var questions = _mapper.Map<IEnumerable<QuestionWithSolutionAnswerDTO>>(query);
        return questions.ToList();
    }
}