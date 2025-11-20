[![Build Status](https://www.travis-ci.com/DEFRA/fws-app.svg?token=gaJqX8fxhoSAADGJKMvM&branch=master)](https://www.travis-ci.com/DEFRA/fws-app)[![Maintainability](https://api.codeclimate.com/v1/badges/ecaa39b7ca248c7ede24/maintainability)](https://codeclimate.com/github/DEFRA/fws-app/maintainability)[![Test Coverage](https://api.codeclimate.com/v1/badges/ecaa39b7ca248c7ede24/test_coverage)](https://codeclimate.com/github/DEFRA/fws-app/test_coverage)

# fws-app
This is the FWIS management tool

# Environment variables

| name               | description           | required |        default        |       valid        | notes |
|--------------------|------------------     |:--------:|-----------------------|:------------------:|-------|
| FWS_ENV_NAME       | Environment name      |    no    | dev                   | dev,tst,pre,prd    |       |
| PORT               | Port number           |    no    | 3000                  |                    |       |
| FWS_API_URL        | API url               |    yes   |                       |                    |       |
| FWS_API_KEY        | API key               |    yes   |                       |                    |       |
| FWS_APP_PROXY      | Proxy                 |    no    |                       |                    |       |
| AD_CLIENT_ID       | AD Client Id          |    yes   |                       |                    |       |
| AD_CLIENT_SECRET   | AD Client Secret      |    yes   |                       |                    |       |
| AD_TENANT          | AD Tenant             |    yes   |                       |                    |       |
| AD_COOKIE_PASSWORD | Cookie password       |    yes   |                       |                    |       |
| IS_SECURE          | Secure cookie         |    no    | false                 |                    |       |
| FORCE_HTTPS        | Force https           |    no    | false                 |                    |       |
| HOME_PAGE          | Home page             |    no    | http://localhost:3000 |                    |       |
| LOCAL_CACHE        | Force local cache     |    no    | true                  |                    |       |
| REDIS_HOST         |                       |    no    |                       |                    |       |
| REDIS_PORT         |                       |    no    |                       |                    |       |
| REDIS_TLS          |                       |    no    | false                 |                    |       |
| FWS_APP_GA_ID      | Google analytics Id   |    no    |                       |                    |       |

# Prerequisites

Node v22+

# Running the application

First build the application using:

`$ npm run build`

This will build the css based on the `govuk-frontend` scss/styles.

Now the application is ready to run:

`$ node index.js`

# Use Of Containerisation

A Redis container is used to provide full test coverage for Redis instance connectivity.
At present the Redis container exists for the duration of test runs **only**.
If Redis containers are to be used for future local development, refactoring  is required accordingly.

# Docker Setup

## Prerequisites

- Docker and Docker Compose installed
- Python virtual environment (required for fws-api setup)
- [fws-api](https://github.com/DEFRA/fws-api) cloned as a sibling directory to fws-app

## Quick Start

The easiest way to run fws-app with Docker is using the automated startup script:

```bash
# 1. Activate your Python virtual environment
source ~/environments/my_env/bin/activate

# 2. Configure environment variables
# Copy docker/.env and populate the required secrets:
# - AD_CLIENT_ID
# - AD_CLIENT_SECRET
# - AD_TENANT
# - AD_COOKIE_PASSWORD

# 3. Run the startup script
./docker/scripts/start-local.sh
```

The `start-local.sh` script will:
1. Validate all required environment variables are set
2. Bootstrap the fws-api in LocalStack (`npm run bootstrap-debug`)
3. Auto-populate the `FWS_API_URL` from LocalStack
4. Build and start all Docker services
5. Display the application URL: http://localhost:3000

## Manual Docker Commands

### Build the fws-app image only

```bash
docker build -f docker/Dockerfile -t fws-app:latest --target development .
```

### Run with Docker Compose

```bash
# Start all services (Redis + fws-app)
docker compose -f docker/infrastructure.yml up -d

# Start with rebuild
docker compose -f docker/infrastructure.yml up -d --build

# View logs
docker compose -f docker/infrastructure.yml logs -f

# Stop all services
docker compose -f docker/infrastructure.yml down
```

### Start individual services

```bash
# Start only Redis
docker compose -f docker/infrastructure.yml up -d fws-app-redis

# Start only fws-app
docker compose -f docker/infrastructure.yml up -d fws-app
```

## Configuration

Environment variables are managed in `docker/.env`. See the Environment Variables section above for required values.

**Note:** Never commit secrets to `docker/.env`. A pre-commit hook is available to prevent this:

```bash
./install-hooks.sh
```

## Helper Scripts

- `docker/scripts/start-local.sh` - Full automated setup and startup
- `docker/scripts/update-localstack-url.sh` - Update FWS_API_URL from LocalStack

## Network Configuration

The fws-app container connects to:
- **default network** - For communication with fws-app-redis
- **docker_ls (LocalStack network)** - For communication with the fws-api in LocalStack

Ensure LocalStack is running before starting fws-app if you need API connectivity.

