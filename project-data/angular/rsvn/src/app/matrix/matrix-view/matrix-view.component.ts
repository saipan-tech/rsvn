import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-matrix-view',
  templateUrl: './matrix-view.component.html',
  styleUrls: ['./matrix-view.component.scss']
})
export class MatrixViewComponent implements OnInit {
  @Input() currRsvnInfo:Observable<any> = of() 
  constructor(
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
  }

}
