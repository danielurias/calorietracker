const express = require('express');
const cors = require('cors');
const model = require('./model');

const app = express()
const port = process.env.PORT || 8080

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(cors())

app.get('/intakes', (req, res) => {
  model.Intake.find().then((intakes) => {
    console.log("Entries listed from DB:", intakes);
    res.json(intakes);
  });
});

app.delete('/intakes/:intakeId', (req, res) => {
  model.Intake.findByIdAndDelete({ _id: req.params.intakeId }).then((intake) => {
      if (intake) {
          res.json(intake)
      } else {
          res.sendStatus(404);
      }
  })
});

app.post('/intakes', (req, res) => {
  var intake = new model.Intake({
    category: req.body.category,
    food: req.body.food,
    serving: req.body.serving,
    calories: req.body.calories,
  });

  intake.save().then((intake) => {
    console.log('Entry created');
    res.status(201).json(intake);
  }).catch(function (err) {
    if (err.errors) {
      var messages = {};
      for (var e in err.errors) {
        messages[e] = err.errors[e].message;
      }
      res.status(422).json(messages);
    } else {
      res.sendStatus(500);
    }
  });
});

app.get('/intakes/:intakeId', (req, res) => {
  model.Intake.findOne({ _id: req.params.intakeId }).then((intake) => {
    if (intake) {
      res.json(intake);
    } else {
      res.sendStatus(404);
    }
  }).catch((err) => {
    res.sendStatus(400);
  })
})

app.put('/intakes/:intakeId', (req, res) => {
  model.Intake.findOne({ _id: req.params.intakeId }).then((intake) => {
    if (intake) {
      intake.category = req.body.category;
      intake.food = req.body.food;
      intake.serving = req.body.serving;
      intake.calories = req.body.calories;

      intake.save().then(() => {
        console.log('Entry updated');
        res.sendStatus(200);
      }).catch((err) => {
        res.sendStatus(500);
      });
    } else {
      res.sendStatus(404);
    }
  }).catch((err) => {
    res.sendStatus(400);
  })
})

app.listen(port, () => {
  console.log(`Listening at https://cryptic-beach-90817.herokuapp.com:${port}`)
})