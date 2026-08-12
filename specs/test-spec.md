# Test Specification

## Backend Tests
- Unit tests for each arithmetic function:
  - addition
  - subtraction
  - multiplication
  - division
- Edge case tests:
  - division by zero
  - invalid operation names
  - invalid input values
  - optional operations (power, sqrt, percent) if implemented
- Handler tests:
  - valid request returns 200 and correct result
  - invalid request returns 400 and error message
  - JSON decode/encode contract is preserved

## Frontend Tests
- Component behavior tests:
  - correct rendering of form controls
  - form validation for empty or invalid numeric input
  - display of calculation result
  - display of backend error messages
- Service tests:
  - API call uses correct payload
  - response mapping works as expected
  - error cases are surfaced to the UI
- Responsive/basic layout tests if using CSS classes or snapshots.

## Coverage
- Aim for test coverage around key functionality, not necessarily 100%.
- Document how to run coverage reports for both layers.

## Tools
- Backend: `go test ./...`
- Frontend: `npm test` or `pnpm test` with coverage flags.

## Deliverables
- Working automated tests for both frontend and backend.
- Example commands in documentation for running tests.
