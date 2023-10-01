namespace prid_2324.Models;

public class UserDTO{

    public string Pseudo {get; set;}="";
    public string Email {get; set;}="";
    public string? FirstName {get; set;}
    public string? LastName {get; set;}
    public DateTimeOffset? BirthDate {get; set;}

}

public class UserWithPasswordDTO : UserDTO
{
    public string Password {get; set;} = "";
}