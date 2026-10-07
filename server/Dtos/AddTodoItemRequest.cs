using System.ComponentModel.DataAnnotations;

namespace server.Dtos;

public record AddTodoItemRequest(
    [Required]
    [MaxLength(500)]
    string ItemName,
    [Required]
    bool IsComplete
);