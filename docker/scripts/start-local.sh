#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

echo "======================================"
echo "FWS App Local Startup Script"
echo "======================================"
echo ""

# Step 0: Check for active Python virtual environment
echo "Step 0: Checking Python virtual environment..."

if [ -z "$VIRTUAL_ENV" ]; then
    echo "Error: No Python virtual environment is active"
    echo ""
    echo "Please activate your Python virtual environment before running this script:"
    echo "  source ~/environments/my_env/bin/activate"
    echo ""
    echo "Or if using a different virtual environment:"
    echo "  source /path/to/your/venv/bin/activate"
    echo ""
    exit 1
fi

echo "✓ Python virtual environment active: $VIRTUAL_ENV"
echo ""

# Step 1: Check .env file for required variables
echo "Step 1: Validating .env file..."

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Required variables (excluding FWS_API_URL which will be populated later)
REQUIRED_VARS=(
    "FWS_API_KEY"
    "AD_CLIENT_ID"
    "AD_CLIENT_SECRET"
    "AD_TENANT"
    "AD_COOKIE_PASSWORD"
    "LOG_LEVEL"
    "HOME_PAGE"
    "REDIS_HOST"
    "REDIS_PORT"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    # Extract value from .env file (handle both 'VAR=value' and 'export VAR=value')
    value=$(grep "^${var}=" "$ENV_FILE" | cut -d'=' -f2- | tr -d ' ')
    
    if [ -z "$value" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "Error: The following required environment variables are missing or empty in .env:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please populate these values in $ENV_FILE before running this script."
    exit 1
fi

echo "✓ All required environment variables are set"
echo ""

# Step 2: Bootstrap LocalStack API
echo "Step 2: Bootstrapping LocalStack API..."
FWS_API_DIR="$PROJECT_ROOT/../fws-api"

if [ ! -d "$FWS_API_DIR" ]; then
    echo "Error: fws-api directory not found at $FWS_API_DIR"
    echo "Please ensure fws-api is in the same parent directory as fws-app"
    exit 1
fi

cd "$FWS_API_DIR"
echo "Running npm run bootstrap-debug in $FWS_API_DIR..."
npm run bootstrap-debug

echo "✓ LocalStack API bootstrapped successfully"
echo ""

# Step 3: Update LocalStack URL in .env
echo "Step 3: Updating FWS_API_URL in .env..."
cd "$SCRIPT_DIR"
./update-localstack-url.sh

echo "✓ FWS_API_URL updated"
echo ""

# Step 4: Start Docker Compose services
echo "Step 4: Starting Docker Compose services..."
cd "$PROJECT_ROOT"
docker compose -f docker/infrastructure.yml up -d --build

echo "✓ Services started successfully"
echo ""

# Step 5: Display success message
echo "======================================"
echo "✓ FWS App is now running!"
echo "======================================"
echo ""
echo "Access the application at:"
echo "  → http://localhost:3000"
echo ""
echo "To view logs:"
echo "  docker compose -f docker/infrastructure.yml logs -f"
echo ""
echo "To stop services:"
echo "  docker compose -f docker/infrastructure.yml down"
echo ""
