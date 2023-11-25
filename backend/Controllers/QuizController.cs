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
    var databasesWithQuizzes = await _context.Quizzes
        .Include(d => d.Database)
        .Include(d => d.Attempts)
        .Where(q => q.IsTest)
        .ToListAsync();

    var tests = _mapper.Map<List<QuizWithAttemptsAndDBDTO>>(databasesWithQuizzes);

    return tests;
}

[Authorize]
[HttpGet("trainings")]
public async Task<ActionResult<IEnumerable<QuizWithAttemptsAndDBDTO>>> GetTrainings()
{
    var databasesWithQuizzes = await _context.Quizzes
        .Include(d => d.Database)
        .Include(d => d.Attempts)
        .Where(q => !q.IsTest)
        .ToListAsync();

    var trainings = _mapper.Map<List<QuizWithAttemptsAndDBDTO>>(databasesWithQuizzes);

    return trainings;
}

}