# THIS IS AN EXERCISE ONLY
# FWIS API and FWIS App Hot Fix Release - Tuesday 25th August 2026

## Information

This release will:
- update FWIS API secret keys
- update the FWIS API and FWIS App to remove compromised npm packages

## FWIS API Branch
The branch for this release is hotfix/worm-attack-exercise  ([fws-api](https://github.com/DEFRA/fws-api/) repository)

## FWIS App Tag
The tag for this release is hotfix-worm-attack-exercise-xxx-xxxxxxx ([fws-app](https://github.com/DEFRA/fws-app/) repository).

## FWIS Config (GitLab)

The branch for this release is hotfix/worm-exercise 

## FWIS App Tests

The branch for this release is  */hotfix/worm-attack-exercise ([fws-app-tests](https://github.com/DEFRA/fws-app-tests/) repository).

## Tickets

No tickets as emergency hotfix exercise.

## Instructions

- CCOE WebOps to update FWIS API secret keys as defined below
 
Steps
1. Execute FWS_{stage}_02_DEPLOY_FWS_API
 
    Ensure build parameters are set as follows:  
   - TERRAGRUNT_BRANCH:  master
   - TERRAFORM_BRANCH:  terraform-main
   - FWS_CONFIG_BRANCH: master
   - MODULE_DEPLOY: lambda

2. Configure FWS_{stage}_04_FWIS_API_TESTS
   
   - FWS_CONFIG_BRANCH: */master
   - FWS_TESTS_BRANCH: */master

3. Configure FWS_{stage}_05_FWIS_UI_TESTS
   
   - FWS_CONFIG_BRANCH: */master
   - FWS_APP_TESTS_BRANCH: */hotfix/worm-attack-exercise

4. Configure FWS_{stage}_06_FWIS_SMOKE_TESTS

    - FWS_CONFIG_BRANCH: */master
    - FWS_APP_TESTS_BRANCH: */hotfix/worm-attack-exercise

5. Configure FWS_{stage}_103_UPDATE_API_KEYS

    - FWS_CONFIG_BRANCH: */master

6. Execute FWS_{stage}_103_UPDATE_API_KEYS

7. Execute FWS_{stage}_03_DEPLOY_FWS_APPLICATION_1

   - TERRAGRUNT_BRANCH:  master
   - TERRAFORM_BRANCH:  terraform-main

   Tag to deploy the latest generated release candidate hotfix-worm-attack-exercise-xxx-xxxxxxx


Confirm deployment with the flood dev and test team.
