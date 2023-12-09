using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Query{
    public string Sql { get; set; } = null!;
    public List<string> Errors { get; set; } = new List<string>();
    public int RowCount { get; set; }
    public string[] Columns { get; set; } = null!;
    public string[][] Data { get; set; } = null!;
}


