// import * as Plotly from '../node_modules/plotly.js';
// import {React} from './react'
var size = 100, x = new Array(size), y = new Array(size), z = new Array(size), i, j;

for(var i = 0; i < size; i++) {
	x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
  	z[i] = new Array(size);
}

for(var i = 0; i < size; i++) {
  	for(j = 0; j < size; j++) {
    	var r2 = x[i]*x[i] + y[j]*y[j];
    	z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2+1);
 	}
}

var data = [ {  
		z: z,
		x: x,
		y: y,
		type: 'contour'
	}
];

Plotly.newPlot('myDiv', data);

d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', function(err, rows){
function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var z_data=[ ]
for(i=0;i<24;i++)
{
  z_data.push(unpack(rows,i));
}

var data = [{
           z: z_data,
           type: 'surface'
        }];

var layout = {
  title: 'Mt Bruno Elevation',
  autosize: false,
  width: 500,
  height: 500,
  margin: {
    l: 65,
    r: 50,
    b: 65,
    t: 90,
  }
};
Plotly.newPlot('myDiv2', data, layout);
});

// Assuming you have the ability to load files (e.g., using XMLHttpRequest or Fetch API)

// Load x, y, and z data asynchronously
Promise.all([
    loadData('data/x.txt'),
    loadData('data/y.txt'),
    loadData('data/z.txt')
]).then(function(data) {
    var x = data[0]; // 1D array
    var y = data[1]; // 1D array
    var z = data[2]; // 2D array
    console.log(x);

    // Expand x and y to create a 2D grid
    var size = Math.max(x.length, y.length);
    console.log(size);
    var xGrid = new Array(size);
    var yGrid = new Array(size);

    for (var i = 0; i < size; i++) {
        yGrid[i] = new Array(size).fill(y[i] || 0); // Filling with the last value of y
    }

    for (var i = 0; i < size; i++) {
        xGrid[i] = new Array(size).fill(0).map(function(_, j) {
            return x[j] || 0; // Use x values for each column
        });
    }

    var zGrid = new Array(size).fill(0).map(function() {
        return z.splice(0, size);
    });

    console.log(xGrid);
    console.log(yGrid);
    console.log(zGrid);

    // Create Plotly surface plot
    var data = [{
        z: zGrid,
        x: xGrid,
        y: yGrid,
        type: 'surface'
    }];

    Plotly.newPlot('myDiv3', data);
}).catch(function(error) {
    console.error('Error loading data:', error);
});

// Function to load data from a file
function loadData(filename) {
    console.log('hello')
    return new Promise(function(resolve, reject) {
        // Assuming you have a way to load data (e.g., using XMLHttpRequest or Fetch API)
        // Replace the following code with your actual data loading logic
        // Example using Fetch API:
        fetch(filename)
            .then(response => response.text())
            .then(data => {
                // Parse data as needed (e.g., converting from string to array)
                // Replace the following line with your actual data parsing logic
                resolve(data.split('\n').map(Number));
            })
            .catch(error => reject(error));
    });
};
