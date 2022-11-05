import * as React from "react";
import { DetailsList, DetailsListLayoutMode, IColumn, Link, PrimaryButton, SelectionMode, Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "../MasterTreeView.module.scss";
import { IDetailItem } from "../../data/IDetailItem";
import DialogYesNo from "../others/DialogYesNo";

export interface IDetailsViewProps {
  loading: boolean;
  items: IDetailItem[];
  onButtonClick: (event: React.MouseEvent<any>, id: number) => void;
}

interface IDetailsViewState {
  showDialog: boolean;
  message: string;
  data: any;
}

const _columns: IColumn[] = [
  { key: 'title', name: 'Nome', fieldName: 'title', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'codProvincia', name: 'Sigla', fieldName: 'codProvincia', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'modified', name: 'Ultima modifica', fieldName: 'modified', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'button', name: 'Button', minWidth: 100, maxWidth: 200, isResizable: false },
];

export default class Details extends React.Component<IDetailsViewProps, IDetailsViewState> {

  public constructor(props: IDetailsViewProps, state: IDetailsViewState) {
    super(props);

    this.state = {
      showDialog: false,
      message: "",
      data: null
    };
  }

  public render(): React.ReactElement<{}> {
    const { loading, items } = this.props;

    if (items === undefined || items.length === 0) {
      return (
        <div className={styles.grid}>
          <div className={styles.gridRow}>
            <div className={styles.gridCol6}>no items</div>
          </div>
        </div>
      );
    }

    return (
      <>
        {loading && <Spinner size={SpinnerSize.xSmall} />}

        <DetailsList
          items={items}
          columns={_columns}
          onRenderItemColumn={this.renderItemColumn}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />

        <DialogYesNo
          show={this.state.showDialog}
          message={this.state.message}
          data={this.state.data}
          onResponde={this.onResponde}

        />
      </>
    );
  }

  private renderItemColumn = (item: IDetailItem, index: number, column: IColumn): React.ReactNode => {
    const fieldContent = item[column.fieldName as keyof IDetailItem] as string;

    switch (column.key) {
      case 'title':
        // esempio 
        return <Link href={"http://it.wikipedia.org/wiki/" + fieldContent.replace(/ /g, '_')} target="_blank">{fieldContent}</Link>;

      case 'button':
        return <PrimaryButton onClick={(event) => this.onShowDialog(event, item)}>Alert</PrimaryButton>;

      default:
        return <span>{fieldContent}</span>;
    }
  }

  private onShowDialog = (event: any, data: any): void => {
    this.setState({
      showDialog: true,
      message: `Confermi l'item ${data.id}`,
      data: data
    });
  }

  private onResponde = (event: React.MouseEvent<any>, confirmed: boolean, data: any): void => {
    this.setState({
      showDialog: false,
      message: null,
      data: null
    });

    if (confirmed === true) {
      this.props.onButtonClick(event, data.id);
    }
  }
}