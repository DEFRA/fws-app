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


# (Checklist)
Once you clone this repository you'll need to make a few changes before you're ready to start:

- [ ] Add service name and description to the README above
- [ ] Check over the content of the 404 and 500 error pages and tailor to suit
- [ ] Update the `package.json` with the name, description and any git urls and authors etc.  
- [ ] Update the [views context data](/server/plugins/views.js#L39) to include the correct service and default page title
- [ ] Remove the .git folder in the root directory. This will cut the cord to this boilerplate repo.
- [ ] Update the build status badges to your new project

# Running the application

First build the application using:

`$ npm run build`

Currently this will just build the `govuk-frontend` sass but may be extended to include other build tasks as needed (e.g. client-side js using browserify or webpack etc.)

Now the application is ready to run:

`$ node index.js`
