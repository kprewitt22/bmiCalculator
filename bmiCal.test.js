const { calculateBMI, getCategory, heightInInches, poundsToKg } = require('./bmiCal');

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
          question: jest.fn((q, cb) => cb(errorMsg)),
          close: jest.fn()
        };
        jest.spyOn(readline, 'createInterface').mockReturnValue(mockReadlineInterface);
        
        try {
          await getUserInput(question);
        } catch (error) {
          expect(error).toBe(errorMsg);
        }
      });
    });
    
    describe('collectUserData', () => {
      test('displays BMI result for valid input', async () => {
        const weight = '150';
        const heightFeet = '5';
        const heightInches = '6';
        const mockGetUserInput = jest.fn()
          .mockResolvedValueOnce(weight)
          .mockResolvedValueOnce(heightFeet)
          .mockResolvedValueOnce(heightInches);
        jest.spyOn(global, 'getUserInput').mockImplementation(mockGetUserInput);
        const mockPoundsToKg = jest.fn().mockReturnValue(68.0388555);
        const mockHeightInInches = jest.fn().mockReturnValue(66);
        const mockCalculateBMI = jest.fn().mockReturnValue(21.9);
        const mockGetCategory = jest.fn().mockReturnValue('Normal weight');
    
        await collectUserData();
    
        expect(mockPoundsToKg).toHaveBeenCalledWith(parseFloat(weight));
        expect(mockHeightInInches).toHaveBeenCalledWith(parseInt(heightFeet), parseInt(heightInches));
        expect(mockCalculateBMI).toHaveBeenCalledWith(68.0388555, 66);
        expect(mockGetCategory).toHaveBeenCalledWith(21.9);
        expect(console.log).toHaveBeenCalledWith('Your BMI is 21.9, which falls into the category of Normal weight.');
      });
    
      test('displays error message for invalid BMI', async () => {
        // Mock getUserInput to return invalid data
        const mockGetUserInput = jest.fn().mockResolvedValueOnce('-10')
          .mockResolvedValueOnce('5')
          .mockResolvedValueOnce('6');
        jest.spyOn(global, 'getUserInput').mockImplementation(mockGetUserInput);
    
        await collectUserData();
    
        expect(console.log).toHaveBeenCalledWith('Your BMI is impossible please re-enter your data and enter a reasonable input');
      });
    });
  })