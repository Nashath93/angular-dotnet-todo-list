import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TodoItem } from "../models/todoitem";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TodoItemService {

    private apiUrl: string = "http://localhost:5253/api/todoitems";

    constructor(private httpClient: HttpClient) { };

    getAllTodoItems(): Observable<TodoItem[]> {
        return this.httpClient.get<TodoItem[]>(this.apiUrl);
    }

    addTodoItem(itemName: string, isComplete: boolean): Observable<TodoItem> {
        return this.httpClient.post<TodoItem>(this.apiUrl, {
            itemName,
            isComplete
        });
    }

    deleteTodoItem(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
    }

}