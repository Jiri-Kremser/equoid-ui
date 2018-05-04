package io.radanalytics.equoid.web.rest;

import io.radanalytics.equoid.EquoidApp;

import io.radanalytics.equoid.domain.Handler;
import io.radanalytics.equoid.repository.HandlerRepository;
import io.radanalytics.equoid.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static io.radanalytics.equoid.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the HandlerResource REST controller.
 *
 * @see HandlerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = EquoidApp.class)
public class HandlerResourceIntTest {

    private static final Integer DEFAULT_SECONDS = 0;
    private static final Integer UPDATED_SECONDS = 1;

    @Autowired
    private HandlerRepository handlerRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restHandlerMockMvc;

    private Handler handler;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final HandlerResource handlerResource = new HandlerResource();
        this.restHandlerMockMvc = MockMvcBuilders.standaloneSetup(handlerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Handler createEntity(EntityManager em) {
        Handler handler = new Handler()
            .seconds(DEFAULT_SECONDS);
        return handler;
    }

    @Before
    public void initTest() {
        handler = createEntity(em);
    }

    @Test
    @Transactional
    public void createHandler() throws Exception {
        int databaseSizeBeforeCreate = handlerRepository.findAll().size();

        // Create the Handler
        restHandlerMockMvc.perform(post("/api/handlers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(handler)))
            .andExpect(status().isCreated());

        // Validate the Handler in the database
        List<Handler> handlerList = handlerRepository.findAll();
        assertThat(handlerList).hasSize(databaseSizeBeforeCreate + 1);
        Handler testHandler = handlerList.get(handlerList.size() - 1);
        assertThat(testHandler.getSeconds()).isEqualTo(DEFAULT_SECONDS);
    }

    @Test
    @Transactional
    public void createHandlerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = handlerRepository.findAll().size();

        // Create the Handler with an existing ID
        handler.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHandlerMockMvc.perform(post("/api/handlers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(handler)))
            .andExpect(status().isBadRequest());

        // Validate the Handler in the database
        List<Handler> handlerList = handlerRepository.findAll();
        assertThat(handlerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkSecondsIsRequired() throws Exception {
        int databaseSizeBeforeTest = handlerRepository.findAll().size();
        // set the field null
        handler.setSeconds(null);

        // Create the Handler, which fails.

        restHandlerMockMvc.perform(post("/api/handlers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(handler)))
            .andExpect(status().isBadRequest());

        List<Handler> handlerList = handlerRepository.findAll();
        assertThat(handlerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllHandlers() throws Exception {
        // Initialize the database
        handlerRepository.saveAndFlush(handler);

        // Get all the handlerList
        restHandlerMockMvc.perform(get("/api/handlers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(handler.getId().intValue())))
            .andExpect(jsonPath("$.[*].seconds").value(hasItem(DEFAULT_SECONDS)));
    }

    @Test
    @Transactional
    public void getHandler() throws Exception {
        // Initialize the database
        handlerRepository.saveAndFlush(handler);

        // Get the handler
        restHandlerMockMvc.perform(get("/api/handlers/{id}", handler.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(handler.getId().intValue()))
            .andExpect(jsonPath("$.seconds").value(DEFAULT_SECONDS));
    }

    @Test
    @Transactional
    public void getNonExistingHandler() throws Exception {
        // Get the handler
        restHandlerMockMvc.perform(get("/api/handlers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHandler() throws Exception {
        // Initialize the database
        handlerRepository.saveAndFlush(handler);
        int databaseSizeBeforeUpdate = handlerRepository.findAll().size();

        // Update the handler
        Handler updatedHandler = handlerRepository.findOne(handler.getId());
        // Disconnect from session so that the updates on updatedHandler are not directly saved in db
        em.detach(updatedHandler);
        updatedHandler
            .seconds(UPDATED_SECONDS);

        restHandlerMockMvc.perform(put("/api/handlers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedHandler)))
            .andExpect(status().isOk());

        // Validate the Handler in the database
        List<Handler> handlerList = handlerRepository.findAll();
        assertThat(handlerList).hasSize(databaseSizeBeforeUpdate);
        Handler testHandler = handlerList.get(handlerList.size() - 1);
        assertThat(testHandler.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    public void updateNonExistingHandler() throws Exception {
        int databaseSizeBeforeUpdate = handlerRepository.findAll().size();

        // Create the Handler

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restHandlerMockMvc.perform(put("/api/handlers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(handler)))
            .andExpect(status().isCreated());

        // Validate the Handler in the database
        List<Handler> handlerList = handlerRepository.findAll();
        assertThat(handlerList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteHandler() throws Exception {
        // Initialize the database
        handlerRepository.saveAndFlush(handler);
        int databaseSizeBeforeDelete = handlerRepository.findAll().size();

        // Get the handler
        restHandlerMockMvc.perform(delete("/api/handlers/{id}", handler.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Handler> handlerList = handlerRepository.findAll();
        assertThat(handlerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Handler.class);
        Handler handler1 = new Handler();
        handler1.setId(1L);
        Handler handler2 = new Handler();
        handler2.setId(handler1.getId());
        assertThat(handler1).isEqualTo(handler2);
        handler2.setId(2L);
        assertThat(handler1).isNotEqualTo(handler2);
        handler1.setId(null);
        assertThat(handler1).isNotEqualTo(handler2);
    }
}
