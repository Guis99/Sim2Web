let Module;

export function setEmscriptenModule(module) {
    Module = module;
}

// export function handleInput(inputValue) {
//     console.log("Input value:", inputValue);

//     // Call the WebAssembly function to create the matrix
//     const sizeSq = parseInt(inputValue);
//     const matrixInfo = Module._createMatrix(sizeSq);
//     console.log(matrixInfo);

//     // Access the matrix data in JavaScript
//     const rows = sizeSq;
//     const cols = sizeSq;
//     const dataPtr = Module._getDataPtr(matrixInfo);
//     // const matrixData = Module.HEAPF64.subarray(dataPtr, (dataPtr) + rows * cols);
//     const matrixData = Module.HEAPF64.subarray(dataPtr >> 3, (dataPtr >> 3) + rows * cols);

//     // Do something with the matrix data
//     console.log("Matrix data:", matrixData);

//     // Free the allocated memory when done
//     const matrixPtr = Module._getMatrixPtr(matrixInfo);
//     Module._freeMatrix(matrixPtr);
//     Module._freeStruct(matrixInfo);
// }

function sendStringArray(strings, ints) {
    const stringLengths = strings.map(str => str.length);

    const utf8Encoder = new TextEncoder();
    const stringData = strings.map(str => utf8Encoder.encode(str));

    const totalLength = stringData.reduce((acc, strBytes) => acc + strBytes.length, 0);

    const stringDataPtr = Module._malloc(totalLength);
    const stringLengthsPtr = Module._malloc(stringLengths.length * 4); // Assuming int is 4 bytes

    let offset = 0;
    let lengthsOffset = 0;

    stringData.forEach((strBytes, index) => {
        Module.HEAPU8.set(strBytes, stringDataPtr + offset);
        offset += strBytes.length;

        // Copy the string length to the allocated memory
        Module.HEAP32.set([strBytes.length], (stringLengthsPtr + lengthsOffset) / 4) // Assuming int is 4 bytes
        lengthsOffset += 4; // Move to the next int
    });

    const numInts = ints.length;
    console.log(numInts);
    console.log(ints);
    const meshDataPtr = Module._malloc(numInts * 4);

    let meshOffset = 0;
    ints.forEach((intVal, index) => {
        // Copy the string length to the allocated memory
        console.log(intVal);
        Module.HEAP32.set([intVal], (meshDataPtr + meshOffset) / 4) // Assuming int is 4 bytes
        meshOffset += 4; // Move to the next int
    });

    Module._captureArgs(stringDataPtr, stringLengthsPtr, strings.length, meshDataPtr);

    Module._free(stringDataPtr);
    Module._free(stringLengthsPtr);
    Module._free(meshDataPtr);
}

// function sendString(str) {
//     const utf8Encoder = new TextEncoder();
//     const stringData = utf8Encoder.encode(str);

//     const stringLength = stringData.length;

//     const stringDataPtr = Module._malloc(stringLength);
//     const stringLengthsPtr = Module._malloc(4); // Assuming int is 4 bytes

//     Module.HEAPU8.set(stringData, stringDataPtr);

//     // Copy the string length to the allocated memory
//     Module.HEAP32.set([stringLength], stringLengthsPtr / 4) // Assuming int is 4 bytes

//     Module._printString(stringDataPtr, stringLengthsPtr);

//     Module._free(stringDataPtr);
//     Module._free(stringLengthsPtr);
// }

export function handleButtonClick() {
    // Get the value from the input box
    var inputValue;

    var dashboard = getDashboard('primary');
    console.log(dashboard);

    var inputElements = dashboard.querySelectorAll('input');
    var children = dashboard.children;
    console.log(children)

    // Iterate over each input element
    inputElements.forEach(function(input) {
        // Perform some action on each input element
        // For example, you can access input.value or do something else
        console.log('Value of input:', input.value);
        // Perform your desired action here
    });

    // Call the handleInput function with the input value
    // let inputVal = document.getElementById("mat").value;
    // handleInput(inputVal);

    inputValue = [document.getElementById("source").value,
                    document.getElementById("bc1").value,
                    document.getElementById("bc2").value,
                    document.getElementById("bc3").value,
                    document.getElementById("bc4").value];

    var meshInputs = [document.getElementById("nex").value,
                    document.getElementById("ney").value,
                    document.getElementById("xdeg").value,
                    document.getElementById("ydeg").value];

    sendStringArray(inputValue, meshInputs);
}

function getDashboard(name) {
    var dashboardDivs = document.querySelectorAll('.dashboard');

    // Filter the divs to only include those with id "primary"
    var primaryDashboardDivs = Array.from(dashboardDivs).filter(function(div) {
        return div.id === name;
    });

    // Now, primaryDashboardDivs contains all divs with class "dashboard" and id "primary"
    return primaryDashboardDivs[0];
}
