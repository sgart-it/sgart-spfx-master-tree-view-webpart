import * as React from "react";
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from "office-ui-fabric-react";

export interface IDialogYesNo {
  show: boolean;
  message: string;
  data: any,
  onResponde: (event: React.MouseEvent<any>, confirmed: boolean, data: any) => void;
}

export default class DialogYesNo extends React.Component<IDialogYesNo> {

  public render(): React.ReactElement<{}> {
    const { show, message, data } = this.props;

    const dialogContentProps = {
      type: DialogType.normal,
      title: 'Confirm',
      closeButtonAriaLabel: 'Close',
      subText: message,
    };

    return (
      <Dialog hidden={!show} dialogContentProps={dialogContentProps}>
        <DialogFooter>
          <PrimaryButton onClick={event => { this.props.onResponde(event, true, data) }} text="Yes" />
          <DefaultButton onClick={event => this.props.onResponde(event, false, null)} text="No" />
        </DialogFooter>
      </Dialog>
    );
  }
}