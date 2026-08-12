# Backend Specification

## Goal
Build a Go REST API microservice that performs calculator operations and validates input.

## API Design
- Expose one or more endpoints under `/api`.
- Suggested endpoint: `POST /api/calculate`
- Request body:
  {
    "operation": "add",
    "a": 6,
    "b": 2
  }
- Response body:
  {
    "result": 8,
    "operation": "add"
  }
- Error response example:
  {
    "error": "division by zero is not allowed"
  }

## Supported Operations
- `add` / addition
- `subtract` / subtraction
- `multiply` / multiplication
- `divide` / division
- Optional: `power`, `sqrt`, `percent`

## Validation Rules
- `a` and `b` must be numbers for binary operations.
- For `divide`, `b` must not be zero.
- For `sqrt`, `a` must be non-negative.
- For `percent`, define behavior clearly and validate input.
- Return HTTP 400 for invalid request data.

## Architecture
- Use Go modules and standard library HTTP handlers.
- Keep calculation logic in a dedicated package, such as `calculator` or `internal/calc`.
- Keep handler wiring separate from business logic.
- Suggested package layout:
  - `backend/cmd/server/main.go`
  - `backend/internal/calc/calc.go`
  - `backend/internal/api/handlers.go`
  - `backend/internal/api/types.go`

## Testing
- Add Go unit tests for calculator operations.
- Test validation and edge cases (division by zero, invalid operation).
- Test HTTP handler behavior if possible.

## Deliverables
- A Go microservice with REST API.
- Go tests for operation logic and validation.
- README instructions for running the backend.
