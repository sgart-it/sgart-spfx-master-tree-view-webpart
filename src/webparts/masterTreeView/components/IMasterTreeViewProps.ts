import { ViewMode } from "./ViewMode";

export interface IMasterTreeViewProps {
  title: string;
  detailsTitle: string;
  viewMode: ViewMode;
  isPropertyPaneOpen: boolean;

  webRelativeUrl: string;
  masterListName: string;
  detailsListName: string;
  detailsMasterFieldName: string;
  queryStringName: string;

  idMaster: number;

  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
