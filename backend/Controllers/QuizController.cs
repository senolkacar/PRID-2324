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
        .Include(q => q.Questions)
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
    var answers = await _context.Answers
        .Where(a => a.AttemptId == attempt.Id)
        .ToListAsync();
    var questions = await _context.Questions
        .Where(q => q.QuizId == quiz.Id)
        .ToListAsync();
    foreach(var q in questions){
        var answer = answers.FirstOrDefault(a => a.QuestionId == q.Id);
        if(answer == null){
             answer = new Answer { AttemptId = attempt.Id, QuestionId = q.Id, Sql = "", IsCorrect = false };
            _context.Answers.Add(answer);
        }
    }
    await _context.SaveChangesAsync();
    
    return NoContent();
    }

[Authorize]
[HttpPost("createAttempt")]
public async Task<IActionResult> CreateAttempt(BasicQuizDTO basicQuizDTO)
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
        
    var attempt = new Attempt { StudentId = user.Id, QuizId = quiz.Id };
    _context.Attempts.Add(attempt);
    await _context.SaveChangesAsync();
    
    return NoContent();
    }


[Authorize]
[HttpGet("quizNameExists/{name}")]
public async Task<ActionResult<bool>> QuizNameExists(string name)
{
    var query = await _context.Quizzes
        .Where(q => q.Name == name)
        .FirstOrDefaultAsync();
    if (query == null)
    {
        return false;
    }
    return true;
}

[Authorize]
[HttpPut]
public async Task<IActionResult> PutQuiz(QuizWithAttemptsAndDBDTO quizDTO)
{
   var quiz = await _context.Quizzes
        .Include(q => q.Database)
        .Include(q => q.Attempts)
        .Include(q => q.Questions)
        .ThenInclude(q => q.Solutions)
        .Where(q => q.Id == quizDTO.Id)
        .FirstOrDefaultAsync();
    if (quiz == null)
    {
        return NotFound();
    }
    _mapper.Map<QuizWithAttemptsAndDBDTO, Quiz>(quizDTO, quiz);
    var result = await new QuizValidator(_context).ValidateAsync(quiz);
    if (!result.IsValid)
    {
        return BadRequest(result);
    }
    await _context.SaveChangesAsync();
    return NoContent();
}

[HttpPost("createNewQuiz")]
public async Task<ActionResult<QuizDTO>> CreateNewQuiz(QuizWithAttemptsAndDBDTO qDTO)
{
    var quiz = _mapper.Map<Quiz>(qDTO);
    quiz.Database = await _context.Databases.FindAsync(qDTO.Database.Id);
    /*var result = await new QuizValidator(_context).ValidateAsync(quiz);
    if (!result.IsValid)
    {
        return BadRequest(result);
    }*/

    _context.Quizzes.Add(quiz);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetQuizById), new { id = quiz.Id }, _mapper.Map<QuizDTO>(quiz));
}

[Authorize]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteQuiz(int id)
{
    var quiz = await _context.Quizzes.FindAsync(id);
    if (quiz == null)
    {
        return NotFound();
    }
    _context.Quizzes.Remove(quiz);
    await _context.SaveChangesAsync();
    return NoContent();
}
}