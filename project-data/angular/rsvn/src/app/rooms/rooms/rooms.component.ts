import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/reducers';
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  constructor(
    private store: Store<AppState>
  ) { }
    loadRooms() {

    }
    
  ngOnInit(): void {
    this.store.subscribe(
      d => console.log(d,"checking the store")
    )

  }


}
