using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Question{
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = null!;

    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;
    public ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();

    [NotMapped]
    public int? PreviousQuestionId { get; set; }
    [NotMapped]
    public int? NextQuestionId { get; set; }
    [NotMapped]
    public bool HasAnswer { get; set; } = false;

    public bool UserHasAnswered(User user)
    {
        if(this.Quiz.Attempts.Any(a => a.StudentId == user.Id))
        {
            var attempt = this.Quiz.Attempts.LastOrDefault(a => a.StudentId == user.Id);
            return attempt?.Answers.Any(a => a.QuestionId == this.Id) ?? false;
        }
        return false;
    }   


    

}