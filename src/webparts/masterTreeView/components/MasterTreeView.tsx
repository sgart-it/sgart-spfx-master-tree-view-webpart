import * as React from 'react';
import styles from './MasterTreeView.module.scss';
import { MessageBar, MessageBarType, Separator } from 'office-ui-fabric-react';
import { IMasterTreeViewProps } from './IMasterTreeViewProps';
import { IMasterTreeViewState } from './IMasterTreeViewState';
import { escape } from '@microsoft/sp-lodash-subset';
import Master from './views/Master';
import Details from './views/Details';
import { getMaster, getDetails, getSubDetails } from '../data/DataService';
import { isNullOrWhiteSpace } from '../Helper';
import { IResult } from '../data/IResult';
import { IMasterItem } from '../data/IMasterItem';
import { IDetailItem } from '../data/IDetailItem';
import { ViewMode } from './ViewMode';

const VERSION = "1.2022-11-05";

export default class MasterTreeView extends React.Component<IMasterTreeViewProps, IMasterTreeViewState> {

  public constructor(props: IMasterTreeViewProps, state: IMasterTreeViewState) {
    super(props);

    this.state = {
      masterLoading: true,
      detailsLoading: true,

      showMaster: false,
      showDetails: false,

      success: false,

      masterItem: undefined,
      detailItems: [],

      error: undefined,

      masterUrl: "",
      detailsUrl: "",

      showDialog: false,
      showDialogMessage: null
    };
  }

  public render(): React.ReactElement<IMasterTreeViewProps> {
    const {
      isPropertyPaneOpen,
      title,
      viewMode,

      webRelativeUrl,
      masterListName,
      detailsListName,
      detailsMasterFieldName,
      queryStringName,

      idMaster,

      environmentMessage,
      hasTeamsContext
    } = this.props;

    const { masterLoading, detailsLoading, showMaster, showDetails, masterItem, detailItems } = this.state;

    const isTitleVisible = !isNullOrWhiteSpace(title);

    return (
      <section className={`${styles.masterTreeView} ${hasTeamsContext ? styles.teams : ''}`}>

        {isTitleVisible && (
          <div className={styles.title}>
            <span role="heading">{escape(title)}</span>
          </div>
        )}

        {!isNullOrWhiteSpace(this.state.error) && (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={true}>
            {this.state.error}
          </MessageBar>
        )}

        {showMaster && <Master item={masterItem} loading={masterLoading} />}

        {showMaster && showDetails && <Separator />}

        {showDetails && <Details details={detailItems} loading={detailsLoading} onToggleClick={this.onToggleClick} />}

        {isPropertyPaneOpen && (
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={true}
            className={styles.debugInfo}
          >
            <div>Enviroment: {environmentMessage}</div>
            <div>Version: {VERSION}</div>
            <div>Author: <a href="https://www.sgart.it?SPFxMasterDetails" target="_blank" rel="noreferrer">Sgart.it</a></div>
            <hr />
            <div>viewMode: <strong>{(ViewMode as any)[viewMode]} ({viewMode})</strong></div>
            <div>webUrl: <strong>{escape(webRelativeUrl)}</strong></div>
            <div>masterListName: <strong>{escape(masterListName)}</strong></div>
            <div>detailsListName: <strong>{escape(detailsListName)}</strong></div>
            <div>detailsMasterFieldName: <strong>{escape(detailsMasterFieldName)}</strong></div>
            <div>queryStringName: <strong>{escape(queryStringName)} = <strong>{idMaster}</strong></strong></div>
          </MessageBar>
        )}
      </section>
    );
  }

  public async componentDidMount(): Promise<void> {
    await this.loadItems();
  }

  public async componentDidUpdate(prevProps: IMasterTreeViewProps, prevState: IMasterTreeViewState): Promise<void> {
    if (
      prevProps.title !== this.props.title ||
      prevProps.detailsTitle !== this.props.detailsTitle ||
      prevProps.viewMode !== this.props.viewMode ||
      prevProps.webRelativeUrl !== this.props.webRelativeUrl ||
      prevProps.masterListName !== this.props.masterListName ||
      prevProps.detailsListName !== this.props.detailsListName ||
      prevProps.queryStringName !== this.props.queryStringName
    ) {
      await this.loadItems();
    }
  }

  private async loadItems(): Promise<void> {
    const { viewMode, webRelativeUrl, masterListName, idMaster } = this.props;

    const showMaster = viewMode === ViewMode.MasterAndDetails || viewMode === ViewMode.Master;
    const showDetails = viewMode === ViewMode.MasterAndDetails || viewMode === ViewMode.Details;

    try {
      this.setState({
        masterLoading: showMaster,
        detailsLoading: showDetails,
        showMaster: showMaster,
        showDetails: showDetails
      });

      if (showMaster === true) {
        this.loadItemMaster(webRelativeUrl, masterListName, idMaster);
      }


      if (showDetails === true) {
        this.loadItemDetails(webRelativeUrl, idMaster);
      }

    } catch (error) {
      this.setState({
        masterLoading: false,
        detailsLoading: false,
        success: false,
        masterItem: undefined,
        error: error,
        masterUrl: ""
      });
    }
  }

  private loadItemMaster(webRelativeUrl: string, listName: string, idMaster: number): void {
    console.log("getMaster");

    getMaster(webRelativeUrl, listName, idMaster)
      .then((result: IResult<IMasterItem>) => {
        this.setState({
          masterLoading: false,
          masterItem: result.data,
          error: result.error,
          masterUrl: result.url
        });
      })
      .catch(error => {
        this.setState({
          masterLoading: false,
          masterItem: undefined,
          error: error
        });
      });
  }

  private loadItemDetails(webRelativeUrl: string, idMaster: number): void {
    console.log("getDetails");

    getDetails(webRelativeUrl, idMaster)
      .then((result: IResult<IDetailItem[]>) => {
        this.setState({
          detailsLoading: true,
          detailItems: result.data || [],
          error: result.error,
          masterUrl: result.url
        }, () => this.loadItemSubDetails(webRelativeUrl));
      })
      .catch(error => {
        this.setState({
          detailsLoading: false,
          detailItems: [],
          error: error
        });
      })
  }

  private loadItemSubDetails(webRelativeUrl: string): void {
    console.log("getSubDetails");

    getSubDetails(webRelativeUrl, this.state.detailItems)
      .then((result: IResult<IDetailItem[]>) => {
        this.setState({
          detailsLoading: false,
          detailItems: result.data || [],
          error: result.error,
          masterUrl: result.url
        });
      })
      .catch(error => {
        this.setState({
          detailsLoading: false,
          detailItems: [],
          error: error
        });
      })
  }

  private onToggleClick = (idDetail: number): void => {
    const { detailItems } = this.state;

    var found = detailItems.filter(x => x.id === idDetail);

    if (found !== undefined) {
      found[0].show = !found[0].show;

      this.setState({ detailItems: detailItems });
    }

  }
}
