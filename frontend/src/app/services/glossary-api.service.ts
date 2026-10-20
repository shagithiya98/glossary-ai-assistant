import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  GlossaryTerm,
  TranslateTermRequest,
  TranslateTermResponse,
  SimilarTermMatch,
} from '../models/glossary-term.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlossaryApiService {
  // Base URL is environment-driven so the same build can point at
  // localhost during development and the deployed EC2 host in production.
  private readonly baseUrl = `${environment.apiBaseUrl}/api/glossary`;

  constructor(private http: HttpClient) {}

  // GET /api/glossary/terms
  getAllTerms(): Observable<GlossaryTerm[]> {
    return this.http
      .get<GlossaryTerm[]>(`${this.baseUrl}/terms`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // GET /api/glossary/terms/{id}
  getTermById(id: number): Observable<GlossaryTerm> {
    return this.http
      .get<GlossaryTerm>(`${this.baseUrl}/terms/${id}`)
      .pipe(catchError(this.handleError));
  }

  // POST /api/glossary/terms/translate
  translateNewTerm(request: TranslateTermRequest): Observable<TranslateTermResponse> {
    return this.http
      .post<TranslateTermResponse>(`${this.baseUrl}/terms/translate`, request)
      .pipe(catchError(this.handleError));
  }

  // GET /api/glossary/terms/{englishTerm}/similar
  checkSimilarTerms(englishTerm: string): Observable<SimilarTermMatch[]> {
    return this.http
      .get<SimilarTermMatch[]>(
        `${this.baseUrl}/terms/${encodeURIComponent(englishTerm)}/similar`
      )
      .pipe(catchError(this.handleError));
  }

  // PUT /api/glossary/terms/{id}/approve
  approveTerm(id: number): Observable<GlossaryTerm> {
    return this.http
      .put<GlossaryTerm>(`${this.baseUrl}/terms/${id}/approve`, {})
      .pipe(catchError(this.handleError));
  }

  // DELETE /api/glossary/terms/{id}
  deleteTerm(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/terms/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Centralized error handling: distinguishes a client-side/network error
  // from the backend returning a non-2xx status, and surfaces a message
  // components can show directly in the UI rather than a raw stack trace.
  private handleError(error: HttpErrorResponse) {
    let message = 'Something went wrong. Please try again.';
    if (error.error instanceof ErrorEvent) {
      message = `Network error: ${error.error.message}`;
    } else if (error.status === 0) {
      message = 'Cannot reach the server. Is the backend running?';
    } else if (error.status === 400) {
      message = 'Invalid request. Please check the term and try again.';
    } else if (error.status === 404) {
      message = 'That term could not be found.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again shortly.';
    }
    return throwError(() => new Error(message));
  }
}
