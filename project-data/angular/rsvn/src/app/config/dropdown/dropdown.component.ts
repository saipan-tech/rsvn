import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { GenericService } from '@app/_services/generic.service';
import { IDropdown } from '@app/_interface/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  constructor(
    private genericService: GenericService,

  ) { }

  currDropdown: IDropdown = {} as IDropdown
  currName: string = ""
  dropdownList: IDropdown[] = []
  dropdownFilterList: IDropdown[] = []
  dropdownSet = new Set()



  setResults(list: any[]) {

    list.forEach(rec => {
      const founder = this.dropdownList.find(d => d.name == rec.name && d.value == rec.value)
      if(founder) {
        rec.id = founder.id
        
       }
       this.genericService.updateItem('dropdown', rec).subscribe(
        data => {
          this.currName = data.name
          this.ngOnInit()
        })
        
    })
  }

  dropdownEditForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    sequence: new FormControl('', Validators.required),
    display: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required),
  })

  loadDropdown(dropdown: any) {
    if (dropdown.id) {
      this.genericService.getItem('dropdown', dropdown.id).subscribe(
        data => {
          this.dropdownEditForm.patchValue(data)
          this.currDropdown = data
        }
      )
    }
  }

  updateDropdown(dropdown: any) {
    this.genericService.updateItem('dropdown', dropdown).subscribe(
      data => {
        this.currName = data.name
        this.ngOnInit()

      }
    )
  }

  deleteDropdown(dropdown: any) {
    this.genericService.deleteItem('dropdown', dropdown).subscribe(
      data => {
        this.ngOnInit()
      }
    )
  }

  dropdownNameSelect(name: any) {
    this.dropdownFilterList = this.dropdownList.filter(data => data.name == name)
    this.dropdownFilterList.sort((a, b) => {
      if (a.sequence < b.sequence) {
        return -1
      }
      if (a.sequence > b.sequence) {
        return 1
      }
      return 0
    })
  }

  dropdownNameList() {
    this.dropdownSet = new Set()
    this.dropdownList.forEach(data => this.dropdownSet.add(data.name))
  }

  blankDropdown(dropdown: any) {
    dropdown = {} as IDropdown;
    dropdown.id = 0
    for (const field in dropdown) {
      if (dropdown[field] == null) {
        dropdown[field] = ''
      }
    }
    this.dropdownEditForm.reset()
  }

  clearDropdown() {
    this.blankDropdown(this.currDropdown)
  }

  ngOnInit(): void {
    this.genericService.getItemList("dropdown")
      .subscribe(
        data => {
          this.clearDropdown()
          this.dropdownList = data
          this.dropdownNameList()
          this.dropdownNameSelect(this.currName)

        }
      )
  }
}






