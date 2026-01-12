# FWIS App Release - Tuesday 20th January 2026

## Information

This release will update to Node v22

## Branches
The branch for this release is release/4.1.0 ([fws-api](https://github.com/DEFRA/fws-api/) and [fws-app](https://github.com/DEFRA/fws-app/) respositories)


 
## Tickets

Tickets linked to the release in Jira: [https://eaflood.atlassian.net/projects/NI/versions/29550/tab/release-report-all-issues
](https://eaflood.atlassian.net/projects/NI/versions/29550/tab/release-report-all-issues)

## Instructions

 - CCOE WebOps to update FWS_{stage}_03_DEPLOY_FWS_APP to use node v22 as .nvmrc default rather then node 20
 - To strengthen defence against NPM supply chain attacks, CCOE WebOps to update FWS_{stage}_03_DEPLOY_FWS_APP to replace use of
   ```sh
   npm i/npm ci
   ```
   with
   ```sh
   npm ci --ignore-scripts && npm run build
   ```
 - CCoE WebOps to run ansible playbook to update Node version on fwis servers to node v22


Steps
1 - `FWS_{stage}_02_DEPLOY_FWS_API`
    - Modules to deploy: `lambda`
2 - Execute FWS_{stage}_03_DEPLOY_FWS_APP

Confirm deployment with the flood dev and test team.