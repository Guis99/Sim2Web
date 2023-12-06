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
    console.log(strings)
    console.log(stringLengths);

    const utf8Encoder = new TextEncoder();
    const stringData = strings.map(str => utf8Encoder.encode(str));
    console.log(stringData);

    const totalLength = stringData.reduce((acc, strBytes) => acc + strBytes.length, 0);
    console.log(totalLength);

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
    console.log('preca1');

    const rows = ints[0] * ints[2] + 1;
    console.log('preca2');
    const cols = ints[1] * ints[3] + 1;
    console.log('preca3');
    const solutionPtr = Module._captureArgs(stringDataPtr, stringLengthsPtr, strings.length, meshDataPtr);

    const xDataPtr = Module._getMatrixPtr(solutionPtr, 0);
    const yDataPtr = Module._getMatrixPtr(solutionPtr, 1);
    const solnDataPtr = Module._getMatrixPtr(solutionPtr, 2);

    const x = Module.HEAPF64.subarray(xDataPtr >> 3, (xDataPtr >> 3) + rows);
    const y = Module.HEAPF64.subarray(yDataPtr >> 3, (yDataPtr >> 3) + cols);
    var z = Module.HEAPF64.subarray(solnDataPtr >> 3, (solnDataPtr >> 3) + rows * cols);

    console.log('x',x);
    console.log('y',y);
    console.log('z',z);

    var xVals = new Array(cols);
    var yVals = new Array(cols);
    var zVals = new Array(cols);

    for (var i = 0; i < cols; i++) {
        yVals[i] = new Array(rows).fill(y[i] || 0); // Filling with the last value of y
    }

    for (var i = 0; i < cols; i++) {
        xVals[i] = new Array(rows).fill(0).map(function(_, j) {
            return x[j] || 0; // Use x values for each column
        });
    }

    // var zVals = new Array(cols).fill(0).map(function() {
    //     return z.splice(0, rows);
    // });
    var zVals = new Array(cols).fill(0).map(function() {
        // Create a Float64Array view of the first 'rows' elements in z
        var subarray = new Float64Array(z.subarray(0, rows));
    
        // Update 'z' to exclude the elements that were just extracted
        z = z.subarray(rows);
    
        return subarray;
    });

    console.log('x',xVals);
    console.log('y',yVals);
    console.log('z',zVals);

    var data = [{
        z: zVals,
        x: xVals,
        y: yVals,
        type: 'surface'
    }];

    Plotly.newPlot('plotDiv', data);

    console.log('debug13');

    Module._free(stringDataPtr);
    console.log('debug14');
    Module._free(stringLengthsPtr);
    console.log('debug15');
    Module._free(meshDataPtr);
    console.log('debug16');
    Module._free(solutionPtr);
    console.log('debug17');
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

    inputValue = ["y^2/5","sin(3*pi*x/4)","0","sin(pi*x/4)","0"];
    // meshInputs = [15,15,4,4];
    meshInputs = [55,55,2,2];
    // meshInputs = [1,1,20,20];

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
