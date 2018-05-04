package io.radanalytics.equoid.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.fabric8.openshift.api.model.DeploymentConfig;
import io.fabric8.openshift.client.DefaultOpenShiftClient;
import io.fabric8.openshift.client.OpenShiftClient;
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

import java.util.Collections;
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

    private final OpenShiftClient osClient = new DefaultOpenShiftClient();

    public HandlerResource() {
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
        deployNewHandler(handler.getSeconds());
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(handler));
//        Handler result = handlerRepository.save(handler);
//        return ResponseEntity.created(new URI("/api/handlers/" + result.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
//            .body(result);
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
        log.debug("REST request to update Handler (doing nothing) : {}", handler);
        if (handler.getId() == null) {
            return createHandler(handler);
        }
//        Handler result = handlerRepository.save(handler);
//        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, handler.getId().toString()))
//            .body(result);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(handler));
    }

    /**
     * GET  /handlers : get all the handlers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of handlers in body
     */
    @GetMapping("/handlers")
    @Timed
    public List<Handler> getAllHandlers() {
        log.debug("REST request to get all Handlers (doing nothing)");
        return Collections.emptyList();
//        return handlerRepository.findAll();
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
        log.debug("REST request to get Handler (doing nothing) : {}", id);
//        Handler handler = handlerRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(null));
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
        log.debug("REST request to delete Handler (doing nothing) : {}", id);
//        handlerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }


    private void deployNewHandler(int seconds) {
        if (seconds < 3) {
            log.error("for new handler use the interval at least 3 seconds");
            return;
        }
        DeploymentConfig oldDc = findSomeExistingHandler();
        DeploymentConfig newDc = customizeDc(oldDc, String.valueOf(seconds));
        log.info("creating new resource:\n\n" + newDc.toString() + "\n\n");
        osClient.resource(newDc).createOrReplace();
    }

    private DeploymentConfig findSomeExistingHandler() {
        DeploymentConfig deploymentConfig = osClient.deploymentConfigs()
            .list()
            .getItems()
            .stream()
            .filter(dc -> dc.getMetadata().getName().startsWith("equoid-data-handler-"))
            .findFirst()
            .orElse(null);
        return deploymentConfig;
    }

    private DeploymentConfig customizeDc(DeploymentConfig deploymentConfig, String seconds) {
        String newName = "equoid-data-handler-" + seconds;
        deploymentConfig.getMetadata().setResourceVersion(null);
        deploymentConfig.getMetadata().setUid(null);
        deploymentConfig.getMetadata().getLabels().put("app", newName);
        deploymentConfig.getMetadata().getLabels().put("resourceVersion", null);
        deploymentConfig.getMetadata().setName(newName);
        deploymentConfig.getSpec().setReplicas(1);
        deploymentConfig.getSpec().getSelector().put("app", newName);
        deploymentConfig.getSpec().getSelector().put("deploymentconfig", newName);
        deploymentConfig.getSpec().getTemplate().getMetadata().getLabels().put("app", newName);
        deploymentConfig.getSpec().getTemplate().getMetadata().getLabels().put("deploymentconfig", newName);
        deploymentConfig.getSpec().getTemplate().getSpec().getContainers().iterator().next().getEnv()
            .stream().forEach(env -> {
            if ("WINDOW_SECONDS".equals(env.getName()) || "SLIDE_SECONDS".equals(env.getName())) {
                env.setValue(seconds);
            }
        });
        deploymentConfig.setStatus(null);
        return deploymentConfig;
    }
}
