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

public class QuizzesController : ControllerBase{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public QuizzesController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [Authorize]
    [HttpGet("all")]
public async Task<ActionResult<IEnumerable<QuizWithAttemptsAndDBDTO>>> GetAll()
{
    var databasesWithQuizzes = await _context.Quizzes
        .Include(d => d.Database)
        .Include(d => d.Attempts)
        .ToListAsync();

    var quizzes = _mapper.Map<List<QuizWithAttemptsAndDBDTO>>(databasesWithQuizzes);

    return quizzes;
}

[Authorize]
[HttpGet("tests")]
public async Task<ActionResult<IEnumerable<QuizWithAttemptsAndDBDTO>>> GetTests()
{
    var pseudo = User.Identity!.Name;
    var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
    if(user==null){
        return BadRequest();
    }

    var databasesWithQuizzes = await _context.Quizzes
        .Include(d => d.Database)
        .Include(d => d.Questions)
        .Include(d => d.Attempts)
        .ThenInclude(a => a.Answers)
        .Where(q => q.IsTest)
        .ToListAsync();

    foreach(var q in databasesWithQuizzes){
        q.Statut = q.GetStatus(user);
        q.Evaluation = q.GetEvaluation(user);
    }
    
    var tests = _mapper.Map<List<QuizWithAttemptsAndDBDTO>>(databasesWithQuizzes);

    return tests;
}

[Authorize]
[HttpGet("trainings")]
public async Task<ActionResult<IEnumerable<QuizWithAttemptsAndDBDTO>>> GetTrainings()
{
   var pseudo = User.Identity!.Name;
    var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
    if(user==null){
        return BadRequest();
    }
    var databasesWithQuizzes = await _context.Quizzes
        .Include(d => d.Database)
        .Include(d => d.Attempts)
        .Where(q => !q.IsTest)
        .ToListAsync();
    foreach(var q in databasesWithQuizzes){
        q.Statut = q.GetStatus(user);
    }

    var trainings = _mapper.Map<List<QuizWithAttemptsAndDBDTO>>(databasesWithQuizzes);

    return trainings;
}

[Authorize]
[HttpGet("getFirstQuestionId/{id}")]
public async Task<ActionResult<int>> GetFirstQuestionId(int id)
{
    var query = await _context.Questions
        .Where(q => q.QuizId == id)
        .FirstOrDefaultAsync();
    if (query == null)
    {
        return NotFound();
    }
    return query.Id;
}
[Authorize]
 [HttpGet("getQuizById/{id}")]
 public async Task<ActionResult<QuizWithAttemptsAndDBDTO>> GetQuizById(int id) {
    var query = await _context.Quizzes
        .Include(q => q.Database)
        .Include(q => q.Attempts)
        .Where(q => q.Id == id)
        .FirstOrDefaultAsync();

    var quiz = _mapper.Map<QuizWithAttemptsAndDBDTO>(query);

    return quiz;
 }
[Authorize]
[HttpPost("closeQuiz")]
public async Task<IActionResult> CloseQuiz(BasicQuizDTO basicQuizDTO)
{
    var pseudo = User.Identity!.Name;
    var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
    if(user==null){
        return BadRequest();
    }
    var quiz = await _context.Quizzes
        .Include(q => q.Attempts)
        .Where(q => q.Id == basicQuizDTO.Id)
        .FirstOrDefaultAsync();
    
    var attempt = quiz.Attempts.LastOrDefault(a => a.StudentId == user.Id);
    attempt.Finish = DateTimeOffset.Now;
    await _context.SaveChangesAsync();
    
    return NoContent();
    }
}