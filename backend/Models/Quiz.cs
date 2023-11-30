using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Quiz {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = false;
    public bool IsTest { get; set; } = false;
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }

    public int DatabaseId {get; set;}
    public Database Database { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
    
    [NotMapped]
    public string Statut { get; set; } = "";

    public string GetStatus(User user) {
      string res="";
      if(this.IsClosed){
        res = "CLOTURE";
    }else{
            if(Attempts.Any(q => q.StudentId == user.Id)){
            Attempt attempt = Attempts.First(q => q.StudentId == user.Id);
            return attempt.Finish == null ? "EN_COURS" : "FINI";
            }else{
                res = "PAS_COMMENCE";
            }
        }
        return res;
    }

}