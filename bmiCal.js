const readline = require('node:readline');
module.exports = {getResult, collectUserData, getUserInput, calculateBMI, getCategory, heightInInches, poundsToKg};

function getUserInput(question){

  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve) => {
    read.question(question, (input) => {
      // Close the readline interface after collecting input
      read.close();
      resolve(input);
    })

  
  })
}
function heightInInches(heightFeet, heightInches){
    const tallest = 107;
    let totalHeightInInches = heightFeet * 12 + heightInches;
    if(totalHeightInInches > tallest)
    {
        totalHeightInInches = null;
        console.log("This height is outside of range!");
    }
    return totalHeightInInches;
}
function poundsToKg(weight){
    let weightInKg = weight * 0.453592; // Convert pounds to kilograms
    const heaviest = 635;
    if(weightInKg > heaviest || weightInKg === 0 )
    {
        weightInKg = null;
        console.log("This weight is outside of range!");
    }
    return weightInKg;
}

function calculateBMI(weightInKg, totalHeightInInches) {
  
  const heightInMeters = totalHeightInInches * 0.0254; // Convert inches to meters
  
  const bmiTemp = weightInKg / (heightInMeters * heightInMeters);
  const bmi = parseFloat(bmiTemp.toFixed(1));
  return bmi;
}

function getCategory(bmi) {
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal weight";
  } else if (bmi >= 25 && bmi <= 29.9) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

function getResult(bmi, category){
  if(isNaN(bmi) || bmi > 100 || bmi <= 0)
  {
  // Display result
    const impossibleMsg = "Your BMI is impossible please re-enter your data and enter a reasonable input";
    console.log(impossibleMsg);
    return impossibleMsg;
  }
  else{
    const successMsg = `Your BMI is ${bmi}, which falls into the category of ${category}.`;
    console.log(successMsg);
    return successMsg;
  }
}

async function collectUserData() {

  const weight = await getUserInput('Enter your weight in pounds: ');
  const heightFeet = await getUserInput('Enter your height in feet: ');
  const heightInches = await getUserInput('Enter your height in inches: ');

  // Perform calculations
  const weightInKg = poundsToKg(parseFloat(weight));
  const totalHeightInInches = heightInInches(parseInt(heightFeet), parseInt(heightInches));
  const bmi = calculateBMI(weightInKg, totalHeightInInches);
  const category = getCategory(bmi);
  getResult(bmi, category);
}

// Call the function to collect user data
collectUserData();