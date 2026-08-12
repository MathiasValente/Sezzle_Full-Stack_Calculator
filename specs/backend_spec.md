# Backend Specification: Go Microservice

The backend is a lightweight Go microservice. It exposes a JSON REST API for performing arithmetic operations, validates payloads, enforces edge cases, handles CORS, and includes request logging.

## Tech Stack
- **Language**: Go (Golang)
- **Routing**: Go Standard Library `net/http` (leveraging modern pattern matching in Go 1.22+) or a lightweight router.
- **Testing**: Go's native `testing` package with table-driven unit tests.

## Package Structure
We will use a clean, modular structure:
```
backend/
├── cmd/
│   └── server/
│       └── main.go       # Application entry point, router setup, port config
├── pkg/
│   ├── calculator/       # Core arithmetic business logic (fully unit-tested)
│   │   ├── calculator.go
│   │   └── calculator_test.go
│   └── handlers/         # HTTP handlers, request/response structures, validation
│       ├── handlers.go
│       └── handlers_test.go
├── Dockerfile            # Container definition
├── go.mod                # Dependency tracking
└── README.md             # Go-specific documentation
```

## Core Implementation Details

### 1. Calculation Engine (`pkg/calculator`)
Pure functions with no HTTP dependencies:
- `Add(a, b float64) float64`
- `Subtract(a, b float64) float64`
- `Multiply(a, b float64) float64`
- `Divide(a, b float64) (float64, error)` -> Returns division-by-zero error if `b == 0`.
- `Power(base, exponent float64) float64`
- `Sqrt(a float64) (float64, error)` -> Returns error if `a < 0`.
- `Percentage(a, b float64) float64` -> Calculates percent value.

### 2. HTTP Handlers (`pkg/handlers`)
- **JSON Marshaling**: Read and parse `CalculateRequest` struct. Return HTTP `400 Bad Request` for malformed JSON.
- **Validation**: Enforce business rules before calling the calculator engine (e.g. division by zero, negative square root, unsupported operator).
- **CORS Handling**: Middleware to set headers:
  - `Access-Control-Allow-Origin: *` (or specific frontend port like `http://localhost:5173`)
  - `Access-Control-Allow-Methods: POST, GET, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type`
- **Request Logger Middleware**: Logs method, URI, status code, and latency for each request to `stdout`.

## Testing Strategy
- **Table-Driven Tests**: Write test tables containing input parameters, expected results, and expected error states for both the math engine and the API HTTP handlers.
- **Coverage**: Maintain high test coverage (aim for >90% coverage on core packages).
- **HTTP Testing**: Use standard library `net/http/httptest` package to test API response codes and payloads without running the live server.
