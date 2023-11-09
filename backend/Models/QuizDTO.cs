namespace prid_2324.Models;

public class QuizDTO{

    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = false;
    public bool IsTest { get; set; } = false;
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }  



}

//Quiz with Questions
public class QuizWithQuestionsDTO : QuizDTO {
    public ICollection<QuestionDTO> Questions { get; set; } = null!;
}

//Quiz with questions and solutions
public class QuizWithQuestionsAndSolutionsDTO : QuizWithQuestionsDTO {
    public ICollection<SolutionDTO> Solutions { get; set; } = null!;
}

//Quiz with questions and answers

public class QuizWithQuestionsAndAnswersDTO : QuizWithQuestionsDTO {
    public ICollection<AnswerDTO> Answers { get; set; } = null!;
}

//Quiz with attempts
public class QuizWithAttemptsDTO : QuizDTO {
    public ICollection<AttemptDTO> Attempts { get; set; } = null!;
}

//Quiz with attempts and answers
public class QuizWithAttemptsAndAnswersDTO : QuizWithAttemptsDTO {
    public ICollection<AnswerDTO> Answers { get; set; } = null!;
}