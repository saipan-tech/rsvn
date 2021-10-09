import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { IBldg } from '@app/_interface/bldg';

import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-bldg-list',
  templateUrl: './bldg-list.component.html',
  styleUrls: ['./bldg-list.component.css']
})
export class BldgListComponent implements OnInit {
  constructor(
    private genericService: GenericService,
    private roomService: RoomService,
  ) { }

  @Output() currBldgChange = new EventEmitter<IBldg>();

  bldgList: IBldg[] = [];
  currBldg: IBldg = {} as IBldg;
  editor: boolean = false

  bldgEditForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    location: new FormControl(''),
    descr: new FormControl(''),
  })

  clearBldg() {
    this.bldgEditForm.reset()
    this.currBldg = {} as IBldg;
    this.currBldg.id = 0
    this.bldgEditForm.reset()
    this.currBldgChange.emit(this.currBldg)
  }


  selectBldg(bldg: IBldg) {
    if (bldg.id) {
      this.genericService.getItem('bldg', bldg.id).subscribe(
        data => {
          this.bldgEditForm.patchValue(data)
          this.currBldg = data
          this.currBldgChange.emit(data)
        }
      )
    }
    this.currBldgChange.emit(this.currBldg)
  }

  updateBldg(bldg: any) {
    for (const field in bldg) {
      if (bldg[field] == null) {
        bldg[field] = ''
      }
    }
    this.genericService.updateItem('bldg', bldg).subscribe(
      data => {
        this.clearBldg()
        this.ngOnInit()
      }
    )
  }

  delBldg(bldg: IBldg) {
    this.roomService.getBldgRoominfoList(bldg.id)
      .subscribe(
        data => {
          if (data.length == 0) {
            this.genericService.deleteItem('bldg', bldg).subscribe(
              data => {
                this.clearBldg()
                this.currBldgChange.emit(this.currBldg)
                this.ngOnInit()
              }
            )

          }
        }
      )
  }
  existRooms(bldg: IBldg) {
    this.roomService.getBldgRoominfoList(bldg.id)
      .subscribe(
        data => {
          return data.length

        }
      )
  }
  ngOnInit(): void {
    this.genericService.getItemList('bldg')
      .subscribe(
        data => this.bldgList = data
      )
  }
}
