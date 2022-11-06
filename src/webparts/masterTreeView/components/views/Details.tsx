import * as React from "react";
import { IconButton, IIconProps, Spinner, SpinnerSize } from "office-ui-fabric-react";
import styles from "../MasterTreeView.module.scss";
import { IDetailItem } from "../../data/IDetailItem";
import Items from "./Items";

export interface IDetailsViewProps {
  loading: boolean;
  details: IDetailItem[];
  onToggleClick: (idDetail: number) => void;
}

export default class Details extends React.Component<IDetailsViewProps, {}> {

  public render(): React.ReactElement<{}> {
    const { loading, details } = this.props;

    if (details === undefined || details.length === 0) {
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

        {details.map(detail => {

          const noItems = details === undefined || details.length === 0;

          const chevronIcon: IIconProps = {
            iconName: detail.show ? "ChevronDown" : "ChevronRight",
          };

          return (
            <ul key={detail.id} className={styles.details}>
              <li>
                <div className={styles.detail}>
                  <IconButton iconProps={chevronIcon} checked={false} onClick={() => this.props.onToggleClick(detail.id)} />
                  <span className={styles.title2}>{detail.title}</span> ({detail.codProvincia})
                  {loading === true && <Spinner size={SpinnerSize.xSmall} />}
                </div>

                {noItems === true
                  ? <div>no items</div>
                  : detail.show === true && <Items items={detail.items} />}
              </li>
            </ul>
          );
        })}
      </>
    );
  }

}