const router = require("express").Router();
let Test = require("../models/test.model");
let Question = require("../models/question.model");

router.route("/start").post((req, res) => {
  const { studentId } = req.body;

  Question.aggregate([{ $sample: { size: 10 } }])
    .then((questions) => {
      const newTest = new Test({
        questions: questions.map((q) => q._id),
        student: studentId,
      });

      newTest
        .save()
        .then((test) => res.json(test))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/submit").post((req, res) => {
  const { testId, answers } = req.body;

  Test.findById(testId)
    .populate("questions")
    .then((test) => {
      let score = 0;
      test.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
          score++;
        }
      });

      test.score = score;
      test
        .save()
        .then(() => res.json({ score }))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:studentId").get((req, res) => {
  Test.find({ student: req.params.studentId })
    .then((tests) => res.json(tests))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
