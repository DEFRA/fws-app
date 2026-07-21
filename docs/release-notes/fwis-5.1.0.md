# FWIS API and FWIS App Release - Tuesday 28th July 2026

## Information

This release will:
- update FWIS secret keys
- update the FWIS API and FWIS App to Node v24

## FWIS API Branch
The branch for this release is release/4.2.0 ([fws-api](https://github.com/DEFRA/fws-api/ repository)

## FWIS App Tag
The tag for this release is 5.1.0 ([fws-app](https://github.com/DEFRA/fws-app/) respository)

## Tickets

Tickets linked to the release in Jira: [https://eaflood.atlassian.net/projects/NI/versions/42345/tab/release-report-all-issues](https://eaflood.atlassian.net/projects/NI/versions/42345/tab/release-report-all-issues)

## Instructions

 - CCOE WebOps to update Lambda runtime for FWIS API to Node.js 24 as defined in work and backout plan
 - CCOE WebOps to update FWIS secrets keys as defined in work and backout plan
 
Steps
1. Execute FWS_{stage}_02_DEPLOY_FWS_API`
    - Modules to deploy: `lambda`
2. Execute FWS_{stage}_03_DEPLOY_FWS_APPLICATION_1
3. Execute FWS_{stage}_06_FWIS_SMOKE_TESTS

Confirm deployment with the flood dev and test team.
