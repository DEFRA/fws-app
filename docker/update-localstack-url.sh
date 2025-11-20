#!/bin/bash

set -e

# Get the API ID for FWS API Gateway from LocalStack
API_ID=$(docker exec localstack-main awslocal apigateway get-rest-apis --query "items[?name=='FWS API Gateway'].id" --output text 2>/dev/null)

if [ -z "$API_ID" ]; then
    echo "Error: Could not find FWS API Gateway in LocalStack"
    exit 1
fi

echo "Found FWS API Gateway with ID: $API_ID"

# Build the full API URL
API_URL="http://localstack-main:4566/restapis/${API_ID}/local/_user_request_"

# Update the .env file
ENV_FILE="$(dirname "$0")/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
fi

# Use sed to replace the FWS_API_URL line
if grep -q "^FWS_API_URL=" "$ENV_FILE"; then
    sed -i "s|^FWS_API_URL=.*|FWS_API_URL=${API_URL}|" "$ENV_FILE"
    echo "Updated FWS_API_URL in $ENV_FILE"
    echo "New URL: $API_URL"
else
    echo "Error: FWS_API_URL not found in .env file"
    exit 1
fi
