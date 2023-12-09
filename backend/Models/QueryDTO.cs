namespace prid_2324.Models;

public class QueryDTO{
    public string Sql { get; set; } = null!;
    public int RowCount { get; set; }

    public string[] Columns { get; set; } = null!;
    public string[][] Data { get; set; } = null!;
}