import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlossaryApiService } from '../../services/glossary-api.service';
import { GlossaryTerm } from '../../models/glossary-term.model';

@Component({
  selector: 'app-term-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './term-list.component.html',
  styleUrl: './term-list.component.css',
})
export class TermListComponent implements OnInit {
  terms: GlossaryTerm[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  searchText = '';
  statusFilter: 'ALL' | 'AI_SUGGESTED' | 'HUMAN_APPROVED' = 'ALL';

  constructor(private api: GlossaryApiService) {}

  ngOnInit(): void {
    this.loadTerms();
  }

  loadTerms(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.api.getAllTerms().subscribe({
      next: (terms) => {
        this.terms = terms;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
    });
  }

  approve(term: GlossaryTerm): void {
    this.api.approveTerm(term.id).subscribe({
      next: (updated) => {
        // Update in place rather than re-fetching the whole list.
        const idx = this.terms.findIndex((t) => t.id === updated.id);
        if (idx !== -1) this.terms[idx] = updated;
      },
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  remove(term: GlossaryTerm): void {
    if (!confirm(`Delete "${term.englishTerm}"?`)) return;
    this.api.deleteTerm(term.id).subscribe({
      next: () => {
        this.terms = this.terms.filter((t) => t.id !== term.id);
      },
      error: (err: Error) => (this.errorMessage = err.message),
    });
  }

  // ── coverage matrix ────────────────────────────────────────────

  /**
   * Every language code seen across all terms, in a stable order.
   * Built from the whole list, not just the first term, so a term
   * that is missing a language still gets a column for it.
   */
  get languages(): string[] {
    const codes = new Set<string>();
    for (const term of this.terms) {
      for (const code of Object.keys(term.translations ?? {})) {
        codes.add(code);
      }
    }
    return [...codes].sort();
  }

  get languageCount(): number {
    return this.languages.length;
  }

  /** Empty cells across the whole matrix — the work still to do. */
  get missingCount(): number {
    const total = this.terms.length * this.languageCount;
    const filled = this.terms.reduce(
      (sum, term) => sum + this.translatedCount(term),
      0
    );
    return Math.max(total - filled, 0);
  }

  hasTranslation(term: GlossaryTerm, code: string): boolean {
    const value = (term.translations as Record<string, string> | undefined)?.[code];
    return typeof value === 'string' && value.trim().length > 0;
  }

  translatedCount(term: GlossaryTerm): number {
    return this.languages.filter((code) => this.hasTranslation(term, code)).length;
  }

  // ── counts and filtering ───────────────────────────────────────

  get approvedCount(): number {
    return this.terms.filter((t) => t.status === 'HUMAN_APPROVED').length;
  }

  get pendingCount(): number {
    return this.terms.filter((t) => t.status !== 'HUMAN_APPROVED').length;
  }

  get visibleTerms(): GlossaryTerm[] {
    const q = this.searchText.trim().toLowerCase();
    return this.terms.filter((t) => {
      const matchesText =
        !q ||
        t.englishTerm.toLowerCase().includes(q) ||
        (t.definition ?? '').toLowerCase().includes(q);
      const matchesStatus =
        this.statusFilter === 'ALL' ||
        (this.statusFilter === 'HUMAN_APPROVED'
          ? t.status === 'HUMAN_APPROVED'
          : t.status !== 'HUMAN_APPROVED');
      return matchesText && matchesStatus;
    });
  }
}
