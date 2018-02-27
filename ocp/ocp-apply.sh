#!/usr/bin/env sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


oc new-project equoid

# workaround for postgresql docker image that requires root
#oc login -u system:admin
#oc adm policy add-scc-to-user anyuid system:serviceaccount:equoid:equoid
#oc login -u developer


# Use this script to run oc commands to create resources in the selected namespace. Files are ordered
# in proper order. 'oc process' processes the template as resources which is again piped to
# 'oc apply' to create those resources in OpenShift namespace
#oc process -f $DIR/registry/scc-config.yml | oc apply -f -


# Prometheus and Grafana
oc process -f $DIR/monitoring/metrics.yml | oc apply -f -


# Keycloak SSO
# example realm json: https://github.com/kameshsampath/keycloak-demo-server/blob/master/src/main/resources/springboot-realm.json
oc secrets new kc-realm jhipster-realm.json=$DIR/../src/main/docker/realm-config/jhipster-realm.json
oc secrets new kc-users jhipster-users-0.json=$DIR/../src/main/docker/realm-config/jhipster-users-0.json
oc process -f $DIR/keycloak/keycloak.yml | oc apply -f -


# Finally, deploy the Equoid app
oc process -f $DIR/equoid/equoid-deployment.yml | oc apply -f -
