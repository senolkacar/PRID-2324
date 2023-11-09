using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Student : User {
    public Student() {
        Role = Role.Student;
     }
    public virtual ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
    
}