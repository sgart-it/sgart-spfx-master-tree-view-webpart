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
  ViewModeLabel: string;
  ExpandAllLabel: string;
  
  WebRelativeUrlLabel: string;
  WebRelativeUrlDescription: string;

  QueryStringNameLabel: string;
  QueryStringNameDescription: string;
}

declare module 'MasterTreeViewWebPartStrings' {
  const strings: IMasterTreeViewWebPartStrings;
  export = strings;
}
