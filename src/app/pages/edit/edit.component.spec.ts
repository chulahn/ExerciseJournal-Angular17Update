import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EditComponent } from './edit.component';
import { ExerciseService } from '../../core/exercise.service';

describe('EditComponent', () => {
  it('saves a new entry', () => {
    const svc = new ExerciseService();
    const addSpy = spyOn(svc, 'add').and.callThrough();
    TestBed.configureTestingModule({
      imports: [EditComponent, RouterTestingModule],
      providers: [{ provide: ExerciseService, useValue: svc }]
    });
    const fixture = TestBed.createComponent(EditComponent);
    const comp = fixture.componentInstance;
    comp.form.patchValue({ date:'2025-01-01', type:'Run', duration:30 });
    comp.save();
    expect(addSpy).toHaveBeenCalled();
  });
});
