const nodemailer = require("nodemailer");
const sendEmail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Church Contact] ${subject}`,
    html: `<h2>Message from ${name}</h2><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
  });
};
module.exports = sendEmail;
