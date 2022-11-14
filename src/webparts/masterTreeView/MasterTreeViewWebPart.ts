import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneLink,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MasterTreeViewWebPartStrings';
import MasterTreeView from './components/MasterTreeView';
import { IMasterTreeViewProps } from './components/IMasterTreeViewProps';
import { Data } from './data/DataService';
import { ViewModeEnum } from './components/ViewModeEnum';
import { IMasterTreeViewWebPartProps } from './IMasterTreeViewWebPartProps';
import { getQuerystring } from './Helper';


export default class MasterTreeViewWebPart extends BaseClientSideWebPart<IMasterTreeViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    Data.initDataService(this.context);

    return super.onInit();
  }

  public render(): void {
    //const params = new URLSearchParams(document.location.search);
    // attenzione il parametro in query string è case sensitive
    //const idMaster = Number(params.get(this.properties.queryStringName));
    const idMaster = Number(getQuerystring(this.properties.queryStringName));
    const props = this.properties;
    
    const element: React.ReactElement<IMasterTreeViewProps> = React.createElement(
      MasterTreeView,
      {
        isPropertyPaneOpen: this.context.propertyPane.isPropertyPaneOpen(),

        title: props.webpartTitle,
        detailsTitle: props.detailsTitle,
        viewMode: (ViewModeEnum as any)[props.viewMode],
        expandAll: props.expandAll,

        webRelativeUrl: props.webRelativeUrl,
        queryStringName: props.queryStringName,

        idMaster: idMaster,

        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }



  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    this.render();  // force render

    const viewModeOptions = Object.keys(ViewModeEnum)
      .filter((v) => isNaN(Number(v)))
      .map(item => { return { key: item, text: item } });

    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          header: {
            description: strings.PropertyHeaderDescription
          },
          groups: [
            {
              groupName: strings.PresentationGroupName,
              groupFields: [
                PropertyPaneTextField('webpartTitle', {
                  label: strings.WebPartTitleLabel
                }),
                PropertyPaneDropdown('viewMode', {
                  label: strings.ViewModeLabel,
                  options: viewModeOptions
                }),
                PropertyPaneCheckbox('expandAll',{
                  text: strings.ExpandAllLabel
                })
              ]
            },
            {
              groupName: strings.SourceGroupName,
              groupFields: [
                PropertyPaneTextField('webRelativeUrl', {
                  label: strings.WebRelativeUrlLabel,
                  description: strings.WebRelativeUrlDescription
                }),
                PropertyPaneTextField('queryStringName', {
                  label: strings.QueryStringNameLabel,
                  description: strings.QueryStringNameDescription
                })
              ]
            },
            {
              groupName: strings.AboutGroupName,
              groupFields: [
                PropertyPaneLink('linkField', {
                  text: "Sgart.it",
                  href: "https://www.sgart.it/?SPFxMasterTreeView",
                  target: "_blank"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onPropertyPaneConfigurationComplete(): void {
    this.render();
  }
  
  /*protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  }*/
}
