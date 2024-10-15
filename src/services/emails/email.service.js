const nodemailer = require('nodemailer');
const { logger } = require('../../utils/logger');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // we use no secure port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify if the transporter is ready to send emails
transporter.verify((error, success) => {
  if (error) {
    logger.log("error", "Email transporter not reading for mailing:", error);
  } else {
    logger.log("info", 'Transporter ready for mailing.');
  }
});

// Function to send a verification email with a verification link
const sendVerificationEmail = async (user) => {
  const mailOptions = {
    from: 'no-reply@snz.ark',
    to: user.email,
    subject: 'Bienvenido al CRM de GetLavado :) !',
    html: emailVerify(user.firstName,user.lastName),
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, message: 'Mail sent successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to send Mail' };
  }
};

// Function to send a customizable email
const sendEmail = async (sender, to, subject, text, html) => {
  try {
    const mailOptions = {
      from: sender,
      to,
      subject,
      text,
      html,
    };
    const info = await transporter.sendMail(mailOptions);

    if (info.accepted) {
      return {
        message: 'email sent successfully',
        accepted: info.accepted,
        rejected: info.rejected,
        pending: info.pending,
      };
    }
    if (info.pending) {
      return {
        message: 'sending email ...',
        pending: info.pending,
        rejected: info.rejected,
      };
    }
    return { message: 'failed to send email' };
  } catch (error) {
    throw new Error('Failed to send Mail:', error);
  }
};

module.exports = { sendVerificationEmail, sendEmail };


const emailVerify =(name,surname)=>{
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a GetLavado CRM</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; }
          h1 { color: #333333; }
          p { color: #666666; }
          .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #999999; font-size: 12px; }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://getlavado.com//wp-content/uploads/2021/06/gl-logo-2.png" width="150"> 
          <h1>¡Bienvenido a GetLavado CRM!</h1>
          <p> <strong> ¡Hola ${name} ${surname}!, </strong> </p>
          <p>Nos complace darte la bienvenida a nuestra plataforma. Estamos emocionados de que te hayas unido a nosotros y esperamos que disfrutes de todas las funcionalidades y beneficios que ofrecemos.</p>
          <p>Para comenzar, te invitamos a visitar tu cuenta y explorar las distintas herramientas disponibles para ti.</p>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros. ¡Estamos aquí para ayudarte!</p>
          <p>Gracias por unirte a GetLavado CRM!.</p>
          <a href="http://localhost:5173/login" class="button">Acceder a mi cuenta</a>
          <div class="footer">
              <p>&copy; 2024 GetLavado CRM. Todos los derechos reservados.</p>
              <p>Lima | 455 255 55 | help@getlavado.com </p>
          </div>
      </div>
  </body>
  </html>
`
}