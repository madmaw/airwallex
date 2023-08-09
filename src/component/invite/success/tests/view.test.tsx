import * as React from 'react';
import { RenderResult, render } from "@testing-library/react";
import { Mocked, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BUTTON_TEXT_OK, Events, InviteSuccess } from "../view";
import { Observer } from 'rxjs';

describe('InviteSuccess', () => {
  let app: RenderResult;
  let observer: Mocked<Observer<Events>>;

  beforeEach(() => {
    observer = {
      next: vi.fn(),
      complete: vi.fn(),
      error: vi.fn(),
    };
    app = render(
      <InviteSuccess observer={observer}/>
    )
  });

  afterEach(() => {
    app.unmount();
  });

  it('renders', () => {
    expect(app.baseElement).toMatchSnapshot();
  });

  it('fires success event', () => {
    const okButton = app.getByText(BUTTON_TEXT_OK);
    expect(observer.next).not.toHaveBeenCalled();
    okButton.click();
    expect(observer.next).toHaveBeenCalledTimes(1);
    expect(observer.next).toHaveBeenCalledWith({
      type: 'invite_success_done',
    });
  });
});