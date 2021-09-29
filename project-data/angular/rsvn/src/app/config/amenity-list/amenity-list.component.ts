import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { IAmenity } from '@app/_interface/amenity'


@Component({
  selector: 'app-amenity-list',
  templateUrl: './amenity-list.component.html',
  styleUrls: ['./amenity-list.component.css']
})
export class AmenityListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,

  ) { }

  amenityList: any
  currAmenity: any

  amenityEditForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    descr: new FormControl('', Validators.required),
    icon: new FormControl(''),
  })


  loadAmenity(amenity: any) {
    if (amenity.id) {

      this.genericService.getItem('amenity', amenity.id).subscribe(
        data => {
          this.amenityEditForm.patchValue(data)
          this.currAmenity = data
        }
      )
    }

  }
  blankAmenity(amenity: any) {
    amenity = {} as IAmenity;
    amenity.id = 0
    for (const field in amenity) {
      if (amenity[field] == null) {
        amenity[field] = ''
      }
    }
    this.amenityEditForm.reset()
  }

  updateAmenity(amenity: any) {
    this.genericService.updateItem('amenity', amenity).subscribe(
      data => {
        this.blankAmenity(this.currAmenity)
        this.ngOnInit()

      }
    )
  }

  deleteAmenity(amenity: any) {
    this.genericService.deleteItem('amenity', amenity).subscribe(
      data => {
        this.ngOnInit()
      }
    )
  }

  clearAmenity() {
    this.blankAmenity(this.currAmenity)
    this.ngOnInit()
  }

  ngOnInit(): void {
    this.genericService.getItemList("amenity")
      .subscribe(
        data => this.amenityList = data
      )
    if (this.currAmenity.id) {
      this.amenityEditForm.reset()
      this.amenityList = [];

    }
  }

}

