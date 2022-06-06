const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "stmp.gmail.com",
  port: "587",
  auth: {
    user: "d3v1n302418@gmail.com",
    pass: "Devin0309",
  },
});

transporter.verify().then(console.log).catch(console.error);

const verificationTemplate = fs.readFileSync("verificationTemplate.html", 'utf-8');
const resetPasswordTemplate = fs.readFileSync("resetPasswordTemplate.html", 'utf-8');

const sendVerification = (recipient, username, token) => {
  const template = handlebars.compile(verificationTemplate);
  const link = `http://localhost:3000/confirmEmail/${token}`;

  var replacements = {
    username: username,
    verifyLink: link
  }

  transporter.sendMail({
    from: "d3v1n302418@gmail.com",
    to: recipient,
    subject: "ExampleSolves - Verify Email",
    html: template(replacements),
  });
};

const sendResetPassword = (recipient, username, token) => {
  const template = handlebars.compile(resetPasswordTemplate);
  const link = `http://localhost:3000/resetPassword/${token}`;

  var replacements = {
    username: username,
    resetLink: link
  }

  transporter.sendMail({
    from: "d3v1n302418@gmail.com",
    to: recipient,
    subject: "ExampleSolves - Reset Password",
    html: template(replacements),
  });
};

module.exports = { sendVerification, sendResetPassword };
