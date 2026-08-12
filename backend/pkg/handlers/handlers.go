package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/MathiasValente/Sezzle_Full-Stack_Calculator/backend/pkg/calculator"
)

// CalculateRequest represents the incoming request payload.
type CalculateRequest struct {
	Operator string   `json:"operator"`
	Operand1 float64  `json:"operand1"`
	Operand2 *float64 `json:"operand2,omitempty"`
}

// CalculateResponse represents the successful calculation response.
type CalculateResponse struct {
	Result     float64 `json:"result"`
	Expression string  `json:"expression"`
}

// ErrorResponse represents an API error response.
type ErrorResponse struct {
	Error string `json:"error"`
}

// HealthResponse represents the service health response.
type HealthResponse struct {
	Status string `json:"status"`
}

// HandleHealth handles the GET /health requests.
func HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(HealthResponse{Status: "healthy"})
}

// HandleCalculate handles the POST /api/calculate requests.
func HandleCalculate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req CalculateRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ErrorResponse{Error: "Malformed JSON request body"})
		return
	}

	var result float64
	var expression string

	switch req.Operator {
	case "add":
		if req.Operand2 == nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: "Missing operand2 for add operation"})
			return
		}
		result = calculator.Add(req.Operand1, *req.Operand2)
		expression = fmt.Sprintf("%g + %g = %g", req.Operand1, *req.Operand2, result)

	case "subtract":
		if req.Operand2 == nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: "Missing operand2 for subtract operation"})
			return
		}
		result = calculator.Subtract(req.Operand1, *req.Operand2)
		expression = fmt.Sprintf("%g - %g = %g", req.Operand1, *req.Operand2, result)

	case "multiply":
		if req.Operand2 == nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: "Missing operand2 for multiply operation"})
			return
		}
		result = calculator.Multiply(req.Operand1, *req.Operand2)
		expression = fmt.Sprintf("%g × %g = %g", req.Operand1, *req.Operand2, result)

	case "divide":
		if req.Operand2 == nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: "Missing operand2 for divide operation"})
			return
		}
		res, err := calculator.Divide(req.Operand1, *req.Operand2)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: fmt.Sprintf("Invalid input: %v", err)})
			return
		}
		result = res
		expression = fmt.Sprintf("%g ÷ %g = %g", req.Operand1, *req.Operand2, result)

	case "power":
		if req.Operand2 == nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: "Missing operand2 for power operation"})
			return
		}
		result = calculator.Power(req.Operand1, *req.Operand2)
		expression = fmt.Sprintf("%g ^ %g = %g", req.Operand1, *req.Operand2, result)

	case "sqrt":
		res, err := calculator.Sqrt(req.Operand1)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(ErrorResponse{Error: fmt.Sprintf("Invalid input: %v", err)})
			return
		}
		result = res
		expression = fmt.Sprintf("√%g = %g", req.Operand1, result)

	case "percentage":
		if req.Operand2 == nil {
			result = calculator.Percentage(req.Operand1)
			expression = fmt.Sprintf("%g%% = %g", req.Operand1, result)
		} else {
			result = calculator.PercentageOf(req.Operand1, *req.Operand2)
			expression = fmt.Sprintf("%g%% of %g = %g", req.Operand1, *req.Operand2, result)
		}

	default:
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ErrorResponse{Error: fmt.Sprintf("Unsupported operator: %s", req.Operator)})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(CalculateResponse{
		Result:     result,
		Expression: expression,
	})
}

// LoggingMiddleware logs details of each incoming HTTP request.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("Started %s %s", r.Method, r.URL.Path)

		// Create a custom response writer to capture the status code.
		wrappedWriter := &responseWriterWrapper{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(wrappedWriter, r)

		log.Printf("Completed %s %s with %d in %v", r.Method, r.URL.Path, wrappedWriter.statusCode, time.Since(start))
	})
}

type responseWriterWrapper struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriterWrapper) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// CORSMiddleware handles Cross-Origin Resource Sharing.
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// NewRouter sets up the application router and registers endpoints wrapped in middleware.
func NewRouter() http.Handler {
	mux := http.NewServeMux()

	// Registering handlers
	// Note: Modern path matching handles POST/GET prefix validation
	mux.HandleFunc("POST /api/calculate", HandleCalculate)
	mux.HandleFunc("GET /health", HandleHealth)

	// Chain middlewares
	var handler http.Handler = mux
	handler = CORSMiddleware(handler)
	handler = LoggingMiddleware(handler)

	return handler
}
