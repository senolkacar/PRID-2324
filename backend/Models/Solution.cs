using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2324.Models;

public class Solution{
    [Key]
    public int Id { get; set; }
    public int Order { get; set; }
    public string Sql { get; set; } = null!;
    public Question Question { get; set; } = null!;
}