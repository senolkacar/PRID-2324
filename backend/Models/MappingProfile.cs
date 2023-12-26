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
        CreateMap<QuizDTO, Quiz>();
        CreateMap<Quiz, BasicQuizDTO>();
        CreateMap<BasicQuizDTO, Quiz>();
        CreateMap<Quiz, QuizWithAttemptsDTO>();
        CreateMap<QuizWithAttemptsDTO, Quiz>();
        CreateMap<Quiz, QuizWithAttemptsAndDBDTO>();
        CreateMap<QuizWithAttemptsAndDBDTO, Quiz>();
        CreateMap<Database, DatabaseDTO>();
        CreateMap<DatabaseDTO, Database>();
        CreateMap<Attempt, AttemptDTO>();
        CreateMap<AttemptDTO, Attempt>();
        CreateMap<Answer,AnswerDTO>();
        CreateMap<AnswerDTO,Answer>();
        CreateMap<Solution,SolutionDTO>();
        CreateMap<SolutionDTO,Solution>();
        CreateMap<QuestionDTO, Question>();
        CreateMap<Question, QuestionDTO>();
        CreateMap<QuestionWithSolutionAnswerDTO, Question>();
        CreateMap<Question, QuestionWithSolutionAnswerDTO>();
    }
}