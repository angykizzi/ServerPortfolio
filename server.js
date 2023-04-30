const express = require("express");
const path = require ('path')
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(express.static(path.join(__dirname+"/public")))
app.listen(3001, () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASSWORD
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});



router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: process.env.EMAIL_ADMIN,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
      console.log(error)
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});
