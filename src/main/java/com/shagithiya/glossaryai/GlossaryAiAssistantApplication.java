package com.shagithiya.glossaryai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching 
public class GlossaryAiAssistantApplication {

    public static void main(String[] args) {
        SpringApplication.run(GlossaryAiAssistantApplication.class, args);
    }

}
