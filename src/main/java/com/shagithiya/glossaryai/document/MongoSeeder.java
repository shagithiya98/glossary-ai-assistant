package com.shagithiya.glossaryai.document;

import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MongoSeeder implements CommandLineRunner {

    private final GlossaryTermDocRepository repository;

    public MongoSeeder(GlossaryTermDocRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;      // only seed once

        GlossaryTermDoc claim = new GlossaryTermDoc();
        claim.setTerm("unemployment insurance claim");
        claim.setDefinition("A request for unemployment benefits.");
        claim.setStatus("HUMAN_APPROVED");
        claim.setTranslations(Map.of(
            "es", "reclamo de seguro de desempleo",
            "vi", "yêu cầu bảo hiểm thất nghiệp",
            "zh-CN", "失业保险申请"
        ));

        GlossaryTermDoc benefit = new GlossaryTermDoc();
        benefit.setTerm("disability benefit");
        benefit.setDefinition("Payment for a qualifying disability.");
        benefit.setStatus("AI_SUGGESTED");
        benefit.setTranslations(Map.of(
            "es", "beneficio por discapacidad",
            "ko", "장애 수당"
        ));

        repository.saveAll(java.util.List.of(claim, benefit));
        System.out.println("Seeded " + repository.count() + " Mongo documents");
    }
}