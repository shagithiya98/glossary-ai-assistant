package com.shagithiya.glossaryai.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shagithiya.glossaryai.document.GlossaryTermDoc;
import com.shagithiya.glossaryai.document.GlossaryTermService;

@RestController
@RequestMapping("/api/glossary/terms")
public class GlossaryTermController {

    private final GlossaryTermService service;

    public GlossaryTermController(GlossaryTermService service) {
        this.service = service;
    }

    @PostMapping
    public GlossaryTermDoc create(@RequestBody GlossaryTermDoc doc) {
        return service.save(doc);
    }
}