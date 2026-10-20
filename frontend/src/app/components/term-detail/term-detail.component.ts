import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GlossaryApiService } from '../../services/glossary-api.service';
import { GlossaryTerm } from '../../models/glossary-term.model';

@Component({
  selector: 'app-term-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './term-detail.component.html',
  styleUrl: './term-detail.component.css',
})
export class TermDetailComponent implements OnInit {
  term: GlossaryTerm | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private api: GlossaryApiService) {}

  ngOnInit(): void {
    // Route param is read once here via snapshot; if you later add
    // "next/previous term" navigation without leaving this component,
    // you'd switch to route.paramMap.subscribe(...) instead, since
    // Angular reuses the component instance across same-route navigations.
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!idParam || Number.isNaN(id)) {
      this.errorMessage = 'Invalid term id in URL.';
      this.isLoading = false;
      return;
    }

    this.api.getTermById(id).subscribe({
      next: (term) => {
        this.term = term;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
    });
  }
}
