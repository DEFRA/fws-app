# FWIS App Release - Wednesday, 12th March 2025

## Information

This release will update to Node v20

## Branches
The branch for this release is release/3.1.0
 
## Tickets

Tickets linked to the release in Jira: [https://eaflood.atlassian.net/projects/NI/versions/20931/tab/release-report-all-issues](https://eaflood.atlassian.net/projects/NI/versions/20931/tab/release-report-all-issues)

## Instructions

 - CCoE WebOps to run ansible playbook to update Node version on fwis servers to node v20


Steps
1 - - `FWS_{stage}_02_DEPLOY_FWS_API`
  - Modules to deploy: `lambda`

2 - Execute FWS_{stage}_03_DEPLOY_FWS_APP

Confirm deployment with the flood dev and test team.