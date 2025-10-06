import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExerciseService } from '../../core/exercise.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2>{{ isNew ? 'Add Entry' : 'Edit Entry' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <label>Date <input type="date" formControlName="date"></label>
      <label>Type <input type="text" formControlName="type" placeholder="Run, Lift…"></label>
      <label>Duration (min) <input type="number" formControlName="duration"></label>
      <label>Notes <textarea formControlName="notes"></textarea></label>
      <div class="actions">
        <button type="submit" [disabled]="form.invalid">Save</button>
        <a routerLink="/">Cancel</a>
      </div>
    </form>
  `,
  styles:[`.form{display:grid;gap:.75rem;max-width:480px}.actions{display:flex;gap:.75rem}`]
})
export class EditComponent {
  private fb = inject(FormBuilder);
  private svc = inject(ExerciseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isNew = true;
  form = this.fb.group({
    date: [new Date().toISOString().slice(0,10), Validators.required],
    type: ['', [Validators.required, Validators.maxLength(50)]],
    duration: [30, [Validators.required, Validators.min(1)]],
    notes: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      const e = this.svc.byId(id);
      if (e) { this.isNew = false; this.form.patchValue(e); }
    }
  }
  save() {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.isNew) this.svc.add(this.form.getRawValue() as any);
    else if (id) this.svc.update(id, this.form.getRawValue() as any);
    this.router.navigateByUrl('/');
  }
}