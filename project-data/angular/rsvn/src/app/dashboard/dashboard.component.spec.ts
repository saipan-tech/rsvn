import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppEnv } from '@app/_helpers/appenv';
import { GenericService } from '@app/_services/generic.service';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';

describe('Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule ],
      providers: [
        GenericService,
        HttpClient,
        {
          provide: AppEnv,
          useValue: { WEB_API: 'http://foo.bar'}
        }
      ],
      declarations: [ DashboardComponent ],
    }).compileComponents();
  });

  beforeEach(()=> {
    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when rendered', ()=> {
    it('should display arrivals', ()=> {
      const actual = !!component.arrivals;
      const expected = true

      expect(actual).toEqual(expected);
    });

    it('should retrieve arrivals', ()=> {
      const genericService = TestBed.inject(GenericService)
      const getSpy = spyOn(genericService, 'getItemQueryList').and.returnValue(of([]));

      component.today = '1901-01-01'
      component.ngOnInit();

      expect(getSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalledWith('rsvn', 'future=1901-01-01')
    });
  })
});
