let Module;

export function setEmscriptenModule(module) {
    Module = module;
}

export function handleInput(inputValue) {
    console.log("Input value:", inputValue);

    // Call the WebAssembly function to create the matrix
    const sizeSq = parseInt(inputValue);
    const matrixInfo = Module._createMatrix(sizeSq);
    console.log(matrixInfo);

    // Access the matrix data in JavaScript
    const rows = sizeSq;
    const cols = sizeSq;
    const dataPtr = Module._getDataPtr(matrixInfo);
    // const matrixData = Module.HEAPF64.subarray(dataPtr, (dataPtr) + rows * cols);
    const matrixData = Module.HEAPF64.subarray(dataPtr >> 3, (dataPtr >> 3) + rows * cols);

    // Do something with the matrix data
    console.log("Matrix data:", matrixData);

    // Free the allocated memory when done
    const matrixPtr = Module._getMatrixPtr(matrixInfo);
    Module._freeMatrix(matrixPtr);
    Module._freeStruct(matrixInfo);
}

export function handleButtonClick() {
    // Get the value from the input box
    var inputValue = document.getElementById("myInput").value;

    // Call the handleInput function with the input value
    handleInput(inputValue);
}
