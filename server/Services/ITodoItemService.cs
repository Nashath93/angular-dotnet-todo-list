using server.Models;

namespace server.Services;

public interface ITodoItemService
{
    List<TodoItem> GetAllTodoItems();
    TodoItem AddTodoItem(string itemName, bool isComplete);
    bool DeleteTodoItem(long id);
}