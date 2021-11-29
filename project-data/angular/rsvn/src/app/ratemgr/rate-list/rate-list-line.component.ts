import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { SeasonService } from '@app/_services/season.service';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IRate } from '@app/_interface/rate';
import { ISeason } from '@app/_interface/season';
import { IDropdown } from '@app/_interface/dropdown';

@Component({
  selector: 'app-rate-list-line',
  templateUrl: './rate-list-line.component.html',
  styleUrls: ['./rate-list-line.component.scss']
})
export class RateListLineComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private formBuilder: FormBuilder,
    private seasonService: SeasonService
  ) { }
  
  @Input() rate:any 
  @Input() colorList:IDropdown[] = []
  @Input()  seasonList:ISeason[] = []
  @Output() rateChange = new EventEmitter<IRate>()
  @Output() refresh = new EventEmitter<any>()
  

  rateEditForm = this.formBuilder.group({
    id: [''],
    alias: [''],
    rateCategory: ['', Validators.required],
    rateName: ['', Validators.required],
    rateType: ['', Validators.required],
    rateClass: ['', Validators.required],
    rack:     ['', Validators.required],
    descr: [''],
    color: [''],
  })


  ngOnInit(): void {
    this.rateEditForm.patchValue(this.rate.rate)

    this.rateEditForm.statusChanges.subscribe(x => {
      this.updateRate(x)
  })
  
  }
  
   //=================================
   deleteRate(rate: any) {
    this.genericService.deleteItem('rate', rate).subscribe(
      () => this.refresh.emit(true)
    )

  }
   //=================================
   updateRate(rate: any) {
      this.rateChange.emit(rate)
  }
}
