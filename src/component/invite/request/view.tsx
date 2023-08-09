import * as React from 'react';
import { Observer } from 'rxjs';
import styles from './view.module.scss';

export const PLACEHOLDER_FULL_NAME = 'Full Name';
export const PLACEHOLDER_EMAIL = 'Email';
export const PLACEHOLDER_CONFIRM_EMAIL = 'Confirm Email';
export const BUTTON_TEXT_SEND = 'Send';

export type EventInviteRequestSubmit = {
  type: 'invite_request_submit',
};

export type EventInviteRequestInput = {
  type: 'invite_request_input',
  state: Pick<InviteRequestState, 'email' | 'name' | 'confirmEmail'>,
};

export type Events = 
  | EventInviteRequestSubmit
  | EventInviteRequestInput;

export type InviteRequestState = {
  name?: string,
  email?: string,
  confirmEmail?: string,
  errorMessage?: string,
  processing: boolean,
};

export function InviteRequest({
  state,
  observer,
}: {
  state: InviteRequestState,
  observer: Observer<Events>, 
}) {
  const {
    email,
    name,
    confirmEmail,
    errorMessage,
    processing,
  } = state;
  const setName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    observer.next({
      type: 'invite_request_input',
      state: {
        ...state,
        name: e.target.value,
      }
    });
  }, [observer]);
  const setEmail = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    observer.next({
      type: 'invite_request_input',
      state: {
        ...state,
        email: e.target.value,
      }
    });
  }, [observer]);
  const setConfirmEmail = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    observer.next({
      type: 'invite_request_input',
      state: {
        ...state,
        confirmEmail: e.target.value,
      }
    });
  }, [observer]);
  const send = React.useCallback(() => {
    observer.next({
      type: 'invite_request_submit',
    });
  }, [observer]);
  return (
    <div className={styles.container}>
      <h2>Request an invite</h2>
      <input
        onChange={setName}
        value={name || ''}
        placeholder={PLACEHOLDER_FULL_NAME}
        disabled={processing}
        autoFocus={true}
        />
      <input
        onChange={setEmail}
        value={email || ''}
        placeholder={PLACEHOLDER_EMAIL}
        disabled={processing}
        />
      <input
        onChange={setConfirmEmail}
        value={confirmEmail || ''}
        placeholder={PLACEHOLDER_CONFIRM_EMAIL}
        disabled={processing}
        />
      <button
        className={styles.submit}
        onClick={send}
        disabled={processing}
        >{processing ? 'Sending, please wait...' : BUTTON_TEXT_SEND}</button>
      {errorMessage && (
        <div className={styles.error}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
