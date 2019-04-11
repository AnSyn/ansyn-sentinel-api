#!/bin/bash

version=$(git log -n1 --format=format:"%H")
target='ansyn-sentinel-api'
services='ansyn-sentinel-api-service'
cluster='ansyn-webiks'

sh -x scripts/build.sh ansyn $version && \
sh -x scripts/deploy.sh $target $version $cluster $services

docker rmi -f $(docker images --format "{{.Repository}}:{{.Tag}}" | grep "$target")
