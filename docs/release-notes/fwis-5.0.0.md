# FWIS App Release - Tuesday 20th January 2026

## Information

This release will update FWIS App to ECS

## Branches
The branch for this release is release/5.0.0 ([fws-app](https://github.com/DEFRA/fws-app/) respositories)


 
## Tickets

Tickets linked to the release in Jira: [https://eaflood.atlassian.net/projects/NI/versions/33570/tab/release-report-all-issues
](https://eaflood.atlassian.net/projects/NI/versions/33570/tab/release-report-all-issues)

## Instructions

 - CCOE WebOps to update FWS_{stage}_03_DEPLOY_FWS_APP to use tag
  
 -


Steps
1. Execute FWS_{stage}_02_DEPLOY_FWS_API`
    - Modules to deploy: `lambda`
2. Execute FWS_{stage}_03_DEPLOY_FWS_APP
3. Execute FWS_{stage}_05_FWIS_SMOKE_TESTS

Confirm deployment with the flood dev and test team.