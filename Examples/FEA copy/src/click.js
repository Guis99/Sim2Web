let Module;

export function setEmscriptenModule(module) {
    Module = module;
}

export function handleInput(inputValue) {
    console.log("Input value:", inputValue);

    // Call the WebAssembly function to create the matrix
    const sizeSq = parseInt(inputValue);
    const matrixPtr = Module._createMatrix(sizeSq);

    // Access the matrix data in JavaScript
    const rows = sizeSq;
    const cols = sizeSq;
    const matrixData = Module.HEAPF64.subarray(matrixPtr >> 3, (matrixPtr >> 3) + rows * cols);

    // Do something with the matrix data
    console.log("Matrix data:", matrixData);

    // Free the allocated memory when done
    Module._free(matrixPtr);
}

export function handleButtonClick() {
    // Get the value from the input box
    var inputValue = document.getElementById("myInput").value;

    // Call the handleInput function with the input value
    handleInput(inputValue);
}
