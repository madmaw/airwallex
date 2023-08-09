import * as React from 'react'
import { createRoot } from 'react-dom/client';
import { HttpInvitationService } from "./services/http/http_invitation_service";
import { App } from './app';

const invitationService = new HttpInvitationService();

window.onload = () => {
  const app = document.getElementById('app');
  const root = createRoot(app!);
  root.render(
    <App
      invitationService={invitationService}
      />
  );

};