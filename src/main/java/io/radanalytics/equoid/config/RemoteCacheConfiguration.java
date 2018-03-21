package io.radanalytics.equoid.config;

import infinispan.autoconfigure.remote.InfinispanRemoteConfigurer;
import org.infinispan.client.hotrod.configuration.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@EnableCaching
public class RemoteCacheConfiguration {

    private final Logger log = LoggerFactory.getLogger(RemoteCacheConfiguration.class);

    @Bean
    public InfinispanRemoteConfigurer infinispanRemoteConfigurer(Environment env) {
        System.out.println("sdf");
        return () -> {
            String serverList = env.getProperty("infinispan.remote.server-list");
            if (serverList == null) {
                return new ConfigurationBuilder().build();
            } else
            return new ConfigurationBuilder()
                .addServers(env.getProperty("infinispan.remote.server-list"))
                .connectionTimeout(Integer.parseInt(env.getProperty("infinispan.remote.connect-timeout")))
                .socketTimeout(Integer.parseInt(env.getProperty("infinispan.remote.socket-timeout")))
                .maxRetries(Integer.parseInt(env.getProperty("infinispan.remote.max-retries")))
                .build();
        };
    }

}
