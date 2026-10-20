package com.shagithiya.glossaryai.document;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class GlossaryTermService {

    private final GlossaryTermDocRepository repository;

    public GlossaryTermService(GlossaryTermDocRepository repository) {
        this.repository = repository;
    }

    @CacheEvict(value = "termStats", allEntries = true)
    public GlossaryTermDoc save(GlossaryTermDoc doc) {
        return repository.save(doc);
    }
}