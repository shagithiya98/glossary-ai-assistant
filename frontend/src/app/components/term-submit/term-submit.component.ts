import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlossaryApiService } from '../../services/glossary-api.service';
import { SimilarTermMatch, TranslateTermResponse } from '../../models/glossary-term.model';

@Component({
  selector: 'app-term-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './term-submit.component.html',
  styleUrl: './term-submit.component.css',
})
export class TermSubmitComponent {
  // Reactive form: englishTerm is required (mirrors the backend's
  // @NotBlank validation on TranslateTermRequest), definition is optional.
  termForm: FormGroup;

  isSubmitting = false;
  errorMessage: string | null = null;
  lastResult: TranslateTermResponse | null = null;
  similarWarnings: SimilarTermMatch[] = [];

  constructor(private fb: FormBuilder, private api: GlossaryApiService) {
    this.termForm = this.fb.group({
      englishTerm: ['', [Validators.required, Validators.minLength(2)]],
      definition: [''],
    });
  }

  get englishTerm() {
    return this.termForm.get('englishTerm');
  }

  onSubmit(): void {
    if (this.termForm.invalid) {
      this.termForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.lastResult = null;
    this.similarWarnings = [];

    this.api.translateNewTerm(this.termForm.value).subscribe({
      next: (response) => {
        this.lastResult = response;
        this.similarWarnings = response.similarTermWarnings ?? [];
        this.isSubmitting = false;
        this.termForm.reset();
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isSubmitting = false;
      },
    });
  }
}
