import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';
import { IBldg } from './_interface/bldg';
import { IRoominfo } from './_interface/roominfo';

const entityMetadata: EntityMetadataMap = {
  Room: {
    entityDispatcherOptions: {
      optimisticDelete:true,
      optimisticAdd:true,
      optimisticUpdate:true
    }
  },
  Roominfo: {
    entityDispatcherOptions: {
      optimisticDelete:true,
      optimisticAdd:true,
      optimisticUpdate:true
    }    
  },  
  Rsvn: {
    entityDispatcherOptions: {
      optimisticDelete:true,
      optimisticAdd:true,
      optimisticUpdate:true
    }
  },
  Guest: {
    entityDispatcherOptions: {
      optimisticDelete:true,
      optimisticAdd:true,
      optimisticUpdate:true
    }
  },
  Bldg: {
    entityDispatcherOptions: {
      optimisticDelete:true,
      optimisticAdd:true,
      optimisticUpdate:true
    }
  },

  Action: {
    entityDispatcherOptions: {
      optimisticDelete:true,
      optimisticAdd:true,
      optimisticUpdate:true
    }
  }


};

const pluralNames = { Room:'Room', Rsvn:'Rsvn', Roominfo:'Roominfo',Guest:'Guest',Bldg:'Bldg',Action:'Action' };

export function sortByNumber(a:IRoominfo,b:IRoominfo) {
  return  a.number.localeCompare(b.number)
}
export function sortByBldgName(a:IBldg , b:IBldg) {
  return  a.name.localeCompare(b.name)
}



export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};

