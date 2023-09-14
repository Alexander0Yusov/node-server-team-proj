const Mailgun = require("mailgun.js");
const formData = require("form-data");

require("dotenv").config();

const { MAILGUN_APIKEY, DOMAIN } = process.env;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: MAILGUN_APIKEY });

const sendEmail = async (data) => {
  const email = {
    ...data,
    from: "Demo User <yusovsky2@gmail.com>",
  };

  await client.messages
    .create(DOMAIN, email)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });

  return true;
};

module.exports = sendEmail;
