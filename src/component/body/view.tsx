import * as React from 'react';
import { Observer } from 'rxjs';
import styles from './view.module.scss';

export type EventBodyRequestInvite = {
  type: 'body_request_invite',
};

export type Events = EventBodyRequestInvite;

export const BUTTON_TEXT_REQUEST = 'Requst an invite';

export function Body({
  observer,
}: {
  observer: Observer<Events>,
}) {
  const requestInvite = React.useCallback(() => {
    observer.next({
      type: 'body_request_invite',
    });
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>A better way<br/>to enjoy every day.</h1>
        <p>
          Be the first to know when we launch.
        </p>
        <button onClick={requestInvite} autoFocus={true}>{BUTTON_TEXT_REQUEST}</button>
      </div>
    </div>
  );
}