import * as React from 'react';
import styles from './view.module.scss';
import { Observer } from 'rxjs';

export type EventSkeletonCloseDialog = {
  type: 'skeleton_close_dialog',
};

export type Events = EventSkeletonCloseDialog;

type SkeletonProps = {
  header: JSX.Element,
  footer: JSX.Element,
  body: JSX.Element,
  dialog: JSX.Element | undefined,
  observer: Observer<Events>,
};

export const CLOSE_BUTTON_ARIA_LABEL = 'Close';

export function DesktopSkeleton({
  header,
  footer,
  body,
  dialog,
  observer,
}: SkeletonProps) {
  const onClose = React.useCallback(() => {
    observer.next({
      type: 'skeleton_close_dialog',
    });
  }, [observer])

  const preventClose = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.body}>
        {body}
      </div>
      <div className={styles.footer}>
        {footer}
      </div>
      {dialog && (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.dialog} onClick={preventClose}>
            {dialog}
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label={CLOSE_BUTTON_ARIA_LABEL}
              >x</button>
          </div>
        </div>
      )}
    </div>
  )
}