namespace server.Models;

public class TodoItem
{
    public long Id { get; set; }
    public required string ItemName { get; set; }
    public required bool IsComplete { get; set; }
}