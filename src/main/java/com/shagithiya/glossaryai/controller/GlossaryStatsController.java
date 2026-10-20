package com.shagithiya.glossaryai.controller;

import java.util.List;

import org.bson.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shagithiya.glossaryai.document.GlossaryStatsService;

@RestController
@RequestMapping("/api/glossary/stats")
public class GlossaryStatsController {

    private final GlossaryStatsService service;

    public GlossaryStatsController(GlossaryStatsService service) {
        this.service = service;
    }

    @GetMapping("/by-status")
    public List<Document> byStatus() {
        return service.countByStatus();
    }

    @GetMapping("/coverage")
    public List<Document> coverage() {
        return service.coverageByLanguage();
    }
}