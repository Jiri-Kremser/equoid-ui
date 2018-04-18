package io.radanalytics.equoid.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PublisherManager {

    private final Logger log = LoggerFactory.getLogger(PublisherManager.class);

    public ResponseEntity<String> addItem(String item) {
        RestTemplate restTemplate = new RestTemplate();
        log.debug("Adding new frequent item: " + item);
        ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity("http://equoid-data-publisher:8080/api", item, String.class);
        return stringResponseEntity;
    }

}
