import { DemographicTypeDto } from "./DemographicTypeDto";

export interface CreateUpdateDto{
  addList:DemographicTypeDto[];
  updateList:DemographicTypeDto[];
}
