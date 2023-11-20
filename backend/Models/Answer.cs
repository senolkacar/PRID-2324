using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Answer{
    [Key]
    public int Id { get; set; }
    public string Sql { get; set; } = null!;
    public DateTimeOffset? Timestamp { get; set; }
    public bool IsCorrect { get; set; } = false;
    public int AttemptId { get; set; }
    public Attempt Attempt { get; set; } = null!;
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}