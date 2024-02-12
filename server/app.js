const express = require('express')
const logger = require('morgan')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.listen(port, () => console.log(`Express server is running on port ${port}`))

// Define route to add a soldier
app.post('/add-soldier', (req, res) => {
    // Extract data from request body
    const { personal_number, fullName } = req.body;

    // Call addSoldier function from setup_data.js
    dbFunctions.addSoldier(personal_number, fullName);

    // Send response
    res.send('Soldier added successfully.');
});

// Function to gracefully shut down the server
function shutdown() {
    server.close(() => {
        console.log('Server stopped');
        process.exit(0); // Exit the process
    });
}

// Handle process termination signals (e.g., Ctrl+C)
process.on('SIGINT', () => {
    console.log('Received SIGINT signal');
    shutdown();
});

// Export the app for testing purposes
module.exports = app;