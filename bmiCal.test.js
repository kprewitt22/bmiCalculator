const readline = require('node:readline');
const { getResult, collectUserData, getUserInput, calculateBMI, getCategory, heightInInches, poundsToKg } = require('./bmiCal');

// Mocking readline interface for testing
jest.mock('node:readline', () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn()
  }))
}));
describe('BMI Calculator', () => {

    describe('heightInInches', () => {

        test('calculate height in total inches for 6 inches', () => {
            expect(heightInInches(0, 6)).toBe(6)
        })
        test('calculates the total height correctly for 5 feet and 0 inches', () => {
            expect(heightInInches(5, 0)).toBe(60);
          })
        
          test('calculates the total height correctly for 0 feet and 6 inches', () => {
            expect(heightInInches(6, 6)).toBe(78);
          })

          test('calculates the total height correctly for the tallest human', () => {
            expect(heightInInches(8, 11)).toBe(107);
          })
          test('calculates the total height correctly for 10 feet and 11 inches', () => {
            expect(heightInInches(10, 11)).toBe(null);
          })
    })
    describe('poundsToKg', () => {

        test('converts 0 pounds to kilograms', () => {
          expect(poundsToKg(0)).toBe(null);
        })

        test('converts 10 pounds to kilograms', () => {
            expect(poundsToKg(10)).toBeCloseTo(4.53592);
        })
        
        test('converts 100 pounds to kilograms', () => {
          expect(poundsToKg(100)).toBeCloseTo(45.3592);
        })
      
        test('converts 200 pounds to kilograms', () => {
          expect(poundsToKg(200)).toBeCloseTo(90.7184);
        })
        test('converts 400 pounds to kilograms', () => {
            expect(poundsToKg(400)).toBeCloseTo(181.437);
        })
        test('converts 1500 pounds to kilograms', () => {
            expect(poundsToKg(1500)).toBe(null);
        })
        
      })
    describe('calculateBMI', () => {

      test('calculates BMI for 0 kg and 0 inches', () => {
        expect(calculateBMI(0, 0)).toBe(NaN);
      })
    
    
      test('calculates BMI for 50 kg and 72 inches', () => {
        expect(calculateBMI(50, 72)).toBeCloseTo(14.9);
      })
      test('calculates BMI  for 82 kg and 73 inches', () => {
        expect(calculateBMI(82, 73)).toBeCloseTo(23.9);
      })
      test('calculates BMI for 90 kg and 65 inches', () => {
        expect(calculateBMI(90, 65)).toBeCloseTo(33);
      })
    
      test('calculates BMI for 80 kg and 68 inches', () => {
        expect(calculateBMI(80, 68)).toBeCloseTo(26.8);
      })
    })
  
    describe('getCategory', () => {
      test('returns correct category for Underweight BMI', () => {
        expect(getCategory(16)).toBe('Underweight');
      })//lower boundary
      test('returned correct category for Normal weight BMI', () => {
        expect(getCategory(24.9)).toBe('Normal weight');
      })//upper boundary
      test('returned correct category for Overweight BMI', () => {
        expect(getCategory(25)).toBe('Overweight');
      })//lower boundary
      test('returned correct category for Overweight BMI', () => {
        expect(getCategory(29.9)).toBe('Overweight');
      })//upper boundary
      test('returned correct category for Obese BMI', () => {
        expect(getCategory(30)).toBe('Obese');
      })//lower
    })
    describe('getUserInput', () => {
      // Test the getUserInput function
      test('resolves with user input', async () => {
        const question = 'Enter your weight in pounds: ';
        const userInput = '150';
        const mockReadlineInterface = {
          question: jest.fn((q, cb) => cb(userInput)),
          close: jest.fn()
        };
        jest.spyOn(readline, 'createInterface').mockReturnValue(mockReadlineInterface);
        
        const input = await getUserInput(question);
        expect(input).toBe(userInput);
      });
    
      test('rejects with an error', async () => {
        const question = 'Enter your weight in pounds: ';
        const errorMsg = 'Error occurred';
        const mockReadlineInterface = {
          question: jest.fn((q, cb) => cb(new Error(errorMsg))),
          close: jest.fn()
        };
        jest.spyOn(readline, 'createInterface').mockReturnValue(mockReadlineInterface);
        
        const mockConsoleLog = jest.spyOn(console, 'log');
        await getUserInput(question);
        expect(mockConsoleLog).toHaveBeenCalledWith(expect.any(Function));
        });
    }) 
    describe('Results test', () => {
      test('Returns error if NaN, bmi > 100, bmi <= 0', () => {
        const impossibleMsg = "Your BMI is impossible please re-enter your data and enter a reasonable input";
        expect(getResult('c', 'Obese')).toBe(impossibleMsg);

      })

      test('Returns error if bmi > 100', () => {
        const impossibleMsg = "Your BMI is impossible please re-enter your data and enter a reasonable input";
        expect(getResult(1000, 'Obese')).toBe(impossibleMsg); 
      })
      test('Returns results if bmi >= 0', () => {
        const impossibleMsg = "Your BMI is impossible please re-enter your data and enter a reasonable input";
        expect(getResult(0, 'Underweight')).toBe(impossibleMsg);
      })

      test('Returns results message for Underweight BMI (lower boundary)', () => {
        const bmi = 15.9;
        const category = getCategory(bmi);
        const successMsg = `Your BMI is ${bmi}, which falls into the category of ${category}.`;
        expect(getResult(bmi, category)).toBe(successMsg);
      })
    
      test('Returns results message for Normal weight BMI (upper boundary)', () => {
        const bmi = 24.9;
        const category = getCategory(bmi);
        const successMsg = `Your BMI is ${bmi}, which falls into the category of ${category}.`;
        expect(getResult(bmi, category)).toBe(successMsg);
      })
    
      test('Returns results message for Overweight BMI (lower boundary)', () => {
        const bmi = 25;
        const category = getCategory(bmi);
        const successMsg = `Your BMI is ${bmi}, which falls into the category of ${category}.`;
        expect(getResult(bmi, category)).toBe(successMsg);
      })
    
      test('Returns results message for Overweight BMI (upper boundary)', () => {
        const bmi = 29.9;
        const category = getCategory(bmi);
        const successMsg = `Your BMI is ${bmi}, which falls into the category of ${category}.`;
        expect(getResult(bmi, category)).toBe(successMsg);
      })
    
      test('Returns results message for Obese BMI (lower boundary)', () => {
        const bmi = 30;
        const category = getCategory(bmi);
        const successMsg = `Your BMI is ${bmi}, which falls into the category of ${category}.`;
        expect(getResult(bmi, category)).toBe(successMsg);
      })
    })

    /*describe('Collect user data',() => {
      test()
    })*/
  })