package io.radanalytics.equoid.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.radanalytics.equoid.domain.Handler;

import io.radanalytics.equoid.repository.HandlerRepository;
import io.radanalytics.equoid.web.rest.errors.BadRequestAlertException;
import io.radanalytics.equoid.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Handler.
 */
@RestController
@RequestMapping("/api")
public class HandlerResource {

    private final Logger log = LoggerFactory.getLogger(HandlerResource.class);

    private static final String ENTITY_NAME = "handler";

    private final HandlerRepository handlerRepository;

    public HandlerResource(HandlerRepository handlerRepository) {
        this.handlerRepository = handlerRepository;
    }

    /**
     * POST  /handlers : Create a new handler.
     *
     * @param handler the handler to create
     * @return the ResponseEntity with status 201 (Created) and with body the new handler, or with status 400 (Bad Request) if the handler has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/handlers")
    @Timed
    public ResponseEntity<Handler> createHandler(@Valid @RequestBody Handler handler) throws URISyntaxException {
        log.debug("REST request to save Handler : {}", handler);
        if (handler.getId() != null) {
            throw new BadRequestAlertException("A new handler cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Handler result = handlerRepository.save(handler);
        return ResponseEntity.created(new URI("/api/handlers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /handlers : Updates an existing handler.
     *
     * @param handler the handler to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated handler,
     * or with status 400 (Bad Request) if the handler is not valid,
     * or with status 500 (Internal Server Error) if the handler couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/handlers")
    @Timed
    public ResponseEntity<Handler> updateHandler(@Valid @RequestBody Handler handler) throws URISyntaxException {
        log.debug("REST request to update Handler : {}", handler);
        if (handler.getId() == null) {
            return createHandler(handler);
        }
        Handler result = handlerRepository.save(handler);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, handler.getId().toString()))
            .body(result);
    }

    /**
     * GET  /handlers : get all the handlers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of handlers in body
     */
    @GetMapping("/handlers")
    @Timed
    public List<Handler> getAllHandlers() {
        log.debug("REST request to get all Handlers");
        return handlerRepository.findAll();
        }

    /**
     * GET  /handlers/:id : get the "id" handler.
     *
     * @param id the id of the handler to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the handler, or with status 404 (Not Found)
     */
    @GetMapping("/handlers/{id}")
    @Timed
    public ResponseEntity<Handler> getHandler(@PathVariable Long id) {
        log.debug("REST request to get Handler : {}", id);
        Handler handler = handlerRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(handler));
    }

    /**
     * DELETE  /handlers/:id : delete the "id" handler.
     *
     * @param id the id of the handler to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/handlers/{id}")
    @Timed
    public ResponseEntity<Void> deleteHandler(@PathVariable Long id) {
        log.debug("REST request to delete Handler : {}", id);
        handlerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
