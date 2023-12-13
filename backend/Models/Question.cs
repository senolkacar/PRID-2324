using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MySql.Data.MySqlClient;
using System.Data;


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
    [NotMapped]
    public Answer? Answer { get; set; } = null!;


    public bool UserHasAnswered(User user)
    {
        if(this.Quiz.Attempts.Any(a => a.StudentId == user.Id))
        {
            var attempt = this.Quiz.Attempts.LastOrDefault(a => a.StudentId == user.Id);
            return attempt?.Answers.Any(a => a.QuestionId == this.Id) ?? false;
        }
        return false;
    }

    public Query eval(string sql){

    
        Query query = new Query();
        query.Sql = sql;
        query.RowCount = 0;
        query.Columns = new string[0];
        query.Data = new string[0][];


        using MySqlConnection connection = new($"server=localhost;database=fournisseurs;uid=root;password=root");
        DataTable table = null;
        try
        {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + sql, connection);
            MySqlDataAdapter adapter = new MySqlDataAdapter(command);
            table = new DataTable();
            adapter.Fill(table);
        }
        catch (Exception e)
        {
            query.Errors.Add(e.Message);
            //return false;
        }

        query.RowCount = table.Rows.Count;
        query.Columns = table.Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToArray();
        query.Data = new string[table.Rows.Count][];
        for (int j = 0; j < table.Rows.Count; ++j)
        {
            query.Data[j] = new string[table.Columns.Count];
            for (int i = 0; i < table.Columns.Count; ++i)
            {
                object value = table.Rows[j][i];
                string str;
                if (value == null)
                    str = "NULL";
                else
                {
                    if (value is DateTime d)
                    {
                        if (d.TimeOfDay == TimeSpan.Zero)
                            str = d.ToString("yyyy-MM-dd");
                        else
                            str = d.ToString("yyyy-MM-dd hh:mm:ss");
                    }
                    else
                        str = value?.ToString() ?? "";
                }
                query.Data[j][i] = str;
            }
        }

    return query;
    }
}