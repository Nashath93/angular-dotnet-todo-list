import { Component, signal, OnInit } from '@angular/core';
import { TodoItem } from './models/todoitem';
import { FormsModule } from '@angular/forms';
import { TodoItemService } from './services/todoitem.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  todoItems = signal<TodoItem[]>([]);
  errorMessage = signal<string>('');
  newTodoItem: string = "";

  isLoading = signal(true);
  loadFailed = signal(false);
  isAdding = signal(false);

  constructor(private todoItemService: TodoItemService) { }

  ngOnInit(): void {
    this.todoItemService.getAllTodoItems()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.todoItems.set(data);
        },
        error: (error) => {
          this.loadFailed.set(true);
          console.log(`Failed to load to-do items: ${error}.`);
          this.errorMessage.set('Failed to load to-do items.');
        }
      });
  }

  addTodoItem(itemName: string): void {

    if (this.isAdding() || this.isLoading() || this.loadFailed()) {
      return;
    }

    this.errorMessage.set('');
    const trimmedItemName = itemName ? itemName.trim() : "";

    if (!trimmedItemName) {
      this.errorMessage.set('Enter a to-do item name.');
      return;
    }

    if (trimmedItemName.length > 500) {
      this.errorMessage.set('The to-do item name must be 500 characters or fewer.');
      return;
    }

    if (!/[a-zA-Z0-9]/.test(trimmedItemName)) {
      this.errorMessage.set("Invalid to-do item name.");
      return;
    }

    this.isAdding.set(true);

    this.todoItemService.addTodoItem(trimmedItemName, false)
      .pipe(finalize(() => this.isAdding.set(false)))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.todoItems.update(currentTodoItems => [...currentTodoItems, data]);
          this.newTodoItem = '';
        },
        error: (error) => {
          console.log(`Failed to add the item: ${error}.`);
          this.errorMessage.set('Failed to add the item.');
        }
      });
  }

  deleteTodoItem(id: number): void {
    this.todoItemService.deleteTodoItem(id).subscribe({
      next: () => {
        this.todoItems.update(prevItems => prevItems.filter(item => item.id !== id));
        console.log("Item successfully deleted");
      },
      error: (error) => {
        console.log("Failed to delete the item");
        this.errorMessage.set("Failed to delete the item");
      }
    });
  }

}
