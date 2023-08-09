import { InvitationService } from 'services/invitation_service';
import { beforeEach, describe, expect, it, Mock, Mocked, vi } from 'vitest';
import { EventInviteRequestSuccess, InviteRequestController } from '../controller';
import { Observer } from 'rxjs';
import { EventInviteRequestSubmit, InviteRequestState } from '../view';

const EVENT_SUBMIT: EventInviteRequestSubmit = {
  type: 'invite_request_submit',
};

const EVENT_SUCCESS: EventInviteRequestSuccess = {
  type: 'invite_request_success',
};


describe('controller', () => {
  let invitationService: Mocked<InvitationService>;
  let controller: InviteRequestController;
  let observer: Mocked<Observer<EventInviteRequestSuccess>>;
  let setState: Mock<[InviteRequestState], void>;
  beforeEach(() => {
    invitationService = {
      createInvitation: vi.fn(),
    };
    observer = {
      next: vi.fn(),
      complete: vi.fn(),
      error: vi.fn(),
    };
    setState = vi.fn();
    controller = new InviteRequestController(invitationService);
  });

  describe('validation', () => {
    it.each([
      [
        'No name specified',
        {
          processing: false,
        },
      ],
      [
        'No email specified',
        {
          processing: false,
          name: 'A',
        },
      ],
      [
        'No confirmation email specified',
        {
          processing: false,
          name: 'A',
          email: 'a@b.com',
        },
      ],
      [
        'Confirmation email does not match',
        {
          processing: false,
          name: 'A',
          email: 'a@b.com',
          confirmEmail: 'c@b.com',
        },
      ],
      [
        'Invalid email address',
        {
          processing: false,
          name: 'A',
          email: 'a@b',
          confirmEmail: 'c@b.com',
        },
      ],
    ] as const)('fails validation when %s', async (errorMessage, state) => {
      await controller.process(
        EVENT_SUBMIT, 
        state,
        setState,
        observer,
      );
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({
        errorMessage,
      }));  
    });  
  });

  describe('invitation service', () => {
    const validEmail = 'a@b.com';
    const validName = 'A';
    const validState: InviteRequestState = {
      processing: false,
      name: validName,
      email: validEmail,
      confirmEmail: validEmail,
    };

    describe('success', () => {

      beforeEach(async () => {
        invitationService.createInvitation.mockResolvedValueOnce({
          type: 'success',
        });
        await controller.process(
          EVENT_SUBMIT,
          validState,
          setState,
          observer,
        );
      });
  
      it('calls the service', () => {
        expect(invitationService.createInvitation).toHaveBeenCalledTimes(1);
      });

      it('sets the state to processing', () => {
        expect(setState).toHaveBeenCalledWith(expect.objectContaining({
          processing: true,
        }));
      });

      it('does not report an error', () => {
        expect(setState).toHaveBeenCalledWith(expect.objectContaining({
          errorMessage: undefined,
        }));
      });

      it('produces an event', () => {
        expect(observer.next).toHaveBeenCalledWith(EVENT_SUCCESS);
      });
    });

    describe('failure', () => {
      const errorMessage = 'it bad';

      beforeEach(async () => {
        invitationService.createInvitation.mockResolvedValueOnce({
          type: 'failure',
          message: errorMessage,
        });
        await controller.process(
          EVENT_SUBMIT,
          validState,
          setState,
          observer,
        );
      });
  
      it('calls the service', () => {
        expect(invitationService.createInvitation).toHaveBeenCalledTimes(1);
      });

      it('sets the state to processing', () => {
        expect(setState).toHaveBeenNthCalledWith(1, expect.objectContaining({
          processing: true,
        }));
      });

      it('shows an error', () => {
        expect(setState).toHaveBeenNthCalledWith(2, expect.objectContaining({
          errorMessage,
        }));
      });

      it('does not produces a success event', () => {
        expect(observer.next).not.toHaveBeenCalledWith(EVENT_SUCCESS);
      });
    });
  });
});