#!/usr/bin/env sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


oc new-project equoid

# workaround for postgresql docker image that requires root
oc login -u system:admin
oc adm policy add-scc-to-user anyuid system:serviceaccount:equoid:equoid
oc login -u developer


# Use this script to run oc commands to create resources in the selected namespace. Files are ordered
# in proper order. 'oc process' processes the template as resources which is again piped to
# 'oc apply' to create those resources in OpenShift namespace
oc process -f ./ocp/registry/scc-config.yml | oc apply -f -


# Prometheus and Grafana
oc process -f ./ocp/monitoring/metrics.yml | oc apply -f -


# Keycloak SSO
oc secrets new kc-realm realm.json=$DIR/../src/main/docker/realm-config/jhipster-realm.json
oc secrets new kc-users users.json=$DIR/../src/main/docker/realm-config/jhipster-users-0.json
oc process -f ./ocp/keycloak/keycloak.yml | oc apply -f -


#oc process -f ./ocp/equoid/equoid-postgresql.yml | oc apply -f -

# Finally, deploy the Equoid app
oc process -f ./ocp/equoid/equoid-deployment.yml | oc apply -f -
