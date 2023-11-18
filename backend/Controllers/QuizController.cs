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
    [HttpGet]
public async Task<ActionResult<IEnumerable<QuizWithAttemptsAndDBDTO>>> GetAll()
{
    var databasesWithQuizzes = await _context.Quizzes
        .Include(d => d.Database)
        .Include(d => d.Attempts)
        .ToListAsync();

    var databasesWithQuizzesDTO = _mapper.Map<List<QuizWithAttemptsAndDBDTO>>(databasesWithQuizzes);

    return databasesWithQuizzesDTO;
}


}