# FWIS API and FWIS App Release - Thursday 29th October 2026

## Information

This release will:
- update Node.js dependencies
- update the FWIS API and FWIS App Node.js version to v24.22.1

## FWIS API Branch
The branch for this release is release/4.2.1 ([fws-api](https://github.com/DEFRA/fws-api/) repository)

## FWIS App Tag
The tag for this release is 5.1.1 ([fws-app](https://github.com/DEFRA/fws-app/) repository).

## Tickets

Tickets linked to the release in Jira: [https://eaflood.atlassian.net/projects/NI/versions/48101/tab/release-report-all-issues](https://eaflood.atlassian.net/projects/NI/versions/48101/tab/release-report-all-issues)

## Instructions


Steps
1. Disable LFW_{STAGE}_06_SMOKE_TESTS temporarily to ensure that smoke tests do not run until the new deploment of fws-app has become operational

2. Execute FWS_{stage}_02_DEPLOY_FWS_API

    Ensure build parameters are set as follows:
   - TERRAGRUNT_BRANCH:  master
   - TERRAFORM_BRANCH:  terraform-main
   - FWS_CONFIG_BRANCH:  master
   - MODULE_DEPLOY: lambda

3. Execute FWS_{stage}_03_DEPLOY_FWS_APPLICATION_1

   - TERRAGRUNT_BRANCH:  master
   - TERRAFORM_BRANCH:  terraform-main

   Tag to deploy is 5.1.1

4. Wait for 60 seconds

5. Enable LFW_{STAGE}_06_SMOKE_TESTS

6. Execute FWS_{stage}_06_FWIS_SMOKE_TESTS

Confirm deployment with the flood dev and test team.
