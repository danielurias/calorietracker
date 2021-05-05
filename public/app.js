intakeId = null;

function totalCals(data) {
  var total = 0;
  for (i = 0; i < data.length; i++) {
      total += data[i].calories;
  }
  return total;
}

function createIntakeOnServer(intake) {
  var intakeData = "category=" + encodeURIComponent(intake.category);
  intakeData += "&food=" + encodeURIComponent(intake.food);
  intakeData += "&serving=" + encodeURIComponent(intake.serving);
  intakeData += "&calories=" + encodeURIComponent(intake.calories);

  return fetch("http://localhost:8080/intakes", {
    method: "POST",
    body: intakeData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function updateIntakeOnServer(intake) {
  var intakeData = "category=" + encodeURIComponent(intake.category);
  intakeData += "&food=" + encodeURIComponent(intake.food);
  intakeData += "&serving=" + encodeURIComponent(intake.serving);
  intakeData += "&calories=" + encodeURIComponent(intake.calories);

  return fetch("http://localhost:8080/intakes/" + intake.id, {
    method: "PUT",
    body: intakeData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function deleteIntakeFromServer(intakeId) {
  return fetch("http://localhost:8080/intakes/" + intakeId, {
		method: "DELETE"
	});
}

function getIntakeListFromServer() {
  return fetch("http://localhost:8080/intakes");
}

var app = new Vue({
  el: '#app',
  data: {
    totalCalories: '',
    intakeCategory: '',
    intakeFood: '',
    intakeServing: '',
    intakeCalories: '',
    intakes: [],
    activeColor: {
      color: 'red',
    },
    errorMessages: []
  },
  methods: {
    validateIntake: function () {
      this.errorMessages = [];

      if (this.intakeCategory.length == 0) {
        this.errorMessages.push("Specify a category.");
      }
      if (this.intakeFood.length == 0) {
        this.errorMessages.push("Specify a food.");
      }
      if (this.intakeServing.length == 0) {
        this.errorMessages.push("Specify a serving.");
      }
      if (this.intakeCalories.length == 0) {
        this.errorMessages.push("Specify calories.");
      }
      return this.errorMessages == 0;
    },
    submitNewIntake: function () {
      if (!this.validateIntake()) {
        return;
      }
      createIntakeOnServer({
        category: this.intakeCategory,
        food: this.intakeFood,
        serving: this.intakeServing,
        calories: this.intakeCalories
      }).then((response) => {
        if (response.status == 201) {
          this.loadIntakes();
        } else {
          alert("There was a problem saying your entry. Enter a correct category from the list.");
        }
      });
      this.intakeCategory = "";
      this.intakeFood = "";
      this.intakeServing = "";
      this.intakeCalories = "";
    },
    loadIntakes: function () {
      getIntakeListFromServer().then((response) => {
        response.json().then((data) => {
          console.log("entries loaded from server:", data);
          this.intakes = data;
          this.totalCalories = totalCals(data);
        });
      });
    },
    updateIntake: function (intake) {
      updateIntakeOnServer({
        category: this.intakeCategory,
        food: this.intakeFood,
        serving: this.intakeServing,
        calories: this.intakeCalories,
        id: intakeId
      }).then((response) => {
        if (response.status == 200) {
          this.loadIntakes();
        } else {
          alert("Loading resource failed.");
        }
      });
      this.intakeCategory = "";
      this.intakeFood = "";
      this.intakeServing = "";
      this.intakeCalories = "";
    },
    editIntake: function (intake) {
      intakeId = intake._id;
      this.intakeCategory = intake.category;
      this.intakeFood = intake.food;
      this.intakeServing = intake.serving;
      this.intakeCalories = intake.calories;
      console.log("edit this this entry:", intake);
    },
    removeIntake: function (intake) {
      console.log("delete this entry:", intake);
      deleteIntakeFromServer(intake._id).then((response) => {
        if (response.status == 200) {
          this.loadIntakes();
        } else {
          alert("Loading resource failed.");
        }
      });
    }
  },
  created: function () {
    this.loadIntakes();
  }
});