import * as React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "../MasterTreeView.module.scss";
import { IMasterItem } from "../../data/IMasterItem";

export interface IMasterViewProps {
  loading: boolean;
  item: IMasterItem;
}

export default class Master extends React.Component<IMasterViewProps> {

  public render(): React.ReactElement<{}> {
    const { loading, item } = this.props;

    return (
      <div className={styles.masterWrapper}>
        <div className={styles.grid}>
          {item === undefined
            ? <div className={styles.gridCol6}>undefined</div>
            : <>
              <div className={styles.gridRow}>
                <div className={styles.gridCol4}>Nome:</div>
                <div className={styles.gridCol6}><strong>{item.title}</strong> {loading && <Spinner size={SpinnerSize.xSmall} />}</div>
              </div>
              <div className={styles.gridRow}>
                <div className={styles.gridCol4}>Sigla:</div>
                <div className={styles.gridCol6}><strong>{item.codRegione}</strong></div>
              </div>
            </>
          }
        </div>
      </div>
    );
  }

}