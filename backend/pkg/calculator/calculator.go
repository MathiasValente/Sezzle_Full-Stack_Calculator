package calculator

import (
	"errors"
	"math"
)

var (
	ErrDivisionByZero     = errors.New("cannot divide by zero")
	ErrNegativeSquareRoot = errors.New("cannot calculate square root of a negative number")
)

// Add returns the sum of a and b.
func Add(a, b float64) float64 {
	return a + b
}

// Subtract returns the difference between a and b.
func Subtract(a, b float64) float64 {
	return a - b
}

// Multiply returns the product of a and b.
func Multiply(a, b float64) float64 {
	return a * b
}

// Divide returns the quotient of a and b. Returns ErrDivisionByZero if b is 0.
func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivisionByZero
	}
	return a / b, nil
}

// Power returns base raised to the exponent power.
func Power(base, exp float64) float64 {
	return math.Pow(base, exp)
}

// Sqrt returns the square root of a. Returns ErrNegativeSquareRoot if a is negative.
func Sqrt(a float64) (float64, error) {
	if a < 0 {
		return 0, ErrNegativeSquareRoot
	}
	return math.Sqrt(a), nil
}

// Percentage returns a divided by 100.
func Percentage(a float64) float64 {
	return a / 100.0
}

// PercentageOf returns a% of b (i.e. (a * b) / 100).
func PercentageOf(a, b float64) float64 {
	return (a * b) / 100.0
}
