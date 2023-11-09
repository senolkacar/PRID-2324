using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Question{
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = null!;

    public virtual Quiz Quiz { get; set; } = null!;
    public virtual ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
    public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
}