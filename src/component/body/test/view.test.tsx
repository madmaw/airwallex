import { RenderResult, render } from '@testing-library/react';
import * as React from 'react';
import { Mocked, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BUTTON_TEXT_REQUEST, Body, Events } from '../view';
import { Observer } from 'rxjs';

describe('Body', () => {
  let app: RenderResult;
  let observer: Mocked<Observer<Events>>;

  beforeEach(() => {
    observer = {
      complete: vi.fn(),
      error: vi.fn(),
      next: vi.fn(),
    };
    app = render(<Body observer={observer}/>);
  });

  afterEach(() => {
    app.unmount();
  });

  it('renders', () => {
    expect(app.baseElement).toMatchSnapshot();
  });

  it('fires request invite event', () => {
    const requestButton = app.getByText(BUTTON_TEXT_REQUEST);
    expect(observer.next).not.toHaveBeenCalled();
    requestButton.click();
    expect(observer.next).toHaveBeenCalledTimes(1);
    expect(observer.next).toHaveBeenCalledWith({
      type: 'body_request_invite',
    });
  });
});