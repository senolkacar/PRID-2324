using AutoMapper;

namespace prid_2324.Models;

public class MappingProfile : Profile
{
    private UserContext _context;

    public MappingProfile(UserContext context){
        _context = context;
        CreateMap<User,UserDTO>();
        CreateMap<UserDTO, User>();
        CreateMap<User, UserWithPasswordDTO>();
        CreateMap<UserWithPasswordDTO, User>();
    }
}