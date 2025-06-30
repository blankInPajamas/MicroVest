#!/bin/bash

# Start Ollama AI Server
echo "Starting Ollama AI Server..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Error: Ollama is not installed. Please install Ollama first."
    echo "Visit: https://ollama.ai/download"
    exit 1
fi

# Check if the model exists
echo "Checking for llama3.2:1b model..."
if ! ollama list | grep -q "llama3.2:1b"; then
    echo "Model llama3.2:1b not found. Pulling it now..."
    ollama pull llama3.2:1b
fi

# Start the Ollama server
echo "Starting Ollama server on port 11434..."
ollama serve

echo "Ollama server started successfully!"
echo "The AI chat feature is now available in the business details page."
echo ""
echo "To test the AI chat:"
echo "1. Go to any business details page"
echo "2. Click the 'Talk with AI' button"
echo "3. Ask questions about the business investment opportunity"
echo ""
echo "Press Ctrl+C to stop the server" 