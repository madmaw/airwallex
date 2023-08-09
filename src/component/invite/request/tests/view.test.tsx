import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BUTTON_TEXT_SEND, EventInviteRequestInput, Events, InviteRequest, InviteRequestState, PLACEHOLDER_CONFIRM_EMAIL, PLACEHOLDER_EMAIL, PLACEHOLDER_FULL_NAME } from "../view";
import * as React from 'react';
import { Observer } from 'rxjs';
import { RenderResult, fireEvent, render, screen } from '@testing-library/react';

describe('InviteReqeust', () => {
  let observer: Observer<Events>;
  beforeEach(() => {
    observer = {
      complete: vi.fn(),
      next: vi.fn(),
      error: vi.fn(),
    };
  });
  describe('renders', () => {
    describe.each([
      ['is empty', {
        processing: false,
      }],
      ['shows an errorMessage', {
        processing: false,
        errorMessage: 'bad thing',
      }],
      ['shows processing state', {
        processing: true,
      }],
      ['populates name', {
        processing: false,
        name: 'Bob',
      }],
      ['populates email', {
        processing: false,
        email: 'email@place.tld',
      }],
      ['populates confirmation email', {
        processing: false,
        confirmEmail: 'email@place.tld',
      }],
    ] as [string, InviteRequestState][])('%s', (_, state) => {
      let app: RenderResult;
      beforeEach(() => {
        app = render(<InviteRequest observer={observer} state={state}/>);
      });
      afterEach(() => {
        app.unmount();
      });
  
      it('snapshot', () => {
        expect(
          app.baseElement
        ).toMatchSnapshot();
      });  
    });  
  });
  
  describe('interactivity', () => {
    let app: RenderResult;
    const name = 'Bob';
    const email = 'bob@test.com';
    const confirmEmail = 'bad@test.con';
    const BASE_STATE: Pick<InviteRequestState, 'name' | 'email' | 'confirmEmail'> = {
      name,
      email,
      confirmEmail,  
    };
    beforeEach(() => {
      const state: InviteRequestState = {
        processing: false,
        confirmEmail,
        email,
        name,
      };
      app = render(<InviteRequest observer={observer} state={state}/>);
    });

    afterEach(() => {
      app.unmount();
    });

    it('sends the data when you click', () => {
      const sendButton = app.getByText(BUTTON_TEXT_SEND);
      expect(observer.next).not.toHaveBeenCalled();
      sendButton.click();
      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.next).toHaveBeenCalledWith({
        type: 'invite_request_submit',
      });
    });

    it.each([
      [PLACEHOLDER_FULL_NAME, 'Sam', {
        name: 'Sam',
      }],
      [PLACEHOLDER_EMAIL, 'x@y.z', {
        email: 'x@y.z',
      }],
      [PLACEHOLDER_CONFIRM_EMAIL, 'x@y.z', {
        confirmEmail: 'x@y.z',
      }],
    ] as [string, string, Partial<InviteRequestState>][])(
      'updates the %s field',
      (placeholderText, value, state) => {
        const fullName = app.getByPlaceholderText(placeholderText) as HTMLInputElement;
        fireEvent.change(fullName, {
          target: {
            value,
          },
        });
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.next).toHaveBeenCalledWith({
          state: expect.objectContaining({
            ...BASE_STATE,
            ...state,
          }),
          type: 'invite_request_input',
        });
      });
  });
});