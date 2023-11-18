using AutoMapper;

namespace prid_2324.Models;

public class MappingProfile : Profile
{
    private PridContext _context;

    public MappingProfile(PridContext context){
        _context = context;
        CreateMap<User,UserDTO>();
        CreateMap<UserDTO, User>();
        CreateMap<User, UserWithPasswordDTO>();
        CreateMap<UserWithPasswordDTO, User>();
        CreateMap<Quiz, QuizDTO>();
        CreateMap<Quiz, QuizWithAttemptsDTO>();
        CreateMap<Quiz, QuizWithAttemptsAndDBDTO>();
        CreateMap<Database, DatabaseDTO>();
        CreateMap<Attempt, AttemptDTO>();
    }
}