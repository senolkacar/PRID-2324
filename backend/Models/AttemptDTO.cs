namespace prid_2324.Models;

public class AttemptDTO{
    public int Id { get; set; }
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }

    public int QuizId { get; set; }
    public int StudentId { get; set; }
    public ICollection<AnswerDTO> Answers { get; set; } = new HashSet<AnswerDTO>();
}