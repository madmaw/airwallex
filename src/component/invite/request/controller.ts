import { InvitationService } from "services/invitation_service";
import { Events, InviteRequestState } from "./view";
import { Observer } from 'rxjs';
import { Controller } from "base/stateful_component";

export type EventInviteRequestSuccess = {
  type: 'invite_request_success',
};

export class InviteRequestController implements Controller<
  InviteRequestState,
  Events,
  EventInviteRequestSuccess
> {
  constructor(
    private readonly invitationService: InvitationService,
  ) {

  }

  async process(
    e: Events,
    state: InviteRequestState,
    setState: (state: InviteRequestState) => void,
    observer: Observer<EventInviteRequestSuccess>,
  ): Promise<void> {
    switch (e.type) {
      case 'invite_request_input':
        return setState({
          ...state,
          ...e.state,
        });
      case 'invite_request_submit':
        const errorMessage = this.validate(state);
        if (errorMessage != null) {
          return setState({
            ...state,
            errorMessage,
            processing: false,
          });
        }
        setState({
          ...state,
          errorMessage: undefined,
          processing: true,
        });
        try {
          const response = await this.invitationService.createInvitation({
            email: state.email!,
            name: state.name!,
          });
          switch (response.type) {
            case 'failure':
              return setState({
                ...state,
                processing: false,
                errorMessage: response.message,
              });
            case 'success':
              return observer.next({
                type: 'invite_request_success',
              });
          }
        } catch (e) {
          // todo log error 
          console.error(e);
          setState({
            ...state,
            processing: false,
            errorMessage: 'unexpected error',
          });
        }
    }
  }

  private validate({
    name, 
    email,
    confirmEmail,
  }: {
    name?: string,
    email?: string,
    confirmEmail?: string,
  }): string | undefined {
    if (name == null || name.trim().length === 0) {
      return 'No name specified';
    }
    if (email == null || email.trim().length === 0) {
      return 'No email specified';
    }
    if (confirmEmail == null || confirmEmail.trim().length === 0) {
      return 'No confirmation email specified';
    }
    // from https://regexr.com/3e48o
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      return 'Invalid email address';
    }
    if(confirmEmail.trim() !== email.trim()) {
      return 'Confirmation email does not match';
    }
  }
}