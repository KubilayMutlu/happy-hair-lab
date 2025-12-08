import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");

function getEmailSubject(emailActionType: string): string {
  switch (emailActionType) {
    case 'signup':
      return 'Confirmez votre inscription - Happy Hair Lab';
    case 'recovery':
      return 'Réinitialisez votre mot de passe - Happy Hair Lab';
    case 'magiclink':
      return 'Votre lien de connexion - Happy Hair Lab';
    case 'email_change':
      return 'Confirmez votre nouvelle adresse email - Happy Hair Lab';
    default:
      return 'Happy Hair Lab';
  }
}

function getEmailContent(emailActionType: string) {
  switch (emailActionType) {
    case 'signup':
      return {
        title: 'Bienvenue chez Happy Hair Lab !',
        message: 'Merci de nous avoir rejoint ! Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et accéder à votre compte.',
        buttonText: 'Confirmer mon email',
      };
    case 'recovery':
      return {
        title: 'Réinitialisation de mot de passe',
        message: 'Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.',
        buttonText: 'Réinitialiser mon mot de passe',
      };
    case 'magiclink':
      return {
        title: 'Connexion à votre compte',
        message: 'Cliquez sur le bouton ci-dessous pour vous connecter à votre compte Happy Hair Lab.',
        buttonText: 'Me connecter',
      };
    case 'email_change':
      return {
        title: "Changement d'adresse email",
        message: 'Vous avez demandé à changer votre adresse email. Cliquez sur le bouton ci-dessous pour confirmer ce changement.',
        buttonText: 'Confirmer le changement',
      };
    default:
      return {
        title: 'Happy Hair Lab',
        message: 'Cliquez sur le bouton ci-dessous pour continuer.',
        buttonText: 'Continuer',
      };
  }
}

function generateEmailHtml(
  content: { title: string; message: string; buttonText: string },
  actionUrl: string,
  userEmail: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f3ef; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ef; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #0C0F25; letter-spacing: 2px;">HAPPY HAIR LAB</h1>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 0 24px 0;">
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;">
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #0C0F25;">${content.title}</h2>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; font-size: 16px; line-height: 26px; color: #333333;">Bonjour,</p>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0; font-size: 16px; line-height: 26px; color: #333333;">${content.message}</p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="${actionUrl}" style="display: inline-block; background-color: #0C0F25; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">${content.buttonText}</a>
            </td>
          </tr>
          
          <!-- Alternative link -->
          <tr>
            <td style="padding-bottom: 8px;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #666666;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #C9A86A; word-break: break-all;">${actionUrl}</p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 0 24px 0;">
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-bottom: 8px;">
              <p style="margin: 0; font-size: 12px; line-height: 20px; color: #999999;">Cet email a été envoyé à ${userEmail}. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 12px; line-height: 20px; color: #999999;">© 2024 Happy Hair Lab - Prendre soin de ses cheveux, naturellement et durablement.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Webhook signature verification using standardwebhooks
async function verifyWebhook(payload: string, headers: Record<string, string>, secret: string) {
  const { Webhook } = await import('https://esm.sh/standardwebhooks@1.0.0');
  const wh = new Webhook(secret);
  return wh.verify(payload, headers);
}

// Send email using Resend REST API
async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Happy Hair Lab <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send email');
  }

  return response.json();
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!hookSecret) {
    console.error('SEND_EMAIL_HOOK_SECRET not configured');
    return new Response(
      JSON.stringify({ error: { message: 'Webhook secret not configured' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return new Response(
      JSON.stringify({ error: { message: 'Resend API key not configured' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  
  console.log('Received auth email webhook');
  
  try {
    const webhookData = await verifyWebhook(payload, headers, hookSecret) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    };

    const { user, email_data } = webhookData;
    const { token_hash, redirect_to, email_action_type } = email_data;

    console.log(`Sending ${email_action_type} email to ${user.email}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const actionUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to || supabaseUrl}`;
    
    const content = getEmailContent(email_action_type);
    const html = generateEmailHtml(content, actionUrl, user.email);

    await sendEmail(user.email, getEmailSubject(email_action_type), html);
    
    console.log('Email sent successfully');
    
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error: unknown) {
    console.error('Error in send-auth-email function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        error: {
          http_code: 500,
          message: errorMessage,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
