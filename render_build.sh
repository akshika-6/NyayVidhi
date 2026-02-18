#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Build complete! RAG features disabled to fit in 512MB RAM limit."
echo "Lawyer consultation and core features are fully functional."
