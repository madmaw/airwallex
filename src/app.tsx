import * as React from 'react';
import { DesktopSkeleton, EventSkeletonCloseDialog } from './component/skeleton/view';
import { Header } from './component/header/view';
import { Footer } from './component/footer/view';
import { Body, EventBodyRequestInvite } from './component/body/view';
import { Subject } from 'rxjs';
import { UnreachableError } from './base/unreachable_error';
import { InviteRequest } from 'component/invite/request/view';
import { EventInviteSuccessDone, InviteSuccess } from 'component/invite/success/view';
import { createStatefulComponent } from 'base/stateful_component';
import { EventInviteRequestSuccess, InviteRequestController } from 'component/invite/request/controller';
import { InvitationService } from 'services/invitation_service';

type State = {
  type: 'init' | 'success' | 'invite',
};

export function App({
  invitationService,
}: {
  invitationService: InvitationService,
}) {
  const [state, setState] = React.useState<State>({
    type: 'init',
  });

  const StatefulInviteRequest = React.useMemo(() => {
    return createStatefulComponent(
      InviteRequest,
      new InviteRequestController(invitationService),
      {
        processing: false,
      },
    );
  }, [invitationService]);


  const subject = React.useMemo(() => {
    return new Subject<
      | EventBodyRequestInvite
      | EventInviteRequestSuccess
      | EventSkeletonCloseDialog
      | EventInviteSuccessDone
    >();
  }, []);

  React.useEffect(() => {
    const subscription = subject.subscribe(e => {
      switch (e.type) {
        case 'body_request_invite':
          return setState({
            type: 'invite',
          });
        case 'skeleton_close_dialog':
        case 'invite_success_done':
          return setState({
            type: 'init',
          });
        case 'invite_request_success':
          return setState({
            type: 'success',
          });
        default:
          throw new UnreachableError(e);
      } 
    });
    return () => subscription.unsubscribe();
  }, [subject])

  const header = React.useMemo(() => {
    return (<Header/>);
  }, []);

  const footer = React.useMemo(() => {
    return (<Footer/>);
  }, []);

  const body = React.useMemo(() => {
    return (<Body observer={subject}/>);
  }, []);

  const dialog = React.useMemo(() => {
    switch (state.type) {
      case 'init':
        return undefined;
      case 'invite':
        return (
          <StatefulInviteRequest
            observer={subject}
            />
        );
      case 'success': 
        return (
          <InviteSuccess
            observer={subject}
            />
        );
      default:
        throw new UnreachableError(state.type);
    }
  }, [state]);

  const Skeleton = DesktopSkeleton;

  return (
    <Skeleton
      header={header}
      body={body}
      footer={footer}
      dialog={dialog}
      observer={subject}
      />
  );
}