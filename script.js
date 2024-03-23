const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit',calculateCalories);
clearButton.addEventListener('click', clearForm);

function cleanInputString(str) {
    const regex = /[+-\s]/g;        //a string of text that lets you create patterns that help match, locate, and manage text.
    return str.replace(regex, '');
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i;       
    return str.match(regex);
}

function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);        //  ``  --> Template Literal
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length +1 ; //+1 to start with 1 not 0
    let HTMLString = `
        <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
        <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"></input>
        <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
        <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories"></input>
        `;
    
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function getCaloriesFromInputs(list){   
    let calories =0;
    for(const item of list){    //for...of loop //NodeList and Arrays
                                //A NodeList is a list of elements like an array.
        const currVal = cleanInputString(item.value); 
        const invalidInputMatch = isInvalidInput(currVal);
        if(invalidInputMatch){
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null; 
        }
        calories+= Number(currVal);     //The Number constructor is a function that converts a value to a number. If the value cannot be converted, it returns NaN which stands for "Not a Number".
    }
    return calories;
}

function calculateCalories(e){
    e.preventDefault();         
            //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.     
            /*
            this can be useful when:
                + Clicking on a "Submit" button, prevent it from submitting a form
                + Clicking on a link, prevent the link from following the URL 

                !!  Not all events are cancelable.  !!
            */                  
            //Calling preventDefault() during any stage of event flow cancels the event, meaning that any default action normally taken by the implementation as a result of the event will not occur.
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
            //A NodeList is an array-like, which means you can iterate through it and it shares some common methods with an array. For your getCaloriesFromInputs function, an array will work for the argument just as well as a NodeList does.

    if(isError){
        return 0;
    }
    
    const consumedCalories = breakfastCalories+lunchCalories+dinnerCalories+snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

    const surplusOrDeficit = (remainingCalories<0) ? "Surplus" : "Deficit";

    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr/>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;          //Math.abs() will return the absolute value of a number.
    
    output.classList.remove("hide");        
}

function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));  
                //document.querySelectorAll returns a NodeList, which is array-like but is not an array.
                //the Array object has a .from() method that accepts an array-like and returns an array. 
        
    for(const container of inputContainers){
        container.innerHTML = "";
    }
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

