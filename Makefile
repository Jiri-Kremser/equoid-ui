.PHONY: build clean push oc-run grafana-ds grafana-dashboard wait20 wait5 all os-deploy-keycloak os-add-service-account os-deploy-monitoring os-deploy-equoid


clean:
	./mvnw clean

build:
	./mvnw package -Pprod,prometheus,no-liquibase -DskipTests dockerfile:build

push:
	docker tag equoid:0.0.1 $(USER)/equoid
	docker push $(USER)/equoid

oc-run:
	-docker kill `docker ps -q` || true
	oc cluster up
	METRICS=1 ./ocp/ocp-apply.sh
	#./ocp/ocp-apply.sh

grafana-ds:
	curl -i -u admin:equoid \
     -H "Content-Type: application/json;charset=UTF-8" \
     -d '{"Name":"equoid-app","Type":"prometheus","Url":"http://equoid-prometheus:9090","Access":"proxy","basicAuth":false,"isDefault":true}' \
     --trace-ascii /dev/stdout \
     'http://'`oc get routes -l app=equoid-grafana --no-headers | awk '{printf $$2}'`'/api/datasources'

grafana-dashboard:
	curl -i -u admin:equoid -H "Content-Type: application/json;charset=UTF-8" \
     -d @grafana-dashboard.json --trace-ascii /dev/stdout \
     'http://'`oc get routes -l app=equoid-grafana --no-headers | awk '{printf $$2}'`'/api/dashboards/db'

os-deploy-keycloak:
	oc secrets new kc-realm jhipster-realm.json=./src/main/docker/realm-config/jhipster-realm.json
	oc secrets new kc-users jhipster-users-0.json=./src/main/docker/realm-config/jhipster-users-0.json
	oc process -f ./ocp/keycloak/keycloak.yml | oc apply -f -

os-add-service-account:
	oc new-project equoid
	oc login -u system:admin
	oc adm policy add-scc-to-user anyuid system:serviceaccount:equoid:equoid
	oc process -f ./ocp/registry/scc-config.yml | oc apply -f -
	oc login -u developer

os-deploy-monitoring:
	oc process -f ./ocp/monitoring/metrics.yml | oc apply -f -

os-deploy-equoid:
	oc process -f ./ocp/equoid/equoid-deployment.yml | oc apply -f -

wait20:
	sleep 20

wait5:
	sleep 5

all: clean build push oc-run

allall: all wait15 grafana-ds wait5 grafana-dashboard

kc-only: oc-run os-add-service-account os-deploy-keycloak
