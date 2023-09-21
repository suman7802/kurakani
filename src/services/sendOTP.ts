require('dotenv').config();
import nodemailer, {Transporter} from 'nodemailer';
import {google} from 'googleapis';
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    console.log('Creating transporter...');
    const oauth2Client = new OAuth2(
      process.env.NODEMAILER_CLIENT_ID,
      process.env.NODEMAILER_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.NODEMAILER_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log(err);
          reject();
        }
        resolve(token);
      });
    });

    console.log(accessToken);

    const transporter = nodemailer.createTransport({
      // @ts-ignore
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.USER_EMAIL,
        accessToken,
        clientId: process.env.NODEMAILER_CLIENT_ID,
        clientSecret: process.env.NODEMAILER_CLIENT_SECRET,
        refreshToken: process.env.NODEMAILER_REFRESH_TOKEN,
      },
    });

    console.log('Transporter created successfully.');
    return transporter;
  } catch (err) {
    console.error('Error creating transporter:', err);
    return err;
  }
};

let mailTransporter: Transporter;
(async () => {
  mailTransporter = (await createTransporter()) as Transporter;
})();

export const sendMailForOtp = (otp: string, email: string) => {
  const emailConfig = {
    from: process.env.USER_EMAIL,
    subject: 'OTP Verification',
    html: `Your OTP is : <b> ${otp} </b>`,
    to: email,
  };

  console.log(email, otp);

  return new Promise((resolve, reject) => {
    return mailTransporter.sendMail(emailConfig, (err, info) => {
      if (err) {
        return reject(err);
      }
      return resolve(info);
    });
  });
};
