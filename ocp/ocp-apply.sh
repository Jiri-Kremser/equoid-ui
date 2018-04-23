#!/bin/bash
set -x

DIR="${DIR:-$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )}"
BASE_URL="${BASE_URL:-$DIR}"
KC_REALM_PATH="${KC_REALM_PATH:-"$DIR/../src/main/docker/realm-config/"}"
METRICS="${METRICS:-"0"}"
LOCAL="${LOCAL:-0}"
TAG="${TAG:-latest}"

# Prometheus and Grafana
if [ "$METRICS" = "1" ] ; then
  oc process -f $BASE_URL/monitoring/metrics.yml | oc apply -f -
fi

if [ "$LOCAL" = "0" ] ; then
  # Keycloak SSO
  oc secrets new kc-realm jhipster-realm.json=$KC_REALM_PATH/jhipster-realm.json
  oc secrets new kc-users jhipster-users-0.json=$KC_REALM_PATH/jhipster-users-0.json
  oc process -f $BASE_URL/keycloak/keycloak.yml | oc apply -f -

  KC_ROUTE=`oc get routes -l app=equoid-keycloak --no-headers | awk '{print $2}'`
  PUBLISHER_URL="equoid-data-publisher:8080"
  echo "Equoid app will be using this keycloak instance: http://$KC_ROUTE"
else
  # let's assume KC running here
  KC_ROUTE="127.0.0.1:9080"
  PUBLISHER_URL=`oc get svc -l app=publisher --no-headers | awk '{print $2}'`":8080"
  echo "Running on local cluster"
fi

# deploy the web-ui
echo "KEYCLOAK_URL=$KC_ROUTE"
echo "PUBLISHER_URL=$PUBLISHER_URL"
oc process -f https://raw.githubusercontent.com/Jiri-Kremser/equoid-ui/master/ocp/equoid/equoid-deployment.yml \
  -p KEYCLOAK_URL=$KC_ROUTE \
  -p PUBLISHER_URL=$PUBLISHER_URL \
  -p TAG=$TAG \
  | oc apply -f -
