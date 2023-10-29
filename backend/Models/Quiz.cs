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
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
}