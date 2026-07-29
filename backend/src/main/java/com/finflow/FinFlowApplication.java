package com.finflow;

import com.finflow.modules.auth.config.SessionProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableConfigurationProperties({SessionProperties.class})
public class FinFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinFlowApplication.class, args);
    }
}
