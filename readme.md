[![Build Status](https://www.travis-ci.com/DEFRA/fws-app.svg?token=gaJqX8fxhoSAADGJKMvM&branch=master)](https://www.travis-ci.com/DEFRA/fws-app)

# fws-app
This is the FWIS management tool

# Environment variables

| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |         | development,test,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |

# Prerequisites

Node v8+

# Running the application

First build the application using:

`$ npm run build`

This will build the css based on the `govuk-frontend` scss/styles.

Now the application is ready to run:

`$ node index.js`
