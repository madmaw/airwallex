import { CreateInvitationRequest, CreateInvitationResponse, InvitationService } from "../invitation_service";

type ErrorResponse = {
  errorMessage: string,
};

export class HttpInvitationService implements InvitationService {
  constructor(
    private readonly url: string = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth',
    private readonly doFetch: typeof fetch = fetch,
  ) {

  }

  async createInvitation({
    email,
    name,
  }: CreateInvitationRequest): Promise<CreateInvitationResponse> {
    const response = await this.doFetch(this.url, {
      method: 'POST',
      mode: "cors", 
      cache: "no-cache", 
      credentials: "same-origin", 
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", 
      referrerPolicy: "no-referrer", 
      body: JSON.stringify({
        email,
        name,
      }),
    });
    switch (response.status) {
      case 200:
        return {
          type: 'success',
        };
      case 400:
        const errorResponse: ErrorResponse = await response.json();
        return {
          type: 'failure',
          message: errorResponse.errorMessage,
        };
      default:
        return {
          type: 'failure',
          message: response.statusText,
        };
    }
  }
}