#!/bin/bash

# AuraFlow POS Print Service - macOS Startup Script
# This script starts the print backend with sudo (required on macOS)

echo "╔════════════════════════════════════════════════╗"
echo "║  AuraFlow POS - Print Service (macOS)         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "⚠️  macOS requires elevated permissions for port 9100"
echo "   You will be prompted for your password."
echo ""
echo "Starting backend service with sudo..."
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the backend directory"
    echo "   Run: cd backend && ./start-macos.sh"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
    echo ""
fi

# Start with sudo
sudo npm start
