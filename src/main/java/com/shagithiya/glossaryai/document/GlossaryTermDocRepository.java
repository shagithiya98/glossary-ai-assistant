package com.shagithiya.glossaryai.document;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlossaryTermDocRepository extends MongoRepository<GlossaryTermDoc, String> {

    Optional<GlossaryTermDoc> findByTerm(String term);

    List<GlossaryTermDoc> findByStatus(String status);

    List<GlossaryTermDoc> findByTermContainingIgnoreCase(String fragment);

    long countByStatus(String status);
}