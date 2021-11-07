import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { SeasonService } from '@app/_services/season.service';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IRate } from '@app/_interface/rate';
import { ISeason } from '@app/_interface/season';
import { ISeasonRate } from '@app/_interface/seasonrate'

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

  fixList: any = {}

  rateEditForm = this.formBuilder.group({
    id: [''],
    alias: [''],
    rateCategory: ['', Validators.required],
    rateName: ['', Validators.required],
    rateType: ['', Validators.required],
    rateClass: ['', Validators.required],
    descr: [''],
    color: [''],
  })




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
    list.forEach(rec => {
      const founder = this.rateList.find(d => d.alias == rec.alias)
      // If it exists let's put the id ion and only send the update to the rate
      if (founder) {
        rec.id = founder.id
      }
      this.genericService.updateItem('rate', rec).subscribe(
        data => {
          // We check the season list and see if we have one listed
          this.seasonList.forEach(sl => {
            let seasonraterec = { id: 0, rate: data.id, season: sl.id, amount: rec[sl.name] }
            if (rec.id && rec[sl.name]) {
              // let's see if there is one already made
              const slrfind = this.seasonrateList.find(srl => srl.rate.id == rec.id && srl.season.name == sl.name)
              if (slrfind) {
                seasonraterec.id = slrfind.id
              }
              this.genericService.updateItem('seasonrate', seasonraterec)
                .subscribe()
            }
          }
          )
          this.ngOnInit()
        })
    })
  }
  //=================================
  ngOnChanges(changes: SimpleChanges) {

  }
  //=================================
  clearRate() {
    this.rateEditForm.reset()
    this.blankRate(this.currRate)
    this.ngOnInit()
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
  selectRate(rate: IRate) {
    if (rate.id) {
      let fnd = this.rateList.find(rl => rate.id == rl.id)
      this.rateEditForm.patchValue(fnd)
    }
  }
  //=================================
  updateSeasonRate(season: ISeason, rate: any) {
    // check if exist search on season_id and rate_id
    // run an update
    let seasonRate: ISeasonRate = {
      id: 0,
      rate: rate.id,
      season: season.id,
      amount: rate[season.name]
    }
    this.seasonService.getSeasonRate(`season=${season.id}&rate=${rate.id}`)
      .subscribe(data => {
        if (data.length) {
          seasonRate.id = data[0].id
        }
        this.genericService.updateItem("seasonrate", seasonRate)
          .subscribe(data2 => {
            this.clearRate()
          })
      })
  }
  //=================================
  updateRate(rate: any) {
    this.seasonList.forEach(s => {
      if (rate[s.name]) {
        this.updateSeasonRate(s, rate)
      }
    })

    this.genericService.updateItem('rate', rate).subscribe(
      data => {
        this.clearRate()
      }
    )
  }
  //=================================
  deleteRate(rate: any) {
    this.genericService.deleteItem('rate', rate).subscribe(
      data => {
        this.clearRate()

      }
    )
  }

  //=================================
  addSeasonRate() {
    this.rateList.forEach(rec => {
      rec['seasonList'] = []
      this.seasonList.forEach(
        sl => {
          let f = this.seasonrateList.find(srl => srl.rate == rec.id
            && srl.season == sl.id)
          if (f) {
            rec['seasonList'].push(f.amount)
            rec[sl.name] = f.amount
          }
          else {
            rec['seasonList'].push('')
            rec[sl.name] = ''
          }
        }
      )
    })
  }

  //=================================
  ngOnInit(): void {
    this.genericService.getItemList('season')
      .subscribe(
        data => {
          this.seasonList = data
          this.seasonList.forEach(sl => {
            this.rateEditForm.addControl(sl.name, new FormControl(''))

          })
        }
      )

    this.currRate = {} as IRate
    //=================================
    this.genericService.getItemList('rate')
      .subscribe(
        data => {
          this.rateList = this.sortRates(data)
          this.genericService.getItemList('seasonrate')
            .subscribe(
              data2 => {
                this.seasonrateList = data2
                this.addSeasonRate()

              }
            )
        }
      )
    this.systemService.getDropdownList('color').subscribe(
      data => this.colorList = data
    )


  }
}
