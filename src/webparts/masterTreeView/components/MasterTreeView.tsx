import * as React from 'react';
import styles from './MasterTreeView.module.scss';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { IMasterTreeViewProps } from './IMasterTreeViewProps';
import { IMasterTreeViewState } from './IMasterTreeViewState';
import { escape } from '@microsoft/sp-lodash-subset';
import Master from './views/Master';
import Details from './views/Details';
import { Data } from '../data/DataService';
import { isNullOrWhiteSpace } from '../Helper';
import { IResult } from '../data/IResult';
import { IMasterItem } from '../data/IMasterItem';
import { IDetailItem } from '../data/IDetailItem';
import { ViewModeEnum } from './ViewModeEnum';
import { Constants } from '../Contants';

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

      errors: [],

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

        {this.state.errors.length > 0 &&
          <div>
            {this.state.errors.map((error, index) => {
              return (
                <MessageBar messageBarType={MessageBarType.error} isMultiline={true} key={index}>
                  {error}
                </MessageBar>
              );
            })}
          </div>
        }

        {showMaster && <Master item={masterItem} loading={masterLoading} />}

        {showDetails && <Details details={detailItems} loading={detailsLoading} onToggleClick={this.onToggleClick} />}

        {isPropertyPaneOpen && (
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={true}
            className={styles.debugInfo}
          >
            <div>Enviroment: {environmentMessage}</div>
            <div>Version: {Constants.VERSION}</div>
            <div>Author: <a href="https://www.sgart.it?SPFxMasterTreeView" target="_blank" rel="noreferrer">Sgart.it</a></div>
            <hr />
            <div>viewMode: <strong>{(ViewModeEnum as any)[viewMode]} ({viewMode})</strong></div>
            <div>webUrl: <strong>{escape(webRelativeUrl)}</strong></div>
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
      prevProps.expandAll !== this.props.expandAll ||
      prevProps.queryStringName !== this.props.queryStringName
    ) {
      await this.loadItems();
    }
  }

  private async loadItems(): Promise<void> {
    const { viewMode, webRelativeUrl, idMaster } = this.props;

    const showMaster = viewMode === ViewModeEnum.MasterAndDetails || viewMode === ViewModeEnum.Master;
    const showDetails = viewMode === ViewModeEnum.MasterAndDetails || viewMode === ViewModeEnum.Details;

    try {
      this.setState({
        masterLoading: showMaster,
        detailsLoading: showDetails,
        showMaster: showMaster,
        showDetails: showDetails,
        errors: []
      });

      if (showMaster === true) {
        this.loadItemMaster(webRelativeUrl, idMaster);
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
        errors: this.state.errors.concat(error),
        masterUrl: ""
      });
    }
  }

  private loadItemMaster(webRelativeUrl: string, idMaster: number): void {
    console.log("getMaster");

    Data.getMaster(webRelativeUrl, idMaster)
      .then((result: IResult<IMasterItem>) => {
        this.setState({
          masterLoading: false,
          masterItem: result.data,
          masterUrl: result.url
        });

        if (result.error) {
          this.setState({ errors: this.state.errors.concat(result.error) });
        }
      })
      .catch(error => {
        this.setState({
          masterLoading: false,
          masterItem: undefined,
          errors: this.state.errors.concat(error)
        });
      });
  }

  private loadItemDetails(webRelativeUrl: string, idMaster: number): void {
    console.log("getDetails");

    Data.getDetails(webRelativeUrl, idMaster, this.props.expandAll)
      .then((result: IResult<IDetailItem[]>) => {
        this.setState({
          detailsLoading: true,
          detailItems: result.data || [],
          masterUrl: result.url
        }, () => this.loadItemSubDetails(webRelativeUrl));

        if (result.error) {
          this.setState({ errors: this.state.errors.concat(result.error) });
        }
      })
      .catch(error => {
        this.setState({
          detailsLoading: false,
          detailItems: [],
          errors: this.state.errors.concat(error)
        });
      })
  }

  private loadItemSubDetails(webRelativeUrl: string): void {
    console.log("getSubDetails");

    Data.getSubDetails(webRelativeUrl, this.state.detailItems)
      .then((result: IResult<IDetailItem[]>) => {
        this.setState({
          detailsLoading: false,
          detailItems: result.data || [],
          masterUrl: result.url
        });

        if (result.error) {
          this.setState({ errors: this.state.errors.concat(result.error) });
        }

      })
      .catch(error => {
        this.setState({
          detailsLoading: false,
          detailItems: [],
          errors: error
        });
      })
  }

  private onToggleClick = (idDetail: number): void => {
    const { detailItems } = this.state;

    const found = detailItems.filter(x => x.id === idDetail);

    if (found !== undefined) {
      found[0].show = !found[0].show;

      this.setState({ detailItems: detailItems });
    }

  }
}
