namespace prid_2324.Models;

public class QuizDTO{

    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool IsClosed { get; set; } = false;
    public bool IsTest { get; set; } = false;
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }  

    public string Statut { get; set; } = "";
    public string Evaluation { get; set; } = "";

}

public class BasicQuizDTO {
    public int Id { get; set; }
}

public class QuizWithDBDTO : QuizDTO {
    public DatabaseDTO Database { get; set; } = null!;
}

//Quiz with attempts
public class QuizWithAttemptsDTO : QuizDTO {
    public ICollection<AttemptDTO> Attempts { get; set; } = null!;
}

public class QuizWithAttemptsAndDBDTO : QuizDTO {
    public DatabaseDTO Database { get; set; } = null!;
    public ICollection<AttemptDTO> Attempts { get; set; } = new HashSet<AttemptDTO>();
    public ICollection<QuestionDTO> Questions { get; set; } = new HashSet<QuestionDTO>();
}
