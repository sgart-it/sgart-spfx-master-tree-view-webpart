import { ViewModeEnum } from "./ViewModeEnum";

export interface IMasterTreeViewProps {
  title: string;
  detailsTitle: string;
  viewMode: ViewModeEnum;
  expandAll: boolean;
  isPropertyPaneOpen: boolean;

  webRelativeUrl: string;
  queryStringName: string;

  idMaster: number;

  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
