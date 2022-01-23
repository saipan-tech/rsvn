import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/reducers';
import {selectAllRooms} from '@app/rooms/rooms.selectors';
import { Observable, of } from 'rxjs';
import { IRoominfo } from '@app/_interface/roominfo';



@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  allRoominfo$: Observable<IRoominfo[]> = of()


  constructor(
    private store: Store<AppState>
  ) { }
    loadRooms() {

    }

  ngOnInit(): void {
 
    this.allRoominfo$ = this.store.pipe(select(selectAllRooms));
  }


}
