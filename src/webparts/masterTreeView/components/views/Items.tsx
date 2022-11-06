import * as React from "react";
import { Link } from "office-ui-fabric-react";
import styles from "../MasterTreeView.module.scss";
import { ISubDetailItem } from "../../data/ISubDetailItem";

export interface IItemsViewProps {
  items: ISubDetailItem[];
}

export default class Items extends React.Component<IItemsViewProps, {}> {

  public render(): React.ReactElement<{}> {
    const { items } = this.props;

    return (
      <div className={styles.items}>

        <table className={styles.itemsTable}>
          {/*<thead>
            <tr>
              <th className={styles.itemsTitle}>Title</th>
              <th className={styles.itemsLink}>Link</th>
            </tr>
    </thead>*/}
          <tbody>
            {items.map(item => {
              return (
                <tr key={item.id}>
                  <td className={styles.itemsTitle}>{item.title}</td>
                  <td className={styles.itemsCap}>{item.cap}</td>
                  <td className={styles.itemsLink}>
                    <Link href={`http://it.wikipedia.org/wiki/${item.title}`} target="_blank">More</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    );
  }

}