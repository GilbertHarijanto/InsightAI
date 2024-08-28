const ReadingTracker = require('./readingTracker.js');

// Create a new ReadingTracker instance
const tracker = new ReadingTracker({ rows: 5, cols: 10 }, 0.5, 50); // Reduced focus time to 50ms

// Function to generate fake gaze data
function generateFakeGazeData(startX, startY, numPoints, direction = 'right') {
    let x = startX;
    let y = startY;
    const data = [];
    for (let i = 0; i < numPoints; i++) {
        data.push({ x, y, timestamp: Date.now() + i * 20 }); // Reduced time between points to 20ms
        if (direction === 'right') {
            x += 0.5; // Reduced step size to 0.5
        } else if (direction === 'down') {
            y += 0.5; // Reduced step size to 0.5
        }
    }
    return data;
}

// Test 1: Reading a single word
console.log("Test 1: Reading a single word");
const singleWordData = generateFakeGazeData(5, 10, 20);
singleWordData.forEach(point => tracker.updateGaze(point.x, point.y, point.timestamp));

// Test 2: Reading multiple words in a line
console.log("\nTest 2: Reading multiple words in a line");
const multipleWordsData = generateFakeGazeData(5, 10, 100);
multipleWordsData.forEach(point => tracker.updateGaze(point.x, point.y, point.timestamp));

// Test 3: Reading multiple lines
console.log("\nTest 3: Reading multiple lines");
const multipleLinesData = [
    ...generateFakeGazeData(5, 10, 60),
    ...generateFakeGazeData(5, 30, 60),
    ...generateFakeGazeData(5, 50, 60)
];
multipleLinesData.forEach(point => tracker.updateGaze(point.x, point.y, point.timestamp));

// Test 4: Reading multiple lines with return sweeps
console.log("\nTest 4: Reading multiple lines with return sweeps");
const multipleLinesSweepData = [
    ...generateFakeGazeData(5, 10, 60, 'right'),
    ...generateFakeGazeData(95, 10, 10, 'down'),  // return sweep
    ...generateFakeGazeData(5, 30, 60, 'right'),
    ...generateFakeGazeData(95, 30, 10, 'down'),  // return sweep
    ...generateFakeGazeData(5, 50, 60, 'right'),
];
multipleLinesSweepData.forEach(point => tracker.updateGaze(point.x, point.y, point.timestamp));
