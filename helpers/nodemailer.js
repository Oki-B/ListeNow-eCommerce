import "dotenv/config";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER_EMAIL = process.env.USER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function sendEmail (to, subject, context, template) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // configure handlebars plugin
    const hbsOptions = {
      viewEngine: {
        partialsDir: "./assets/",
        defaultLayout: false,
      },
      viewPath: "./assets/",
    };

    transporter.use("compile", hbs(hbsOptions));

    const mailOptions = {
      from: USER_EMAIL,
      to,
      subject,
      template,
      context,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// sendEmail(
//   "okisitampan@gmail.com",
//   "Purchase Confirmation",
//   {
//     userName: 'Elektronik Digital Jakarta',
//     productName: 'BeatzElite 100',
//     productImage: 'https://image.pollinations.ai/prompt/productpictureofComfortable%20headphones%20with%2040-hour%20battery%20life%20and%20deep%20bass%20mode?width=640&height=640&nologo=true',
//     productPrice: 'Rp 710.000,00',
//     productQuantity: 1,
//     totalPurchase: 'Rp 710.000,00',
//     userEmail: 'digital@mail.com',
//     storeName: 'Gadget Maestro Surabaya',
//     storeLocation: 'Surabaya, Jawa Timur',
//     storeImage: 'https://image.pollinations.ai/prompt/HeadphonestorenamedGadgetMaestroSurabaya?width=640&height=400&nologo=true'
//   },
//   "invoiceEmail"
// );

