package com.shagithiya.glossaryai.document;

import java.util.List;

import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

@Service
public class GlossaryStatsService {

    private final MongoTemplate mongoTemplate;

    public GlossaryStatsService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    // simple: count terms by status
    @Cacheable("termStats")
    public List<Document> countByStatus() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.group("status").count().as("count"),
            Aggregation.sort(Sort.Direction.DESC, "count")
        );
        AggregationResults<Document> results =
            mongoTemplate.aggregate(agg, "glossary_terms", Document.class);
        return results.getMappedResults();
    }

    // the unwind pipeline: coverage by language
    public List<Document> coverageByLanguage() {
        List<Document> stages = List.of(
            new Document("$project",
                new Document("langs", new Document("$objectToArray", "$translations"))),
            new Document("$unwind", "$langs"),
            new Document("$group", new Document("_id", "$langs.k")
                .append("termCount", new Document("$sum", 1))),
            new Document("$sort", new Document("termCount", -1))
        );
        return mongoTemplate.getCollection("glossary_terms")
                            .aggregate(stages)
                            .into(new java.util.ArrayList<>());
    }
}