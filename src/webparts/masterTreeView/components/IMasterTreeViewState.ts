
import { IDetailItem } from "../data/IDetailItem";
import { IMasterItem } from "../data/IMasterItem";

export interface IMasterTreeViewState {
  success: boolean;
  errors: string[];

  masterLoading: boolean;
  detailsLoading: boolean;

  showMaster: boolean;
  showDetails: boolean;

  masterItem: IMasterItem;
  detailItems: IDetailItem[];
  
  detailsUrl: string;
  masterUrl: string;

  showDialog: boolean,
  showDialogMessage: string;


}
