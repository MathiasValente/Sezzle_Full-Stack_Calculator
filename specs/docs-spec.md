# Documentation Specification

## README Requirements
The README should include:
- Project overview and objective.
- Architecture summary.
- Setup instructions for frontend and backend.
- How to run the frontend app.
- How to run the backend service.
- Example API calls with request and response payloads.
- How to run tests and view coverage.
- Design decisions and assumptions.
- Optional: Docker instructions for local container setup.

## Suggested Sections
1. Introduction
2. Architecture and technology choices
3. Running the backend
4. Running the frontend
5. API documentation
6. Testing
7. Optional Docker support
8. Notes and assumptions

## API Examples
Include at least one sample `curl` request for the calculator API.
Example:
```bash
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":3,"b":5}'
```

## Design Rationale
Explain:
- why React + TypeScript was chosen for the UI
- why Go was used for the backend microservice
- how the frontend/backend separation improves maintainability
- how validation and error handling are implemented

## Prompt Source
Document that AI assistance was used and optionally include the prompts that guided the implementation.
