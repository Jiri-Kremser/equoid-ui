package io.radanalytics.equoid;

import io.fabric8.kubernetes.api.model.ServiceList;
import io.fabric8.openshift.api.model.DeploymentConfig;
import io.fabric8.openshift.client.DefaultOpenShiftClient;
import io.fabric8.openshift.client.OpenShiftClient;
import io.radanalytics.equoid.config.ApplicationProperties;
import io.radanalytics.equoid.config.DefaultProfileUtil;

import io.github.jhipster.config.JHipsterConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.*;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

@ComponentScan
@EnableAutoConfiguration(exclude = {MetricFilterAutoConfiguration.class, MetricRepositoryAutoConfiguration.class})
@EnableConfigurationProperties({LiquibaseProperties.class, ApplicationProperties.class})
public class EquoidApp {

    private static final Logger log = LoggerFactory.getLogger(EquoidApp.class);

    private final Environment env;

    public EquoidApp(Environment env) {
        this.env = env;
    }

    /**
     * Initializes equoid.
     * <p>
     * Spring profiles can be configured with a program arguments --spring.profiles.active=your-active-profile
     * <p>
     * You can find more information on how profiles work with JHipster on <a href="http://www.jhipster.tech/profiles/">http://www.jhipster.tech/profiles/</a>.
     */
    @PostConstruct
    public void initApplication() {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) && activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)) {
            log.error("You have misconfigured your application! It should not run " +
                "with both the 'dev' and 'prod' profiles at the same time.");
        }
        if (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) && activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_CLOUD)) {
            log.error("You have misconfigured your application! It should not " +
                "run with both the 'dev' and 'cloud' profiles at the same time.");
        }
    }

    /**
     * Main method, used to run the application.
     *
     * @param args the command line arguments
     * @throws UnknownHostException if the local host name could not be resolved into an address
     */
    public static void main(String[] args) throws UnknownHostException {
        SpringApplication app = new SpringApplication(EquoidApp.class);
        DefaultProfileUtil.addDefaultProfile(app);
        Environment env = app.run(args).getEnvironment();
        String protocol = "http";
        if (env.getProperty("server.ssl.key-store") != null) {
            protocol = "https";
        }
        log.info("\n\n----------------------------------------------------------\n\t" +
                "Application '{}' is running! Access URLs:\n\t" +
                "Local: \t\t{}://localhost:{}\n\t" +
                "External: \t{}://{}:{}\n\t" +
                "Keycloak: \thttp://{}\n\t" +
                "Infinispan: \thttp://{}\n\t" +
                "Publisher: \thttp://{}\n\t" +
                "Profile(s): \t{}\n----------------------------------------------------------\n",
            env.getProperty("spring.application.name"),
            protocol,
            env.getProperty("server.port"),
            protocol,
            InetAddress.getLocalHost().getHostAddress(),
            env.getProperty("server.port"),
            env.getProperty("application.keycloak"),
            env.getProperty("application.infinispan"),
            env.getProperty("application.publisher"),
            env.getActiveProfiles());

        OpenShiftClient osClient = new DefaultOpenShiftClient();
        DeploymentConfig deploymentConfig = osClient.deploymentConfigs()
            .list()
            .getItems()
            .stream()
            .filter(dc -> dc.getMetadata().getName().startsWith("equoid-data-handler-90"))
            .findFirst()
            .orElse(null);

        DeploymentConfig newDc = customizeDc(deploymentConfig, "127");
        log.info(newDc.toString());
        osClient.resource(newDc).createOrReplace();


//        osClient.resource(deploymentConfig.).createOrReplace();
//        log.info(myServices.toString());

    }

    private static DeploymentConfig customizeDc(DeploymentConfig deploymentConfig, String seconds) {
        String newName = "equoid-data-handler-" + seconds;
        deploymentConfig.getMetadata().setResourceVersion(null);
        deploymentConfig.getMetadata().setUid(null);
        deploymentConfig.getMetadata().getLabels().put("app", newName);
        deploymentConfig.getMetadata().getLabels().put("resourceVersion", null);
        deploymentConfig.getMetadata().setName(newName);
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
//        deploymentConfig.getSpec().setTriggers(Collections.emptyList());
        return deploymentConfig;
    }
}
