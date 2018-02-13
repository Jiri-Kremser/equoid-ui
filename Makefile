.PHONY: build clean push oc-run grafana-ds grafana-dashboard wait20 wait5 all


clean:
	./mvnw clean

build:
	./mvnw package -Pprod,prometheus,no-liquibase dockerfile:build

push:
	docker image tag equoid $(USER)/equoid
	docker push $(USER)/equoid

oc-run:
	-docker kill `docker ps -q` || true
	oc cluster up
	./ocp/ocp-apply.sh

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

wait20:
	sleep 20

wait5:
	sleep 5

all: clean build push oc-run wait20 grafana-ds wait5 grafana-dashboard
