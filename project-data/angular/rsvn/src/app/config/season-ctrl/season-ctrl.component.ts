import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { ISeason } from '@app/_interface/season';

import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { SeasonService } from '@app/_services/season.service';

@Component({
  selector: 'app-season-ctrl',
  templateUrl: './season-ctrl.component.html',
  styleUrls: ['./season-ctrl.component.scss']
})
export class SeasonCtrlComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private seasonService:  SeasonService

  ) { }


  currSeason : ISeason = {} as ISeason
  seasonList : ISeason[] = []

  @Output() currSeasonChange = new EventEmitter<ISeason>();

  seasonEditForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    descr: new FormControl(''),
   

  })

  clearSeason() {
    this.seasonEditForm.reset()
    this.currSeason = {} as ISeason;
    this.currSeason.id = 0
    this.seasonEditForm.reset()
    this.currSeasonChange.emit(this.currSeason)
  }


  selectSeason(season: ISeason) {
    if (season.id) {
      this.genericService.getItem('season', season.id).subscribe(
        data => {
          this.seasonEditForm.patchValue(data)
          this.currSeason = data
          this.currSeasonChange.emit(data)
        }
      )
    }
    this.currSeasonChange.emit(this.currSeason)
  }

  updateSeason(season: any) {
    for (const field in season) {
      if (season[field] == null) {
        season[field] = ''
      }
    }
    this.genericService.updateItem('season', season).subscribe(
      data => {
        this.clearSeason()
        this.ngOnInit()
      }
    )
  }

  deleteSeason(season: ISeason) {
    this.seasonService.getSeasonRate(season.id)
      .subscribe(
        data => {
          if (data.length == 0) {
            this.genericService.deleteItem('season', season).subscribe(
              data => {
                this.clearSeason()
                this.currSeasonChange.emit(this.currSeason)
                this.ngOnInit()
              }
            )

          }
        }
      )
  }
  ngOnInit(): void {
    this.genericService.getItemList('season')
      .subscribe(
        data => this.seasonList = data
      )
  }
}
