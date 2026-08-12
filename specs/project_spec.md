# Project Specification: Full-Stack Calculator

## Objective
Build a full-stack calculator application with a React frontend and a Go backend microservice. The frontend will consume the backend REST API to perform basic and advanced arithmetic operations. The focus is on clean design, maintainable code, and a testable architecture.

## Tech Stack & Constraints
- **Frontend**: React (TypeScript preferred), styled with Vanilla CSS (premium aesthetics).
- **Backend**: Go (preferred), exposing REST API endpoints.
- **Deployment**: Dockerfile/Docker Compose for full-stack deployment (optional but highly recommended for evaluation).
- **Quality**: Unit tests covering key functionality for both layers, with coverage reports.

## Functional Scope
### Core Operations
1. **Addition (`+`)**: Add two numbers.
2. **Subtraction (`-`)**: Subtract second number from first.
3. **Multiplication (`*`)**: Multiply two numbers.
4. **Division (`/`)**: Divide first number by second (with zero-division protection).

### Advanced Operations (Optional/Included)
5. **Exponentiation (`^` / `pow`)**: Base raised to an exponent.
6. **Square Root (`√` / `sqrt`)**: Square root of a non-negative number.
7. **Percentage (`%`)**: Calculate percentage of a number or perform percentage-based operations.

## Deliverables
1. **Git Repository**: Frontend and backend source code.
2. **Specs Directory**: Documented specifications of the app components.
3. **README**: Setup instructions, running instructions, API usage examples, and design decisions.
4. **Unit Tests**: Full test suite and instructions for checking coverage.
5. **Docker Setup**: Multi-stage Docker files or `docker-compose.yml` to run the stack.
