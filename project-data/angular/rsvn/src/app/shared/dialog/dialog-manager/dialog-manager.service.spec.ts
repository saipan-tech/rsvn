import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { DialogManagerService } from './dialog-manager.service';

describe('DialogManagerService', () => {
  let service: DialogManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
    });
    service = TestBed.inject(DialogManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
