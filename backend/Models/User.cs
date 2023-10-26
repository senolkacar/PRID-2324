using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public enum Role
{
   Student = 0,Teacher = 1
}

public class User
{
    [Key]
    public int Id {get; set;}
    public string Pseudo { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Email{get; set;} = null!; 
    public string? LastName {get; set;}
    public string? FirstName {get; set;} 
    public DateTimeOffset? BirthDate { get; set; }

    public Role Role { get; set; } = Role.Student;

    [NotMapped]
    public string? Token { get; set; }

    public int? Age {
        get {
            if (!BirthDate.HasValue)
                return null;
            var today = DateTime.Today;
            var age = today.Year - BirthDate.Value.Year;
            if (BirthDate.Value.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}