# API Specification: Calculator Backend

This specification details the REST API contract between the React frontend and the Go backend microservice.

## Base URL
When running locally: `http://localhost:8080`

## Endpoints

### 1. Calculate Operation
Performs an arithmetic operation on one or two operands.

* **URL**: `/api/calculate`
* **Method**: `POST`
* **Headers**:
  * `Content-Type: application/json`
* **Request Body**:
  * **Two-operand operations** (`+`, `-`, `*`, `/`, `^`, `%`):
    ```json
    {
      "operator": "add",
      "operand1": 10.5,
      "operand2": 5.2
    }
    ```
  * **One-operand operations** (`sqrt`):
    ```json
    {
      "operator": "sqrt",
      "operand1": 16.0
    }
    ```

#### Operator Enum
The `operator` field supports the following values:
* `add` (Addition)
* `subtract` (Subtraction)
* `multiply` (Multiplication)
* `divide` (Division)
* `power` (Exponentiation)
* `sqrt` (Square Root)
* `percentage` (Percentage - e.g., operand1 percent of operand2, or operand1 / 100)

*Note: For `percentage`, we will define standard behavior. e.g., `percentage` of operand1 is `operand1 / 100` if operand2 is omitted, or `(operand1 * operand2) / 100` if operand2 is provided.*

#### Success Response
* **Status Code**: `200 OK`
* **Content-Type**: `application/json`
* **Body**:
  ```json
  {
    "result": 15.7,
    "expression": "10.5 + 5.2 = 15.7"
  }
  ```

#### Error Responses
* **Status Code**: `400 Bad Request`
* **Content-Type**: `application/json`
* **Body (Invalid input format or validation error)**:
  ```json
  {
    "error": "Invalid input: operand2 cannot be zero for division operation"
  }
  ```
* **Body (Negative square root error)**:
  ```json
  {
    "error": "Invalid input: cannot calculate square root of a negative number"
  }
  ```
* **Body (Malformed JSON)**:
  ```json
  {
    "error": "Malformed JSON request body"
  }
  ```

### 2. Health Check
Endpoint used by Docker/Kubernetes or status monitors to verify the service is running.

* **URL**: `/health`
* **Method**: `GET`
* **Success Response**:
  * **Status Code**: `200 OK`
  * **Content-Type**: `application/json`
  * **Body**:
    ```json
    {
      "status": "healthy"
    }
    ```
