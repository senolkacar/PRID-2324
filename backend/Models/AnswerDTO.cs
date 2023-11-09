namespace prid_2324.Models;

public class AnswerDTO{
    public int Id { get; set; }
    public string Sql { get; set; } = null!;
    public DateTimeOffset? Timestamp { get; set; }
    public bool IsCorrect { get; set; } = false;
}