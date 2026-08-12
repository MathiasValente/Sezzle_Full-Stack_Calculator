package main

import (
	"log"
	"net/http"
	"os"

	"github.com/MathiasValente/Sezzle_Full-Stack_Calculator/backend/pkg/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := handlers.NewRouter()

	log.Printf("Starting calculator backend server on port %s...", port)
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
