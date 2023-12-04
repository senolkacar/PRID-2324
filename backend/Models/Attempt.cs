using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Attempt{
    [Key]
    public int Id { get; set; }
    public DateTimeOffset? Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    public int QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public int GetScore(){
        int score = 0;
        foreach (var answer in Answers){
            if (answer.IsCorrect){
                score++;
            }
        }
        return score;
    }
}