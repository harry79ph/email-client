const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "working" });
});

app.post(`/${process.env.END_POINT}`, (req, res) => {
  const { name, email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  const htmlHandler = (name, email, message) =>
    `<h3 style="color:#a93226;">${name}, from ${email}</h3><p style="color:#1b2631;">${message}</p>`;
  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL,
    subject: subject,
    html: htmlHandler(name, email, message),
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ msg: "error" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ msg: "success" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
