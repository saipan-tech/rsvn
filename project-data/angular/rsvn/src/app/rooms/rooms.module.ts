import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { RouterModule, Routes } from '@angular/router';

import { RoominfoEntityService } from './services/roominfo-entity.service';
import { RoominfoDataService } from './services/roominfo-data.service';
import { RoominfoResolver } from './services/roominfo-resolver';

import { RoomEntityService } from './services/room-entity.service';
import { RoomResolver } from './services/room-resolver';
import { RoomDataService } from './services/room-data.service.';

import { RsvnEntityService } from './services/rsvn-entity.service';
import { RsvnResolver } from './services/rsvn-resolver';
import { RsvnDataService } from './services/rsvn-data.service';

import { RoomsComponent } from './rooms/rooms.component';

const entityMetadata: EntityMetadataMap = {
  Roominfo: {},
  Room : {},
  Rsvn : {}
};
=======
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsEffects } from './rooms.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { roomsReducer } from './reducers/rooms.reducers';
>>>>>>> dee79de4cc55a42032f59f56edd1857d6f529cfc



@NgModule({
  declarations: [
    RoomsComponent
  ],
  imports: [
    CommonModule,
<<<<<<< HEAD
    
  ],
  providers: [
    RoominfoEntityService,
    RoominfoResolver,
    RoominfoDataService,

    RoomEntityService,
    RoomResolver,
    RoomDataService,
    
    RsvnEntityService,
    RsvnResolver,
    RsvnDataService
  
    
  
=======
    EffectsModule.forFeature([RoomsEffects]),
    StoreModule.forFeature("roominfo",roomsReducer)
>>>>>>> dee79de4cc55a42032f59f56edd1857d6f529cfc
  ],
  exports: [
    RoomsComponent
  ]
})
<<<<<<< HEAD
export class RoomsModule {
   constructor(
    private eds: EntityDefinitionService,

    private entityDataService: EntityDataService,
    
    private roomDataService: RoomDataService,
    private roominfoDataService: RoominfoDataService,
    private rsvnDataService: RsvnDataService ) {
    
    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService('Roominfo', roominfoDataService);
    entityDataService.registerService('Rsvn', rsvnDataService);
    entityDataService.registerService('Room', roomDataService);

}

 }



 
=======
export class RoomsModule { }
>>>>>>> dee79de4cc55a42032f59f56edd1857d6f529cfc
