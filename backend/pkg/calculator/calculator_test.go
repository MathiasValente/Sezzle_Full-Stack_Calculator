package calculator

import (
	"errors"
	"testing"
)

func TestAdd(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive numbers", 2, 3, 5},
		{"negative numbers", -2, -3, -5},
		{"mixed signs", -2, 3, 1},
		{"decimals", 1.5, 2.25, 3.75},
		{"zero", 0, 5, 5},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res := Add(tt.a, tt.b)
			if res != tt.expected {
				t.Errorf("Add(%f, %f) = %f; expected %f", tt.a, tt.b, res, tt.expected)
			}
		})
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive numbers", 5, 3, 2},
		{"negative numbers", -5, -3, -2},
		{"mixed signs", -5, 3, -8},
		{"decimals", 5.5, 2.25, 3.25},
		{"subtract from zero", 0, 5, -5},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res := Subtract(tt.a, tt.b)
			if res != tt.expected {
				t.Errorf("Subtract(%f, %f) = %f; expected %f", tt.a, tt.b, res, tt.expected)
			}
		})
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive numbers", 2, 3, 6},
		{"negative numbers", -2, -3, 6},
		{"mixed signs", -2, 3, -6},
		{"by zero", 5, 0, 0},
		{"decimals", 1.5, 2.0, 3.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res := Multiply(tt.a, tt.b)
			if res != tt.expected {
				t.Errorf("Multiply(%f, %f) = %f; expected %f", tt.a, tt.b, res, tt.expected)
			}
		})
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		name          string
		a, b          float64
		expectedRes   float64
		expectedErr   error
	}{
		{"clean division", 6, 3, 2, nil},
		{"decimal result", 5, 2, 2.5, nil},
		{"negative division", -6, 3, -2, nil},
		{"divide zero", 0, 5, 0, nil},
		{"divide by zero", 5, 0, 0, ErrDivisionByZero},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res, err := Divide(tt.a, tt.b)
			if !errors.Is(err, tt.expectedErr) {
				t.Errorf("Divide(%f, %f) error = %v; expected error = %v", tt.a, tt.b, err, tt.expectedErr)
			}
			if err == nil && res != tt.expectedRes {
				t.Errorf("Divide(%f, %f) = %f; expected %f", tt.a, tt.b, res, tt.expectedRes)
			}
		})
	}
}

func TestPower(t *testing.T) {
	tests := []struct {
		name     string
		base, exp float64
		expected float64
	}{
		{"positive power", 2, 3, 8},
		{"zero power", 5, 0, 1},
		{"negative power", 2, -1, 0.5},
		{"fractional power", 9, 0.5, 3},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res := Power(tt.base, tt.exp)
			if res != tt.expected {
				t.Errorf("Power(%f, %f) = %f; expected %f", tt.base, tt.exp, res, tt.expected)
			}
		})
	}
}

func TestSqrt(t *testing.T) {
	tests := []struct {
		name        string
		a           float64
		expectedRes float64
		expectedErr error
	}{
		{"perfect square", 9, 3, nil},
		{"decimal square", 2.25, 1.5, nil},
		{"zero", 0, 0, nil},
		{"negative number", -9, 0, ErrNegativeSquareRoot},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res, err := Sqrt(tt.a)
			if !errors.Is(err, tt.expectedErr) {
				t.Errorf("Sqrt(%f) error = %v; expected error = %v", tt.a, err, tt.expectedErr)
			}
			if err == nil && res != tt.expectedRes {
				t.Errorf("Sqrt(%f) = %f; expected %f", tt.a, res, tt.expectedRes)
			}
		})
	}
}

func TestPercentage(t *testing.T) {
	res := Percentage(50)
	expected := 0.5
	if res != expected {
		t.Errorf("Percentage(50) = %f; expected %f", res, expected)
	}
}

func TestPercentageOf(t *testing.T) {
	res := PercentageOf(10, 500)
	expected := 50.0
	if res != expected {
		t.Errorf("PercentageOf(10, 500) = %f; expected %f", res, expected)
	}
}
