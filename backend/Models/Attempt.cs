using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Attempt{
    [Key]
    public int Id { get; set; }
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
    public virtual ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    public virtual Quiz Quiz { get; set; } = null!;
    public virtual Student Student { get; set; } = null!;
}