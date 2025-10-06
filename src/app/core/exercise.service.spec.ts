import { ExerciseService } from './exercise.service';

describe('ExerciseService', () => {
  let svc: ExerciseService;
  beforeEach(() => { localStorage.clear(); svc = new ExerciseService(); });

  it('adds, lists, removes', (done) => {
    const e = svc.add({ date:'2025-01-01', type:'Run', duration:20, notes:'' });
    svc.list().subscribe(xs => {
      expect(xs.length).toBe(1);
      svc.remove(xs[0].id);
      svc.list().subscribe(ys => { expect(ys.length).toBe(0); done(); });
    });
  });

  it('updates', (done) => {
    svc.add({ date:'2025-01-01', type:'Run', duration:20 });
    const id = svc.entries()[0].id;
    svc.update(id, { duration:45 });
    svc.list().subscribe(xs => { expect(xs[0].duration).toBe(45); done(); });
  });
});