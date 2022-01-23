import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsEffects } from './rooms.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { roomsReducer } from './reducers/rooms.reducers';



@NgModule({
  declarations: [
    RoomsComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([RoomsEffects]),
    StoreModule.forFeature("roominfo",roomsReducer)
  ],
  exports: [
    RoomsComponent
  ]
})
export class RoomsModule { }
