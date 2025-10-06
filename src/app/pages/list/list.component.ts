import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExerciseService, ExerciseEntry } from '../../core/exercise.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <header class="toolbar">
      <form [formGroup]="filterForm" class="filters">
        <input formControlName="q" placeholder="Filter type/notes…" />
        <select formControlName="sort">
          <option value="date-desc">Newest</option>
          <option value="date-asc">Oldest</option>
          <option value="duration-desc">Longest</option>
          <option value="duration-asc">Shortest</option>
        </select>
      </form>
      <a routerLink="/edit/new" class="btn">+ Add Entry</a>
    </header>

    <section *ngIf="filtered().length; else empty">
      <div *ngFor="let e of filtered(); trackBy: trackId" class="card">
        <div>
          <b>{{ e.type }}</b> — {{ e.duration }} min
          <small>{{ e.date | date:'mediumDate' }}</small>
          <div *ngIf="e.notes">{{ e.notes }}</div>
        </div>
        <div class="actions">
          <a [routerLink]="['/edit', e.id]">Edit</a>
          <button (click)="remove(e.id)">Delete</button>
        </div>
      </div>
    </section>
    <ng-template #empty>No entries yet.</ng-template>
  `,
  styles: [`.toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin:1rem 0}
  .filters{display:flex;gap:.5rem}.card{display:flex;justify-content:space-between;align-items:center;border:1px solid #ddd;border-radius:12px;padding:.75rem 1rem;margin:.5rem 0}
  .btn{background:#1554b3;color:#fff;padding:.5rem .75rem;border-radius:8px;text-decoration:none}.actions{display:flex;gap:.75rem}`]
})
export class ListComponent {
  private fb = inject(FormBuilder);
  private svc = inject(ExerciseService);
  private router = inject(Router);

  entries = signal<ExerciseEntry[]>([]);
  filterForm = this.fb.group({ q: [''], sort: ['date-desc'] });
    filter = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    { initialValue: this.filterForm.value } // safety for first run
    );

    // filtered is READ-ONLY and derived from entries() + filter()
    filtered = computed(() => this.apply(this.entries(), this.filter()));
    constructor() {
        this.svc.list().subscribe(this.entries.set);
        // recompute whenever inputs change
        this.filtered = computed(() => this.apply(this.entries(), this.filterForm.value));
    }
    
  apply(entries: ExerciseEntry[], { q, sort }: any) {
    const term = (q ?? '').toLowerCase().trim();
    let arr = !term ? entries : entries.filter(e =>
      e.type.toLowerCase().includes(term) || (e.notes ?? '').toLowerCase().includes(term));
    switch (sort) {
      case 'date-asc': arr = [...arr].sort((a,b)=>a.date.localeCompare(b.date)); break;
      case 'duration-desc': arr = [...arr].sort((a,b)=>b.duration-a.duration); break;
      case 'duration-asc': arr = [...arr].sort((a,b)=>a.duration-b.duration); break;
      default: arr = [...arr].sort((a,b)=>b.date.localeCompare(a.date)); // date-desc
    }
    return arr;
  }

  trackId = (_: number, e: ExerciseEntry) => e.id;
  remove(id: string) { this.svc.remove(id); }
}
