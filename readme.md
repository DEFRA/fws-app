![Build status](https://github.com/DEFRA/fws-app/actions/workflows/ci.yml/badge.svg)[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fws-app&metric=alert_status)](https://sonarcloud.io/dashboard?id=DEFRA_fws-app)[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fws-app&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_fws-app)

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

Node v20+

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
