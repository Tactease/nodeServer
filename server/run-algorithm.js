const { spawn } = require('child_process');

function runAlgorithm() {
    const pythonProcess = spawn('python', ['./algorithm/cpAlgorithm.py']);

    pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim(); // Convert buffer to string and remove trailing newline
        console.log(`Python algorithm output: ${result}`);
        // You can handle the result here, or pass it to another function
        // For now, just logging it
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python algorithm error: ${data}`);
    });

    // No need to provide input to the Python algorithm
    // pythonProcess.stdin.write(inputData + '\n');

    pythonProcess.stdin.end(); // Still need to close stdin to indicate no more input
}

module.exports = runAlgorithm;