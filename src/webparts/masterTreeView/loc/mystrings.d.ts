declare interface IMasterTreeViewWebPartStrings {
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;

  PropertyHeaderDescription: string;
  PresentationGroupName: string;
  SourceGroupName: string;
  AboutGroupName: string;


  WebPartTitleLabel: string;
  DetailsTitleLabel: string;
  ViewModeLabel: string;
  
  WebRelativeUrlLabel: string;
  WebRelativeUrlDescription: string;
  MasterListNameLabel: string;
  ListNameDescription: string;
  DetailsListNameLabel: string;
  DetailsMasterFieldNameLabel: string;
  DetailsMasterFieldNameDescription: string;

  QueryStringNameLabel: string;
  QueryStringNameDescription: string;

}

declare module 'MasterTreeViewWebPartStrings' {
  const strings: IMasterTreeViewWebPartStrings;
  export = strings;
}
