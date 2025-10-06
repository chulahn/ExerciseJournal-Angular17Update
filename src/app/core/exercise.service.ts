// src/app/core/exercise.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';

export interface ExerciseEntry {
  id: string;
  date: string;
  type: string;
  duration: number;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private key = 'ej.entries';
  entries = signal<ExerciseEntry[]>([]);

  constructor() {
    // Only touch localStorage in the browser
    if (this.isBrowser) {
      const json = window.localStorage.getItem(this.key);
      if (json) this.entries.set(JSON.parse(json));
    }
  }

  private persist() {
    if (this.isBrowser) {
      window.localStorage.setItem(this.key, JSON.stringify(this.entries()));
    }
  }

  list(): Observable<ExerciseEntry[]> {
    return of(this.entries()).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  add(e: Omit<ExerciseEntry, 'id'>) {
    const entry: ExerciseEntry = { id: crypto.randomUUID(), ...e };
    this.entries.update(xs => [entry, ...xs]);
    this.persist();
  }

  update(id: string, patch: Partial<ExerciseEntry>) {
    this.entries.update(xs => xs.map(x => x.id === id ? { ...x, ...patch } : x));
    this.persist();
  }

  remove(id: string) {
    this.entries.update(xs => xs.filter(x => x.id !== id));
    this.persist();
  }

  byId(id: string) {
    return this.entries().find(x => x.id === id) ?? null;
  }
}