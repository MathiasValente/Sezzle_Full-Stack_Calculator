# Frontend Specification

## Goal
Build a React frontend in TypeScript that provides an intuitive calculator interface and uses the backend API for arithmetic operations.

## Core Features
- Input fields for one or two numeric values.
- Operation selector for add, subtract, multiply, divide.
- Optional: exponentiation, square root, percentage.
- Display result or validation/error messages.
- Responsive layout for desktop and mobile.
- Clear button and result reset support.

## UI Behavior
- Validate input before sending API requests.
- Show inline validation for missing or invalid numbers.
- Show API error responses to the user.
- Disable controls while waiting for backend response.

## API Consumption
- Call backend REST endpoint(s) for computation.
- Use a typed request/response contract.
- Example API payload:
  {
    "operation": "add",
    "a": 3,
    "b": 4
  }
- Example response payload:
  {
    "result": 7,
    "operation": "add"
  }

## Architecture
- `frontend/src/` should contain:
  - `App.tsx` or main calculator page.
  - `components/CalculatorForm.tsx`.
  - `services/api.ts` for backend calls.
  - `types/` for request/response interfaces.
- Keep business logic minimal in components.
- Use React hooks for state management.

## Testing
- Add unit tests for:
  - form validation logic.
  - API service behavior (mocked fetch).
  - result and error display behavior.
- Use React Testing Library and Jest.

## Deliverables
- Working React TypeScript app.
- README instructions for installing and running.
- Tests that cover key UI flows.
