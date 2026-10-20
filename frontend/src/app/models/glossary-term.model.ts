// Mirrors com.shagithiya.glossaryai.model.GlossaryTerm
export interface GlossaryTerm {
  id: number;
  englishTerm: string;
  definition: string;
  translations: { [languageCode: string]: string };
  status: string; // e.g. "AI_SUGGESTED" | "APPROVED"
  createdAt: string;
  updatedAt: string | null;
}

// Mirrors com.shagithiya.glossaryai.dto.TranslateTermRequest
export interface TranslateTermRequest {
  englishTerm: string;
  definition?: string;
}

// Mirrors com.shagithiya.glossaryai.dto.SimilarTermMatch
export interface SimilarTermMatch {
  existingTerm: string;
  similarityScore: number;
  reason: string;
}

// Mirrors the POST /api/glossary/terms/translate response shape:
// Map.of("term", savedTerm, "similarTermWarnings", similarTerms)
export interface TranslateTermResponse {
  term: GlossaryTerm;
  similarTermWarnings: SimilarTermMatch[];
}
