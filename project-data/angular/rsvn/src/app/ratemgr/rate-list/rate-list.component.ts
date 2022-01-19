import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { SeasonService } from '@app/_services/season.service';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IRate } from '@app/_interface/rate';
import { ISeason } from '@app/_interface/season';
import { concatMap, tap } from 'rxjs/operators';
import { Observable, concat, throwError } from 'rxjs';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private formBuilder: FormBuilder,
    private seasonService: SeasonService

  ) { }
  colorList: any
  currRate: IRate = {} as IRate
  rateList: any[] = []
  seasonList: ISeason[] = []
  seasonrateList: any[] = []

  rateEditForm = this.formBuilder.group({
    id: [''],
    alias: [''],
    rateCategory: ['', Validators.required],
    rateName: ['', Validators.required],
    rateType: ['', Validators.required],
    rateClass: ['', Validators.required],
    rack: ['', Validators.required],
    descr: [''],
    color: [''],
  })

  fixList: any = {}
  //=================================
  sortRates(rlist: any) {
    rlist.sort(function (a: any, b: any) {
      var A = a.alias.toUpperCase(); // ignore upper and lowercase
      var B = b.alias.toUpperCase(); // ignore upper and lowercase
      if (A < B) { return -1; }
      if (A > B) { return 1; }
      return 0;
    });
    return rlist
  }

  //=================================
  // == this is when we  read in the CSV file
  //=================================
  setResults(list: any[]) {
    let rate$: any = []
    list.forEach(rec => {
      const founder = this.rateList.find(d => d.rate.alias == rec.alias)
      // If it exists let's put the id in and only send the update to the rate
      if (founder) {
        rec.id = founder.rate.id
      }
      rate$.push(this.genericService.updateItem('rate', rec))
    })
    concat(...rate$)
      .subscribe(
        data => { },
        err => { },
        () => {
          this.ngOnInit()
        }



      )


  }
  //=================================
  clearRate() {

    this.rateEditForm.reset()
  }
  //=================================
  ngOnChanges(changes: SimpleChanges) {

  }
  //=================================
  blankRate(rate: any) {
    rate = {}
    rate.id = 0
    for (const field in rate) {
      if (rate[field] == null) {
        rate[field] = ''
      }
    }
  }


  //=================================
  updateRate(rate: any) {
    console.log(rate)
    this.genericService.updateItem('rate', rate).subscribe(
     data => {
       this.ngOnInit()
     }
    )
  }
  //=================================
  refresh() {
    this.ngOnInit()
  }
  //=================================
  ngOnInit(): void {
    let _rList: IRate[] = []
    this.rateList = []
    this.genericService.getItemList('season')
      .pipe(
        tap(d1 => this.seasonList = d1),
        concatMap((d1, d2) => this.genericService.getItemList('rate')),
        tap(d2 => {
          _rList = this.sortRates(d2)
          _rList.forEach(
            rl => {
              let rcalc: any = []
              this.seasonList.forEach(
                season => {
                  rcalc.push({ season: season.name, amount: rl.rack * season.discount })
                })
              this.rateList.push({ rate: rl, rcalc: rcalc })
            })
        })).subscribe()




    this.systemService.getDropdownList('color').subscribe(
      data => this.colorList = data
    )


  }
}
