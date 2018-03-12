package io.radanalytics.equoid.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Equoid.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private String keycloak;

    public String getKeycloak() {
        return keycloak;
    }

    public void setKeycloak(String keycloak) {
        this.keycloak = keycloak;
    }

    private String infinispan;

    public String getInfinispan() {
        return infinispan;
    }

    public void setInfinispan(String infinispan) {
        this.infinispan = infinispan;
    }

}
