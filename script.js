import { proteins, nonSweetFruits, fruits } from './foods.js';

let gender;
let age;
let height;
let currentWeight;
let goalWeight;
let weeksToGoal;
let activityLevel;
let goalDailyCalories; //same as a goal daily BMR
let regenerateButton = document.getElementById('regenerate-button');



const formContainer = document.getElementById("container");
const containerAfter = document.getElementById("container-after");
containerAfter.hidden = true;

const generateButton = document.querySelector(".submit-button");
generateButton.addEventListener("click", submitted);


function radio_used() {
  console.log(radio_state);
}

function submitted() {
  gender = document.querySelector('input[name="gender"]:checked').value;
  age = document.getElementById("age").value;
  let heightFeet = parseInt(document.getElementById("height-feet").value);
  let heightInch = parseInt(document.getElementById("height-inch").value);
  height = (heightFeet * 12) + heightInch;
  console.log(height);
  currentWeight = document.getElementById("current-weight").value;
  goalWeight = document.getElementById("goal-weight").value;
  weeksToGoal = document.getElementById("weeks").value;
  activityLevel = parseInt((document.getElementById("activity-level").value), 10); // Convert to integer

  calculateBMR();
  generateMeal();
  regenerateButton.addEventListener("click", submitted);
}




function calculateBMR() {
  let differenceInWeight = 0;

  if (currentWeight > goalWeight) {
    differenceInWeight = currentWeight - goalWeight;
  } else {
    differenceInWeight = goalWeight - currentWeight;
  }

  // calculate current BMR
  let bmr = (10 * (currentWeight / 2.2)) + (6.25 * (height * 2.54)) - (5 * age) + 5; //based on the Mifflin-St Jeor Equation
  console.log("bmr initial:", bmr);

  if (gender === "female") {
    bmr -= 166;
  }

  console.log("bmr after female:", bmr);

  console.log("activity level:", activityLevel);

  if (activityLevel === 1) {
    bmr *= 1.2;
  } else if (activityLevel === 2) {
    bmr *= 1.37;
  } else if (activityLevel === 3) {
    bmr *= 1.54;
  } else if (activityLevel === 4) {
    bmr *= 1.71;
  } else if (activityLevel === 5) {
    bmr *= 1.9;
  }

  console.log("bmr after activity level:", bmr);


  bmr = Math.round(bmr);
  console.log("bmr:", bmr);


  if (currentWeight > goalWeight) {
      let calorieDeficitPerDay = (differenceInWeight * 3500) / (weeksToGoal * 7);
      goalDailyCalories = Math.round(bmr - calorieDeficitPerDay);
  } else if (currentWeight < goalWeight) {
      let calorieSurplusPerDay = (differenceInWeight * 3500) / (weeksToGoal * 7);
      goalDailyCalories = Math.round(bmr + calorieSurplusPerDay);
  } else {
      goalDailyCalories = bmr;
  }

  console.log(bmr);
  console.log(goalDailyCalories);

}




function generateMeal() {
  // choose random meat
  const meatOptions = Object.keys(proteins);
  const recommendedMeat = meatOptions[Math.floor(Math.random() * meatOptions.length)]; //picks meat at random
  console.log(recommendedMeat);

  // Choosing random non-sweet fruit
  const nonSweetFruitOptions = Object.keys(nonSweetFruits);
  let recommendedNonSweetFruit = nonSweetFruitOptions[Math.floor(Math.random() * nonSweetFruitOptions.length)];
  console.log(recommendedNonSweetFruit);

  // Choosing random fruit
  const fruitOptions = Object.keys(fruits);
  let recommendedFruit = fruitOptions[Math.floor(Math.random() * fruitOptions.length)];
  console.log(recommendedFruit);

  // Calculate how many oz of the selected meat is needed in the meal
  const meatInLbs = Math.round((((goalDailyCalories * 0.92) / proteins[recommendedMeat]) / 16));

  console.log(goalDailyCalories);

  console.log(proteins[recommendedMeat]);
  console.log(recommendedMeat);


  console.log("meat in lbs:", meatInLbs);


  // Calculating how many cups of the recommended non-sweet fruit is needed in the meal
  let nonSweetFruitCups = Math.round((goalDailyCalories * 0.05) / nonSweetFruits[recommendedNonSweetFruit]);

  while (nonSweetFruitCups < 1) {
      let randomNonSweetFruitIndex = Math.floor(Math.random() * nonSweetFruitOptions.length);
      recommendedNonSweetFruit = nonSweetFruitOptions[randomNonSweetFruitIndex];
      nonSweetFruitCups = Math.round((goalDailyCalories * 0.05) / nonSweetFruits[recommendedNonSweetFruit]);
  }
  console.log("Nonsweet fruit:", recommendedNonSweetFruit);
  console.log("Nonsweet fruit in cups:", nonSweetFruitCups);


  // Calculating how many cups of the recommended fruit is needed in the meal
  let fruitCups = Math.round((goalDailyCalories * 0.03) / fruits[recommendedFruit]);
  
  while (fruitCups < 1) {
    let randomFruitIndex = Math.floor(Math.random() * fruitOptions.length);
    recommendedFruit = fruitOptions[randomFruitIndex];
    fruitCups = Math.round((goalDailyCalories * 0.03) / fruits[recommendedFruit]);
  }
  console.log(" fruit:", recommendedFruit);
  console.log("Fruit in cups:", fruitCups);


document.getElementById("meal-generated-label").textContent =
  "You could eat:";
document.getElementById("meal-generated-label-info-1").textContent =
  `${meatInLbs}lb(s) of ${recommendedMeat}`;
document.getElementById("meal-generated-label-info-2").textContent =
`${nonSweetFruitCups} cup(s) of ${recommendedNonSweetFruit}`;
document.getElementById("meal-generated-label-info-3").textContent =
`${fruitCups} cup(s) of ${recommendedFruit}`;
document.getElementById(
  "meal-generated-label-5"
).textContent = `Everyday to reach your goal in ${weeksToGoal} weeks.`;

// Update the meal-generated-label elements with the calculated meal information
formContainer.hidden = true;
containerAfter.hidden = false;
}