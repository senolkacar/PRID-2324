namespace prid_2324.Models;

public class QuestionDTO{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = null!;

    public int? PreviousQuestionId { get; set; }

    public int? NextQuestionId { get; set; }
}

public class QuestionWithSolutionAnswerDTO: QuestionDTO{
    public BasicQuizDTO Quiz { get; set; } = null!;
    public ICollection<AnswerDTO> Answers { get; set; } = new HashSet<AnswerDTO>();
    public ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();

 

}

