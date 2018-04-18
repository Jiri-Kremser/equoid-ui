package io.radanalytics.equoid.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import io.radanalytics.equoid.domain.Item;
import io.radanalytics.equoid.repository.ItemRepository;
import io.radanalytics.equoid.web.rest.errors.BadRequestAlertException;
import io.radanalytics.equoid.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Publisher.
 */
@RestController
@RequestMapping("/api")
public class PublisherResource {

    private final Logger log = LoggerFactory.getLogger(PublisherResource.class);

    private static final String ENTITY_NAME = "frequent item";

    private final PublisherManager publisherManager;

    public PublisherResource(PublisherManager publisherManager) {
        this.publisherManager = publisherManager;
    }

    /**
     * POST  /publisher : Create a new frequent item.
     *
     * @param item the new frequent item to create
     * @return the ResponseEntity with status 201 (Created) and with body the new item, or with status 400 (Bad Request)
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/publisher")
    @Timed
    public ResponseEntity<String> createFrequentItem(@RequestBody String item) throws URISyntaxException {
        log.info("REST request to add new frequent item : {}", item);
        ResponseEntity<String> stringResponseEntity = publisherManager.addItem(item);
        HttpStatus statusCode = stringResponseEntity.getStatusCode();
        if (!statusCode.is2xxSuccessful()) {
            log.error("Error: " + stringResponseEntity.toString());
            return stringResponseEntity;
        }
        return ResponseEntity.created(new URI("/api/publisher/" + item))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, item))
            .body(stringResponseEntity.getBody());
    }
}
