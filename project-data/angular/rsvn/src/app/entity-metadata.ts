import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {};

const pluralNames = { Room:'Room', Rsvn:'Rsvn', Roominfo:'Roominfo' };

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
