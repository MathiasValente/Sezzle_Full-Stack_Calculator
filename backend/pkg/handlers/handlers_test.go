package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHandleHealth(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := NewRouter()

	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200 OK, got %v", rr.Code)
	}

	expected := `{"status":"healthy"}`
	body := strings.TrimSpace(rr.Body.String())
	if body != expected {
		t.Errorf("expected body %s, got %s", expected, body)
	}
}

func TestHandleCalculate(t *testing.T) {
	floatPtr := func(v float64) *float64 { return &v }

	tests := []struct {
		name           string
		requestBody    interface{}
		expectedStatus int
		verifyResponse func(t *testing.T, body string)
	}{
		{
			name: "successful addition",
			requestBody: CalculateRequest{
				Operator: "add",
				Operand1: 10,
				Operand2: floatPtr(5),
			},
			expectedStatus: http.StatusOK,
			verifyResponse: func(t *testing.T, body string) {
				var resp CalculateResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if resp.Result != 15 {
					t.Errorf("expected result 15, got %f", resp.Result)
				}
				if resp.Expression != "10 + 5 = 15" {
					t.Errorf("expected expression '10 + 5 = 15', got %q", resp.Expression)
				}
			},
		},
		{
			name: "successful division",
			requestBody: CalculateRequest{
				Operator: "divide",
				Operand1: 10,
				Operand2: floatPtr(4),
			},
			expectedStatus: http.StatusOK,
			verifyResponse: func(t *testing.T, body string) {
				var resp CalculateResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if resp.Result != 2.5 {
					t.Errorf("expected result 2.5, got %f", resp.Result)
				}
				if resp.Expression != "10 ÷ 4 = 2.5" {
					t.Errorf("expected expression '10 ÷ 4 = 2.5', got %q", resp.Expression)
				}
			},
		},
		{
			name: "division by zero error",
			requestBody: CalculateRequest{
				Operator: "divide",
				Operand1: 10,
				Operand2: floatPtr(0),
			},
			expectedStatus: http.StatusBadRequest,
			verifyResponse: func(t *testing.T, body string) {
				var resp ErrorResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if !strings.Contains(resp.Error, "cannot divide by zero") {
					t.Errorf("expected error containing 'cannot divide by zero', got %q", resp.Error)
				}
			},
		},
		{
			name: "square root of positive number",
			requestBody: CalculateRequest{
				Operator: "sqrt",
				Operand1: 16,
			},
			expectedStatus: http.StatusOK,
			verifyResponse: func(t *testing.T, body string) {
				var resp CalculateResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if resp.Result != 4 {
					t.Errorf("expected result 4, got %f", resp.Result)
				}
				if resp.Expression != "√16 = 4" {
					t.Errorf("expected expression '√16 = 4', got %q", resp.Expression)
				}
			},
		},
		{
			name: "square root of negative number error",
			requestBody: CalculateRequest{
				Operator: "sqrt",
				Operand1: -16,
			},
			expectedStatus: http.StatusBadRequest,
			verifyResponse: func(t *testing.T, body string) {
				var resp ErrorResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if !strings.Contains(resp.Error, "cannot calculate square root of a negative number") {
					t.Errorf("expected error containing 'cannot calculate square root of a negative number', got %q", resp.Error)
				}
			},
		},
		{
			name: "single operand percentage",
			requestBody: CalculateRequest{
				Operator: "percentage",
				Operand1: 15,
			},
			expectedStatus: http.StatusOK,
			verifyResponse: func(t *testing.T, body string) {
				var resp CalculateResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if resp.Result != 0.15 {
					t.Errorf("expected result 0.15, got %f", resp.Result)
				}
				if resp.Expression != "15% = 0.15" {
					t.Errorf("expected expression '15%% = 0.15', got %q", resp.Expression)
				}
			},
		},
		{
			name: "two operand percentage",
			requestBody: CalculateRequest{
				Operator: "percentage",
				Operand1: 20,
				Operand2: floatPtr(500),
			},
			expectedStatus: http.StatusOK,
			verifyResponse: func(t *testing.T, body string) {
				var resp CalculateResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if resp.Result != 100 {
					t.Errorf("expected result 100, got %f", resp.Result)
				}
				if resp.Expression != "20% of 500 = 100" {
					t.Errorf("expected expression '20%% of 500 = 100', got %q", resp.Expression)
				}
			},
		},
		{
			name: "missing operand2 error",
			requestBody: CalculateRequest{
				Operator: "add",
				Operand1: 10,
			},
			expectedStatus: http.StatusBadRequest,
			verifyResponse: func(t *testing.T, body string) {
				var resp ErrorResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if !strings.Contains(resp.Error, "Missing operand2") {
					t.Errorf("expected error containing 'Missing operand2', got %q", resp.Error)
				}
			},
		},
		{
			name:           "malformed JSON error",
			requestBody:    "{invalid-json}",
			expectedStatus: http.StatusBadRequest,
			verifyResponse: func(t *testing.T, body string) {
				var resp ErrorResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if !strings.Contains(resp.Error, "Malformed JSON request body") {
					t.Errorf("expected error containing 'Malformed JSON request body', got %q", resp.Error)
				}
			},
		},
		{
			name: "unsupported operator error",
			requestBody: CalculateRequest{
				Operator: "modulus",
				Operand1: 10,
				Operand2: floatPtr(3),
			},
			expectedStatus: http.StatusBadRequest,
			verifyResponse: func(t *testing.T, body string) {
				var resp ErrorResponse
				if err := json.Unmarshal([]byte(body), &resp); err != nil {
					t.Fatalf("failed to unmarshal: %v", err)
				}
				if !strings.Contains(resp.Error, "Unsupported operator") {
					t.Errorf("expected error containing 'Unsupported operator', got %q", resp.Error)
				}
			},
		},
	}

	router := NewRouter()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var bodyBytes []byte
			var err error

			if str, ok := tt.requestBody.(string); ok {
				bodyBytes = []byte(str)
			} else {
				bodyBytes, err = json.Marshal(tt.requestBody)
				if err != nil {
					t.Fatalf("failed to marshal body: %v", err)
				}
			}

			req, err := http.NewRequest("POST", "/api/calculate", bytes.NewBuffer(bodyBytes))
			if err != nil {
				t.Fatalf("failed to create request: %v", err)
			}
			req.Header.Set("Content-Type", "application/json")

			rr := httptest.NewRecorder()
			router.ServeHTTP(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, rr.Code)
			}

			tt.verifyResponse(t, rr.Body.String())
		})
	}
}

func TestCORSPreflight(t *testing.T) {
	req, err := http.NewRequest("OPTIONS", "/api/calculate", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := NewRouter()

	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusNoContent {
		t.Errorf("expected status 204 No Content, got %v", rr.Code)
	}

	if origin := rr.Header().Get("Access-Control-Allow-Origin"); origin != "*" {
		t.Errorf("expected Access-Control-Allow-Origin to be '*', got %q", origin)
	}

	if methods := rr.Header().Get("Access-Control-Allow-Methods"); methods != "POST, GET, OPTIONS" {
		t.Errorf("expected Access-Control-Allow-Methods to be 'POST, GET, OPTIONS', got %q", methods)
	}
}
