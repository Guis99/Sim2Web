// import * as Plotly from '../node_modules/plotly.js';
// import {React} from './react'

import { handleInput, handleButtonClick, setEmscriptenModule } from './click.js';

// Set the Emscripten module when it is ready
Module.onRuntimeInitialized = function () {
    setEmscriptenModule(Module);
};

document.getElementById('submitButton').addEventListener('click', function() {
    handleButtonClick();
});
