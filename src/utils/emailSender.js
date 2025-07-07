const { EmailClient } = require('@azure/communication-email');

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

// Cambia esto por el email de tu dominio de Azure (puedes verlo en el portal de Azure)
const SENDER_EMAIL = "DoNotReply@ccb81280-9d36-4d77-9b0f-da30a6396a2d.azurecomm.net";

// ✔ Función para recuperación de contraseña (ya la tienes)
const enviarCorreoRecuperacion = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const message = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: 'Recupera tu contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafbfc;">
          <h2 style="color: #e4572e; margin-top: 0;">Recuperación de contraseña</h2>
          <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #e4572e; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 16px 0;">Restablecer contraseña</a>
          <p style="font-size: 14px; color: #555;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <p style="font-size: 14px; color: #555;">O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; font-size: 13px;"><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color: #888; font-size: 12px;">Este enlace expirará en 1 hora.</p>
        </div>
      `
    },
    recipients: {
      to: [{ address: email }]
    }
  };
  const poller = await emailClient.beginSend(message);
  const result = await poller.pollUntilDone();
  if (result.status !== 'Succeeded') {
    throw new Error('No se pudo enviar el correo');
  }
};

// 🆕 Función para verificación de cuenta
const enviarCorreoVerificacion = async (email, nombre, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verificar?token=${token}`;
  const message = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: 'Verifica tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafbfc;">
          <h2 style="color: #2d7ff9; margin-top: 0;">¡Bienvenido, ${nombre}!</h2>
          <p style="font-size: 16px;">Gracias por registrarte. Para activar tu cuenta, haz clic en el botón de abajo:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #2d7ff9; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 16px 0;">Activar cuenta</a>
          <p style="font-size: 14px; color: #555;">O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; font-size: 13px;"><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p style="color: #888; font-size: 12px;">Este enlace es válido por tiempo limitado.</p>
        </div>
      `
    },
    recipients: {
      to: [{ address: email }]
    }
  };
  const poller = await emailClient.beginSend(message);
  const result = await poller.pollUntilDone();
  if (result.status !== 'Succeeded') {
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = {
  enviarCorreoRecuperacion,
  enviarCorreoVerificacion
};

