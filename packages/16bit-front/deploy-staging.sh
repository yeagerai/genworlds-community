#!/bin/sh

# Push master to production branch to run the CI/CD pipeline for production deployment
git checkout master
git pull origin master
git push
git checkout staging
git pull origin staging
git pull origin master
git push --no-verify
git checkout master
