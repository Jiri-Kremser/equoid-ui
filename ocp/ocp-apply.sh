#!/usr/bin/env sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
METRICS="${METRICS:-true}"

# Prometheus and Grafana
if [ "$METRICS" = true ] ; then
  oc process -f $DIR/monitoring/metrics.yml | oc apply -f -
fi

# Keycloak SSO
oc secrets new kc-realm jhipster-realm.json=$DIR/../src/main/docker/realm-config/jhipster-realm.json
oc secrets new kc-users jhipster-users-0.json=$DIR/../src/main/docker/realm-config/jhipster-users-0.json
oc process -f $DIR/keycloak/keycloak.yml | oc apply -f -

# Finally, deploy the Equoid app
oc process -f $DIR/equoid/equoid-deployment.yml | oc apply -f -
