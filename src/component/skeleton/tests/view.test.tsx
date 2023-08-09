import { RenderResult, render } from '@testing-library/react';
import * as React from 'react';
import { Mocked, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CLOSE_BUTTON_ARIA_LABEL, DesktopSkeleton, Events } from '../view';
import { Observer } from 'rxjs';

describe('DesktopSkeleton', () => {
  let observer: Mocked<Observer<Events>>;

  beforeEach(() => {
    observer = {
      complete: vi.fn(),
      error: vi.fn(),
      next: vi.fn(),
    };
  });

  describe('no dialog', () => {
    it('renders', () => {
      const app = render(
        <DesktopSkeleton
          body={<div>body</div>}
          dialog={undefined}
          footer={<div>footer</div>}
          header={<div>header</div>}
          observer={observer}
          />
      );
      expect(app.baseElement).toMatchSnapshot();
      app.unmount();  
    });
  });

  describe('with dialog', () => {
    let app: RenderResult;
  
    beforeEach(() => {
      app = render(
        <DesktopSkeleton
          body={<div>body</div>}
          dialog={<div>dialog</div>}
          footer={<div>footer</div>}
          header={<div>header</div>}
          observer={observer}
          />
      );
    });
  
    afterEach(() => {
      app.unmount();
    });
  
    it('renders', () => {
      expect(app.baseElement).toMatchSnapshot();
    });
  
    it('closes on close', () => {
      const closeButton = app.getByLabelText(CLOSE_BUTTON_ARIA_LABEL);
      expect(observer.next).not.toHaveBeenCalled();
      closeButton.click();
      expect(observer.next).toHaveBeenCalledTimes(1);
      expect(observer.next).toHaveBeenCalledWith({
        type: 'skeleton_close_dialog',
      });
    });
  });

});