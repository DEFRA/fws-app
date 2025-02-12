# FWIS App Release - Wednesday, 19th February 2025

## Information

This release updates NPM packages and version numbers to bring it in line with FWS-api for the move from Serverless to Terraform.

## Tickets

Tickets linked to the release in Jira: [https://eaflood.atlassian.net/projects/NI/versions/20437/tab/release-report-all-issues](https://eaflood.atlassian.net/projects/NI/versions/20437/tab/release-report-all-issues)

## Instructions

Execute jobs:

- `FWS_{stage}_02_DEPLOY_FWS_API`
  - Modules to deploy: `api_gateway` and `lambda`
- `FWS_{stage}_03_DEPLOY_FWS_APP`

Confirm deployment with the flood dev and test team.
