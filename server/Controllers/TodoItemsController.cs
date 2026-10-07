using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using server.Dtos;

namespace server.Controllers;

[ApiController]
[Route("api/todoitems")]
public class TodoItemsController : ControllerBase
{
    private readonly ITodoItemService _todoItemService;

    public TodoItemsController(ITodoItemService todoItemService)
    {
        _todoItemService = todoItemService;
    }

    [HttpGet]
    public ActionResult<List<TodoItem>> GetAllTodoItems()
    {
        var todoItems = _todoItemService.GetAllTodoItems();
        return Ok(todoItems);
    }

    [HttpPost]
    public ActionResult<TodoItem> AddTodoItem(AddTodoItemRequest request)
    {
        var todoItem = _todoItemService.AddTodoItem(request.ItemName, request.IsComplete);
        return Created($"api/todoitems/{todoItem.Id}", todoItem);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteTodoItem(long id)
    {
        return _todoItemService.DeleteTodoItem(id) ? NoContent() : NotFound();
    }

}