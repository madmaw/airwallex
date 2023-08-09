import * as React from 'react';
import { Observer, Subject } from 'rxjs';

export interface Controller<ComponentState, ComponentEvents, ControllerEvents> {
  process(
    e: ComponentEvents,
    state: ComponentState,
    setState: (state: ComponentState) => void,
    observer: Observer<ControllerEvents>,
  ): Promise<void>;
}

export function createStatefulComponent<
  P,
  ComponentState,
  ComponentEvents,
  ControllerEvents,
>(
  Stateless: React.ComponentType<Omit<P, 'observer'> & { state: ComponentState, observer: Observer<ComponentEvents> }>,
  controller: Controller<ComponentState, ComponentEvents, ControllerEvents>,
  initialState: ComponentState,
) {
  return function (props: Omit<P, 'observer'> & {
    observer: Observer<ControllerEvents>
  }) {
    const { observer } = props;
    const [state, setState] = React.useState<ComponentState>(initialState);
    const subject = React.useMemo(() => new Subject<ComponentEvents>(), []);
    React.useEffect(() => {
      const subscription = subject.subscribe(e => {
        controller.process(e, state, setState, observer);
      });
      return () => subscription.unsubscribe();
    }, [state, setState, observer, subject]);
    return (
      <Stateless
        {...props}
        state={state}
        observer={subject}/>
    );
  }
}
