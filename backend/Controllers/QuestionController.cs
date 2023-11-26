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