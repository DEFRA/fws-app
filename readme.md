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

Node v18+

# Running the application

First build the application using:

`$ npm run build`

This will build the css based on the `govuk-frontend` scss/styles.

Now the application is ready to run:

`$ node index.js`
