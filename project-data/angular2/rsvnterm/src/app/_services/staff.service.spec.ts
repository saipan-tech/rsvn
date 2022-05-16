import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import {StaffService} from "./staff.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppEnv} from "@app/_helpers/appenv";

describe('StaffService', () => {
  let service: StaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, HttpClientTestingModule ],
      providers: [ { provide: AppEnv, useValue: {} } ]
    });
    service = TestBed.inject(StaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
