const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplates");
const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");

const Survey = mongoose.model("survey");

module.exports = (app) => {
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting");
  });

  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send(surveys);
  });

  app.delete("/api/surveys/delete", requireLogin, async (req, res) => {
    const surveyId = req.body.surveyId;
    // Check if survey was created by user
    const survey = await Survey.findOne({
      _user: req.user.id,
      _id: surveyId,
    });

    if (survey === null) {
      res
        .status(400)
        .send("Request failed! The survey might not created by this user");
    }

    try {
      // Delete survey
      await survey.deleteOne();
      // Send response
      res.send(surveyId);
    } catch (error) {
      console.log("ERROR: ", error.message);
      res.status(500).send("Request failed! Something wrong on the server");
    }
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients
        .split(",")
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");
    console.log("REQ BODY", req.body);
    _.chain(req.body)
      .map(({ email, url }) => {
        console.log("EXTRACT BODY INFO: ", email, url);
        console.log("URL PATH NAME: ", new URL(url).pathname);
        const match = p.test(new URL(url).pathname);
        console.log("MATCH: ", match);
        if (match) {
          console.log("FOUND MATCH: ", match);
          return {
            surveyId: match.surveyId,
            choice: match.choice,
            email,
          };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      .each(async ({ surveyId, email, choice }) => {
        const result = await Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: {
                email: email,
                isResponded: false,
              },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.isResponded": true },
            lastResponded: new Date(),
          }
        ).exec();

        console.log("SAVE TO DATABASE RESULT: ", result);
      })
      .value();
    console.log("WEBHOOK ENDS");
    res.send({});
  });
};
