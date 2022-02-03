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
  }
};

const pluralNames = { Room:'Room', Rsvn:'Rsvn', Roominfo:'Roominfo' };

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
