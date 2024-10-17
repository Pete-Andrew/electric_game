//Arrow functions 
//for (let shape of shapes) {}
//ternary 
//callback functions: 

//JavaScript callback is a function which is to be executed after another function has finished execution
//A callback is a function passed as an argument to another function. This technique allows a function to call another function
//A callback function can run after another function has finished

//Async functions: 

async function exampleFunction() {
  await someAsyncOperation(); // Wait for this async operation to complete
  console.log("This is logged after the async operation is done");
  
  // Rest of your code here
}

function someAsyncOperation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Async operation done");
      resolve();
    }, 1000);
  });
}

exampleFunction();

JS array methods
https://medium.com/@mandeepkaur1/a-list-of-javascript-array-methods-145d09dd19a0


