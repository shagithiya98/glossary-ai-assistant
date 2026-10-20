import { Routes } from '@angular/router';
import { TermSubmitComponent } from './components/term-submit/term-submit.component';
import { TermListComponent } from './components/term-list/term-list.component';
import { TermDetailComponent } from './components/term-detail/term-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'new-term', pathMatch: 'full' },
  { path: 'new-term', component: TermSubmitComponent },
  { path: 'terms', component: TermListComponent },
  { path: 'terms/:id', component: TermDetailComponent },
];
