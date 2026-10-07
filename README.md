# TODO List App

A simple full-stack to-do application built with Angular and ASP.NET Core.

## Requirements

- The user must be able to see their TODO list, add items to it and delete items from it
- Use the latest version of angular for the frontend
- Use the latest version of .NET web API for the backend
- You can manage the data on the backend in memory, no need to set up a database for this test
- Follow best practices around code, testing and architecture as you understand them
- Email us your solution in the form of a link to a git repository
- If any special instructions are needed to run the project, beyond npm install and restoring nuget packages, put them in a readme in the repository

## Features

- View all TODO items.
- Add TODO items.
- Delete TODO items.
- Display validation and request errors.

Items are stored on the backend in memory and disappear when the server restarts. The data model includes an `isComplete` field, but marking items as complete is not currently implemented.

## Technology Stack

| Technology | Version |
|---|---|
| Angular | 21 | 
| Node.js | 24 |
| .NET | 10.0 | 

## Prerequisites

Install:

- The .NET 10 SDK.
- A Node.js version compatible with Angular 21.
- npm.

Check your installations:

```bash
dotnet --version
node --version
npm --version
```

## Run Locally

Clone this repository and open its root directory.

### 1. Start the API

In a terminal:

```bash
cd server
dotnet restore
dotnet run --launch-profile http
```

The API runs at:

```text
http://localhost:5253
```

The TODO endpoint is:

```text
http://localhost:5253/api/todoitems
```

### 2. Start the Angular Client

In a second terminal, starting from the repository root:

```bash
cd client
npm install
npm start
```

Open:

```text
http://localhost:4200
```

Both applications must be running for the client to load and modify tasks.

### Assumptions

- The .NET Web API requires a nonblank item name with a maximum length of 500 characters. Invalid requests return `400 Bad Request`.

### CORS

The server's CORS policy is configured in:

```text
server/Program.cs
```

For the default local setup, it allows this frontend origin:

```text
http://localhost:4200
```

### Architecture

The application separates the user interface, API communication, HTTP endpoints, and storage logic. The server's controller receives the service through dependency injection, keeping HTTP handling separate from storage logic.

### In-Memory Storage and Thread Safety

The TODO service is registered as a singleton so requests share the same collection. A shared lock synchronises reads, additions, and deletions, including ID generation.
The service returns copies of stored items so callers cannot modify shared data outside the lock, and response serialisation does not enumerate the live data collection.

### HTTPS

```bash
cd server
dotnet dev-certs https --trust
dotnet run --launch-profile https
```

Its HTTPS address is:

```text
https://localhost:7248
```

To call that listener, configure the client API URL as:

```text
https://localhost:7248/api/todoitems
```

Port `5253` is configured for HTTP; port `7248` is configured for HTTPS.

## API

Base path:

```text
/api/todoitems
```

| Method | Endpoint | Description | Success response |
|---|---|---|---|
| GET | `/api/todoitems` | Get all items | `200 OK` |
| POST | `/api/todoitems` | Add an item | `201 Created` |
| DELETE | `/api/todoitems/{id}` | Delete an item | `204 No Content` |

Deleting an item that does not exist returns `404 Not Found`.

### Get All Items

```bash
curl http://localhost:5253/api/todoitems
```

Example response:

```json
[
  {
    "id": 1,
    "itemName": "Buy milk",
    "isComplete": false
  }
]
```

### Add an Item

```bash
curl -X POST http://localhost:5253/api/todoitems \
  -H "Content-Type: application/json" \
  -d '{"itemName":"Buy milk","isComplete":false}'
```

Example response body:

```json
{
  "id": 1,
  "itemName": "Buy milk",
  "isComplete": false
}
```

### Delete an Item

```bash
curl -X DELETE http://localhost:5253/api/todoitems/1
```

A successful deletion has no response body.

## Tests

Run the client tests:

```bash
cd client
npm test
```

For a single run:

```bash
npm test -- --watch=false
```
