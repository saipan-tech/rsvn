import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';


@Component({
  selector: 'app-rsvn-list',
  templateUrl: './rsvn-list.component.html',
  styleUrls: ['./rsvn-list.component.css']
})
export class RsvnListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private systemService: SystemService,

  ) { }

  
  @Output() currRsvn = new EventEmitter<IRsvn>();

  @Input() currGuestID: any
  @Input() list_style: any


  rsvnList: any[] = []
  

  loadRsvn(rsvn: any) {
    this.currRsvn.emit(rsvn)
  }



  ngOnInit(): void {

    if (this.currGuestID) {
      this.rsvnService.getGuestRsvn(this.currGuestID)
        .subscribe(
          data => {
            this.rsvnList = data
          }
        )
    }

  }
}