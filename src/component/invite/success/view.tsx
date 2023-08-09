import * as React from 'react';
import { Observer } from 'rxjs';
import styles from './view.module.scss';

export type EventInviteSuccessDone = {
  type: 'invite_success_done',
};

export type Events = EventInviteSuccessDone;

export const BUTTON_TEXT_OK = 'OK';

export function InviteSuccess({
  observer,
}: {
  observer: Observer<Events>
}) {
  const onClose = React.useCallback(() => {
    observer.next({
      type: 'invite_success_done',     
    });
  }, [observer])
  return (
    <div className={styles.container}>
      <h2>All done!</h2>
      <p>You will be one of the first to experience Broccoli & Co. when we launch</p>
      <button onClick={onClose} autoFocus={true}>{BUTTON_TEXT_OK}</button>
    </div>
  ); 
}