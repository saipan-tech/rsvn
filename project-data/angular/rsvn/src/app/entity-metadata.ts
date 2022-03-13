import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';

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

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
