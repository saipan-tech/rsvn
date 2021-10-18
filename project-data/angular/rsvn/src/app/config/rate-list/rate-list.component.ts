import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService  

  ) { }
  colorList:any
  currRate: IRate = {} as IRate
  rateList : IRate[]  = [] 
  rateEditForm = new FormGroup({
    id: new FormControl(''),
    alias:new FormControl(''),
    rateCategory: new FormControl('', Validators.required),
    rateName : new FormControl('', Validators.required),
    rateType: new FormControl('', Validators.required),
    rateClass :new FormControl('', Validators.required),
    offSeason:new FormControl('', Validators.required),
    lowSeason: new FormControl('', Validators.required),
    highSeason: new FormControl('', Validators.required),
    peakSeason: new FormControl('', Validators.required),
    descr: new FormControl(''),
    color: new FormControl(''),
  })

  sortRates(rlist:any) {
    rlist.sort(function(a:any, b:any) {
      var A = a.alias.toUpperCase(); // ignore upper and lowercase
      var B = b.alias.toUpperCase(); // ignore upper and lowercase
      if (A < B) { return -1; }
      if (A > B) { return 1;  }
      return 0; });
    return rlist
  }


//=================================
// == this is when we  read in the CSV file
//=================================

setResults(list: any[]) {
    list.forEach(rec => {
      const founder = this.rateList.find(d => d.alias == rec.alias)
      if(founder) {
        rec.id = founder.id
       }
       this.genericService.updateItem('rate', rec).subscribe(
        data => {
           this.ngOnInit()
        })
        
    })
  }
//=================================
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }
//=================================
  clearRate() {
    this.rateEditForm.reset()
    this.blankRate(this.currRate)
    this.ngOnInit()
  }
//=================================
  blankRate(rate: any) {
    rate = { } 
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
      this.genericService.getItem('rate', rate.id).subscribe(
        data => {
          this.rateEditForm.patchValue(data)
          this.currRate = data
        }
      )
    }
  }
//=================================
  updateRate(rate: any) {
    this.genericService.updateItem('rate', rate).subscribe(
      data => {
        this.ngOnInit()
        this.clearRate()
      }
    )
  }
//=================================
  deleteRate(rate: any) {
    this.genericService.deleteItem('rate', rate).subscribe(
      data => {
        this.ngOnInit()
        this.clearRate()

      }
    )
  }
//=================================
  refreshList() {
    this.ngOnInit()
  }



//=================================
  ngOnInit(): void {
    this.currRate = {} as IRate
    this.genericService.getItemList('rate')
      .subscribe(
        data => {
          this.rateList = this.sortRates(data)
        }
      )
      this.systemService.getDropdownList('color').subscribe(
        data => this.colorList = data
      )
    
  
    }
}
