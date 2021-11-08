import { Component, OnInit } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { IGuest } from '@app/_interface/guest';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {

  constructor(
    private systemService :  SystemService,
    private genericSystem : GenericService

  ) { }
  dst:IGuest = {} as IGuest
  currGuestRecord : any

    getGuest() {
      this.systemService.getPeople()
      .subscribe( src => {
        this.dst.lastname = src.LastName
        this.dst.firstname = src.FirstName
        this.dst.city = src.City
        this.dst.state = src.State
        this.dst.zipcode = src.Zip
        this.dst.phone = src.Phone
        this.dst.title = src.Title
        this.dst.email = src.Email
        this.dst.address = src.Code
        this.dst.birthday = src.Birthdate
        this.dst.company = src.Company
        this.dst.idnum = src.Credits
        this.dst.idtype = "driver"
        this.dst.idexpire = "12/25/2040"
        this.dst.clerk = "api"

        this.genericSystem.updateItem("guest",this.dst)
        .subscribe(
          data => this.currGuestRecord = data
        )
      })
    }

  ngOnInit(): void {
  }

}
