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
}
