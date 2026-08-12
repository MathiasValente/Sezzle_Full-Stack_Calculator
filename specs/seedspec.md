# Full-Stack Calculator Assignment Seed Spec

## Purpose
Use this seed prompt to guide an AI-assisted implementation of a full-stack calculator application. The application must include a React frontend and a Go backend microservice, with clean architecture, typed contracts, test coverage, and documentation.

## Refined Prompt
Build a full-stack calculator application with a React frontend and a Go backend microservice.

Requirements:
- Frontend: React with TypeScript.
- Backend: Go REST API.
- The frontend must consume the backend API to perform arithmetic operations.
- Include input validation, error handling, and responsive layout.
- Backend must validate input, handle edge cases, and return JSON.
- Provide unit tests for both frontend and backend.
- Include README documentation covering setup, how to run each layer, API examples, and design decisions.
- Optional: Docker support for the full stack.

Core operations:
- Addition, Subtraction, Multiplication, Division
- Optional: Exponentiation, Square Root, Percentage

Deliverables:
1. Git repository with frontend and backend code.
2. README with setup and API examples.
3. Unit tests and coverage report.
4. Optional: Dockerfile for running frontend and backend together.

Architecture:
- `frontend/` should contain a React app with a calculator UI.
- `backend/` should contain a Go microservice with REST endpoints.
- The frontend and backend should be separate, with clear API contracts.

Evaluation criteria:
- Correctness: compute operations using backend API.
- Maintainability: readable, idiomatic code.
- Testability: unit tests that exercise key paths.
- Documentation: clear setup and usage instructions.
- Design: separation of responsibilities, validation, and error handling.

## Instructions for AI or Developer
1. Create a React + TypeScript frontend folder.
2. Create a Go backend folder with REST API endpoints.
3. Implement the calculator operations in the backend.
4. Add frontend components that call the backend and display results.
5. Validate all user input and handle invalid cases.
6. Add unit tests for backend functions and frontend components.
7. Write a README with setup, run, and API usage instructions.
8. Optionally, add Docker files for containerized deployment.

## Notes
- Keep the UI simple and mobile friendly.
- Prefer standard libraries and minimal dependencies.
- Make error messages user-friendly.
- Expose a clean API contract for operations and validation errors.
