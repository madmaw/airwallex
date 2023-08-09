export type CreateInvitationRequest = {
  name: string,
  email: string,
};

export type CreateInvitationResponse = {
  type: 'success',
} | {
  type: 'failure',
  message: string,
};

export interface InvitationService {
  createInvitation(req: CreateInvitationRequest): Promise<CreateInvitationResponse>;
}