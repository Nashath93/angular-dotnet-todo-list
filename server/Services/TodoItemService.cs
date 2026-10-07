using server.Models;

namespace server.Services;

public class TodoItemService : ITodoItemService
{

    private long _nextId = 1;
    private readonly List<TodoItem> _todoItems = []; // in-memory list to store todo-list items
    private readonly object _lock = new(); // make in-memory list storage thread safe throughout application's life

    public List<TodoItem> GetAllTodoItems()
    {
        lock (_lock)
        {
            return _todoItems.Select(item => new TodoItem
            {
                Id = item.Id,
                ItemName = item.ItemName,
                IsComplete = item.IsComplete
            }).ToList();
        }
    }

    public TodoItem AddTodoItem(string itemName, bool isComplete)
    {
        lock (_lock)
        {
            var item = new TodoItem
            {
                Id = _nextId++,
                ItemName = itemName,
                IsComplete = isComplete
            };

            _todoItems.Add(item);

            return new TodoItem
            {
                Id = item.Id,
                ItemName = item.ItemName,
                IsComplete = item.IsComplete
            };
        }
    }

    public bool DeleteTodoItem(long id)
    {
        lock (_lock)
        {
            return _todoItems.RemoveAll(item => item.Id == id) > 0;
        }
    }
}