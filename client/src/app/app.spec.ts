import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './app';
import { TodoItem } from './models/todoitem';
import { TodoItemService } from './services/todoitem.service';

describe('to-do list app - test cases', () => {
  const existingItem: TodoItem = {
    id: 1,
    itemName: 'Buy milk',
    isComplete: false
  };

  const mockService = {
    getAllTodoItems: vi.fn<TodoItemService['getAllTodoItems']>(),
    addTodoItem: vi.fn<TodoItemService['addTodoItem']>(),
    deleteTodoItem: vi.fn<TodoItemService['deleteTodoItem']>()
  };

  beforeEach(async () => {
    mockService.getAllTodoItems.mockReset();
    mockService.addTodoItem.mockReset();
    mockService.deleteTodoItem.mockReset();

    mockService.getAllTodoItems.mockReturnValue(of([]));
    mockService.deleteTodoItem.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: TodoItemService, useValue: mockService }
      ]
    }).compileComponents();
  });

  function createApp() {
    const fixture = TestBed.createComponent(App);

    // Runs ngOnInit, including the initial GET request.
    fixture.detectChanges();

    return {
      fixture,
      app: fixture.componentInstance
    };
  }

  it('loads and displays to-do items on application load', () => {
    mockService.getAllTodoItems.mockReturnValue(
      of([existingItem])
    );

    const { fixture, app } = createApp();

    expect(mockService.getAllTodoItems).toHaveBeenCalledTimes(1);
    expect(app.todoItems()).toEqual([existingItem]);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Buy milk');
  });

  it('adds a to-do item and clears the input', () => {
    mockService.getAllTodoItems.mockReturnValue(
      of([existingItem])
    );

    const newItem: TodoItem = {
      id: 2,
      itemName: 'Walk the dog',
      isComplete: false
    };

    mockService.addTodoItem.mockReturnValue(of(newItem));

    const { fixture, app } = createApp();

    app.newTodoItem = '  Walk the dog  ';
    app.addTodoItem(app.newTodoItem);
    fixture.detectChanges();

    expect(mockService.addTodoItem).toHaveBeenCalledExactlyOnceWith(
      'Walk the dog',
      false
    );
    expect(app.todoItems()).toEqual([existingItem, newItem]);
    expect(app.newTodoItem).toBe('');

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Walk the dog');
  });

  it('deletes only the selected to-do item', () => {
    const anotherItem: TodoItem = {
      id: 2,
      itemName: 'Read a book',
      isComplete: false
    };

    mockService.getAllTodoItems.mockReturnValue(
      of([existingItem, anotherItem])
    );

    const { app } = createApp();

    app.deleteTodoItem(existingItem.id);

    expect(mockService.deleteTodoItem)
      .toHaveBeenCalledExactlyOnceWith(existingItem.id);
    expect(app.todoItems()).toEqual([anotherItem]);
  });

  it('rejects a blank name without calling the service', () => {
    const { app } = createApp();

    app.newTodoItem = '   ';
    app.addTodoItem(app.newTodoItem);

    expect(mockService.addTodoItem).not.toHaveBeenCalled();
    expect(app.todoItems()).toEqual([]);
    expect(app.errorMessage()).not.toBe('');
  });

  it('preserves the input and existing items when adding fails', () => {
    mockService.getAllTodoItems.mockReturnValue(
      of([existingItem])
    );

    mockService.addTodoItem.mockReturnValue(
      throwError(() => new Error('Add failed'))
    );

    const { app } = createApp();

    app.newTodoItem = 'Walk the dog';
    app.addTodoItem(app.newTodoItem);

    expect(mockService.addTodoItem)
      .toHaveBeenCalledExactlyOnceWith('Walk the dog', false);
    expect(app.todoItems()).toEqual([existingItem]);
    expect(app.newTodoItem).toBe('Walk the dog');
    expect(app.errorMessage()).not.toBe('');
  });

  it('keeps the item and shows an error when deleting fails', () => {
    mockService.getAllTodoItems.mockReturnValue(
      of([existingItem])
    );

    mockService.deleteTodoItem.mockReturnValue(
      throwError(() => new Error('Delete failed'))
    );

    const { app } = createApp();

    app.deleteTodoItem(existingItem.id);

    expect(mockService.deleteTodoItem)
      .toHaveBeenCalledExactlyOnceWith(existingItem.id);
    expect(app.todoItems()).toEqual([existingItem]);
    expect(app.errorMessage()).not.toBe('');
  });
});