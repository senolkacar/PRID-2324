using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MySql.Data.MySqlClient;
using System.Data;

namespace prid_2324.Models;
public class Database {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public ICollection<Quiz> Quizzes { get; set; } = new HashSet<Quiz>();

    public List<string> GetTables(string dbName){
        string[] tables = new string[0];
        using MySqlConnection connection = new($"server=localhost;database={dbName};uid=root;password=root");
        DataTable table = null;
        try
        {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SHOW TABLES", connection);
            MySqlDataAdapter adapter = new MySqlDataAdapter(command);
            table = new DataTable();
            adapter.Fill(table);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            //return false;
        }
        tables = table.Rows.Cast<DataRow>().Select(x => x[0].ToString()).ToArray();
        return tables.ToList();
    }

    public List<string> GetColumns(string dbName)
    {
        List<string> columns = new List<string>();
        string[] tables = GetTables(dbName).ToArray();

        using MySqlConnection connection = new($"server=localhost;database={dbName};uid=root;password=root");
        DataTable table = null;
        try
        {
            connection.Open();
            foreach (string t in tables)
            {
                MySqlCommand command = new MySqlCommand("SHOW COLUMNS FROM " + t, connection);
                MySqlDataAdapter adapter = new MySqlDataAdapter(command);
                table = new DataTable();
                adapter.Fill(table);

                foreach (DataRow row in table.Rows)
                {
                    string columnName = row["Field"].ToString();
                    columns.Add(columnName);
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            //return false;
        }

        return columns;
    }
}