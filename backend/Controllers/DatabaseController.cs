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

public class DatabaseController : ControllerBase{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public DatabaseController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [Authorized(Role.Teacher)]
    [HttpGet]
public async Task<ActionResult<IEnumerable<DatabaseDTO>>> GetAll()
{
    var databasesWithQuizzes = await _context.Databases
        .ToListAsync();

    var databases = _mapper.Map<List<DatabaseDTO>>(databasesWithQuizzes);

    return databases;
}
}