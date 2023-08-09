import { Mock, assert, beforeEach, describe, expect, it, vi } from "vitest";
import { HttpInvitationService } from "../http_invitation_service";

describe('HttpInvitationService', () => {
  let service: HttpInvitationService;
  let doFetch: Mock<Parameters<typeof fetch>, ReturnType<typeof fetch>>;
  const url = 'fake://url';
  const email = 'a@b.c';
  const name = 'abc';
  beforeEach(() => {
    doFetch = vi.fn();
    doFetch.mockResolvedValue({
      status: 200,
    } as any);
    service = new HttpInvitationService(url, doFetch);
  });

  it('passes through the request data', async () => {
    expect(doFetch).not.toHaveBeenCalled();
    await service.createInvitation({
      email,
      name
    });
    expect(doFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        body: `{"email":"${email}","name":"${name}"}`,
      }),
    );
  });

  it('reports success', async () => {
    doFetch.mockResolvedValueOnce({
      status: 200,
    } as any);
    const response = await service.createInvitation({
      email,
      name,
    });
    expect(response.type).toBe('success');
  });

  it('reports server error', async () => {
    const statusText = 'The server exploded';
    doFetch.mockResolvedValueOnce({
      status: 500,
      statusText,
    } as any);
    const response = await service.createInvitation({
      email,
      name,
    });
    assert(response.type === 'failure', 'expected failure response');
    expect(response.message).toBe(statusText);
  });

  it('reports validation error', async () => {
    const errorMessage = 'bad data';
    doFetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({
        errorMessage,
      }),
    } as any);
    const response = await service.createInvitation({
      email,
      name,
    });
    assert(response.type === 'failure', 'expected failure response');
    expect(response.message).toBe(errorMessage);
  });
});