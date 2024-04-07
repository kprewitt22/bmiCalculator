const express = require('express');
const app = express();
const path = require('path');

// Your code here
const { calculateBMI, getCategory, heightInInches, poundsToKg } = require('./bmiCal');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/bmi', (req, res) => {
  const { weight, heightFeet, heightInches } = req.body;
  const weightInKg = poundsToKg(parseFloat(weight));
  const totalHeightInInches = heightInInches(parseInt(heightFeet), parseInt(heightInches));
  const bmi = calculateBMI(weightInKg, totalHeightInInches);
  const category = getCategory(bmi);
// Send BMI result as JSON response
    if (isNaN(bmi) ||bmi > 100 || bmi <= 0) {
        res.send(`Your BMI is impossible please re-enter your data and enter a reasonable input`);
    } else {
        res.send(`Your BMI is ${bmi}, which falls into the category of ${category}.`); // Round BMI to one decimal place
        console.log("BMI", bmi);
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})