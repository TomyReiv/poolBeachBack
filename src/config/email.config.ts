import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import inlineCss from 'inline-css';
import { GMAIL_PASS, GMAIL_USER } from '../utils/constant';

interface EmailOptions {
  to: string;
  subject: string;
  templateVars: Record<string, string>; // Variables dinámicas a reemplazar
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

const TEMPLATE_PATH = path.join(__dirname, '../../templates/emailTemplate.html'); 
const EMAIL_TEMPLATE = fs.readFileSync(TEMPLATE_PATH, 'utf-8'); 

function generateHtml( templateVars: Record<string, string>): string {
    let template = EMAIL_TEMPLATE;

  for (const [key, value] of Object.entries(templateVars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, value);
  }

  return template;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    let htmlContent = generateHtml(options.templateVars);

    // Incrustar CSS inline
    htmlContent = await inlineCss(htmlContent, { url: ' ' });

  const mailOptions = {
    from: GMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ', info.response);
  } catch (error) {
    console.error('Error enviando el correo: ', error);
    throw new Error('No se pudo enviar el correo');
  }
}
