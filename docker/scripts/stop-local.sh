#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
readonly SEPARATOR="======================================"

echo "$SEPARATOR"
echo "FWS App Local Teardown Script"
echo "$SEPARATOR"
echo ""

# Step 1: Stop Docker Compose services
echo "Step 1: Stopping Docker Compose services..."
cd "$PROJECT_ROOT"
docker compose -f docker/infrastructure.yml -f docker/app.yml down

echo "✓ Docker services stopped successfully"
echo ""

# Step 2: Teardown LocalStack API
echo "Step 2: Tearing down LocalStack API..."
FWS_API_DIR="$PROJECT_ROOT/../fws-api"

if [[ -d "$FWS_API_DIR" ]]; then
    cd "$FWS_API_DIR"
    
    # Check if package.json exists and has the teardown script
    if [[ -f "package.json" ]] && grep -q "\"teardown\"" package.json 2>/dev/null; then
        echo "Running npm run teardown in $FWS_API_DIR..."
        npm run teardown
        echo "✓ LocalStack API torn down successfully"
    else
        echo "⚠️  Warning: teardown script not found in fws-api package.json, skipping..."
    fi
else
    echo "⚠️  Warning: fws-api directory not found at $FWS_API_DIR, skipping teardown..."
fi

echo ""

# Step 3: Display success message
echo "$SEPARATOR"
echo "✓ FWS App teardown complete!"
echo "$SEPARATOR"
echo ""
echo "To start services again:"
echo "  ./docker/scripts/start-local.sh"
echo ""
