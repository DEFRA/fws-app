#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
readonly SEPARATOR="======================================"

is_port_in_use() {
    local port="$1"
    ss -ltn 2>/dev/null | awk 'NR>1 {print $4}' | grep -Eq ":${port}$"
}

is_fwsdb_mapped_to_port() {
    local port="$1"
    docker ps --format '{{.Names}}\t{{.Ports}}' 2>/dev/null | grep -Eq "fwsdb.*:${port}->5432/tcp"
}

resolve_fws_db_host_port() {
    if [[ -n "${FWS_DB_HOST_PORT:-}" ]]; then
        echo "Using explicit FWS_DB_HOST_PORT=${FWS_DB_HOST_PORT}"
        return
    fi

    if is_port_in_use 5432; then
        if is_fwsdb_mapped_to_port 5432; then
            export FWS_DB_HOST_PORT=5432
            echo "Detected running fwsdb already mapped to 5432; continuing with FWS_DB_HOST_PORT=5432"
        else
            export FWS_DB_HOST_PORT=5433
            echo "Warning: Host port 5432 is already in use. Falling back to FWS_DB_HOST_PORT=5433"
        fi
    else
        export FWS_DB_HOST_PORT=5432
    fi
}

ensure_localstack_local_stage() {
    local api_id
    local stage_name

    api_id=$(docker exec localstack-main awslocal apigateway get-rest-apis --query "items[?name=='FWS API Gateway']|[-1].id" --output text 2>/dev/null | tr -d '\r')

    if [[ -z "$api_id" || "$api_id" == "None" ]]; then
        echo "Error: Could not find FWS API Gateway in LocalStack" >&2
        exit 1
    fi

    stage_name=$(docker exec localstack-main awslocal apigateway get-stages --rest-api-id "$api_id" --query "item[?stageName=='local'].stageName" --output text 2>/dev/null | tr -d '\r')

    if [[ "$stage_name" == "local" ]]; then
        echo "✓ LocalStack API stage 'local' is present (API ID: $api_id)"
        return
    fi

    echo "LocalStack API stage 'local' is missing for API ID: $api_id; creating deployment..."
    docker exec localstack-main awslocal apigateway create-deployment --rest-api-id "$api_id" --stage-name local >/dev/null
    echo "✓ LocalStack API stage 'local' created (API ID: $api_id)"
}

echo "$SEPARATOR"
echo "FWS App Local Startup Script"
echo "$SEPARATOR"
echo ""

# Step 0: Check for active Python virtual environment
echo "Step 0: Checking Python virtual environment..."

if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "Error: No Python virtual environment is active" >&2
    echo "" >&2
    echo "Please activate your Python virtual environment before running this script:" >&2
    echo "  source ~/environments/my_env/bin/activate" >&2
    echo "" >&2
    echo "Or if using a different virtual environment:" >&2
    echo "  source /path/to/your/venv/bin/activate" >&2
    echo "" >&2
    exit 1
fi

echo "✓ Python virtual environment active: $VIRTUAL_ENV"
echo ""

# Step 1: Check .env file for required variables
echo "Step 1: Validating .env file..."

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Error: .env file not found at $ENV_FILE" >&2
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
    value=$(grep "^${var}=" "$ENV_FILE" | cut -d'=' -f2- | tr -d ' ' || true)
    
    if [[ -z "$value" ]]; then
        MISSING_VARS+=("$var")
    fi
done

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
    echo "Error: The following required environment variables are missing or empty in .env:" >&2
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var" >&2
    done
    echo "" >&2
    echo "Please populate these values in $ENV_FILE before running this script." >&2
    exit 1
fi

echo "✓ All required environment variables are set"
echo ""

# Step 1.5: Resolve DB host port and disable AWS pager
echo "Step 1.5: Resolving DB host port..."
resolve_fws_db_host_port
export FWS_DB_HOST_PORT
export AWS_PAGER=""

echo "✓ Using FWS_DB_HOST_PORT=$FWS_DB_HOST_PORT"
echo ""

# Step 2: Bootstrap LocalStack API
echo "Step 2: Bootstrapping LocalStack API..."
FWS_API_DIR="$PROJECT_ROOT/../fws-api"

if [[ ! -d "$FWS_API_DIR" ]]; then
    echo "Error: fws-api directory not found at $FWS_API_DIR" >&2
    echo "Please ensure fws-api is in the same parent directory as fws-app" >&2
    exit 1
fi

cd "$FWS_API_DIR"
echo "Running npm run bootstrap-debug in $FWS_API_DIR..."
npm run bootstrap-debug

echo "✓ LocalStack API bootstrapped successfully"
echo ""

# Step 3: Ensure LocalStack API stage exists
echo "Step 3: Verifying LocalStack API stage..."
ensure_localstack_local_stage

echo ""

# Step 4: Update LocalStack URL in .env
echo "Step 4: Updating FWS_API_URL in .env..."
cd "$SCRIPT_DIR"
./update-localstack-url.sh

echo "✓ FWS_API_URL updated"
echo ""

# Step 5: Start Docker Compose services
echo "Step 5: Starting Docker Compose services..."
cd "$PROJECT_ROOT"
docker compose -f docker/infrastructure.yml -f docker/app.yml up -d --build

echo "✓ Services started successfully"
echo ""

# Step 6: Display success message
echo "$SEPARATOR"
echo "✓ FWS App is now running!"
echo "$SEPARATOR"
echo ""
echo "Access the application at:"
echo "  → http://localhost:3000"
echo ""
echo "To view logs:"
echo "  docker compose -f docker/infrastructure.yml -f docker/app.yml logs -f"
echo ""
echo "To stop services:"
echo "  docker compose -f docker/infrastructure.yml -f docker/app.yml down"
echo ""
