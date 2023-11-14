const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/saveToFile', (req, res) => {
    console.log('Received saveToFile request');
    try {
        const { questionId, options } = req.body;

        if (!questionId || !options || options.length === 0) {
            return res.status(400).send('Please provide a question ID and at least one option.');
        }

        const filePath = `selected_options.txt`;

        // Update the content
        const updatedContent = `Selected Options for Question ${questionId}: ${options.join(', ')}\n`;

        // Append the updated content to the file
        fs.appendFileSync(filePath, updatedContent);

        res.json({ message: 'Options saved successfully.' });
    } catch (error) {
        console.error('Error saving options:', error);
        res.status(500).send('Error saving options.');
    }
});

app.post('/submitAll', (req, res) => {
    console.log('Received submitAll request');
    try {
        // Run the Python script using saved options
        exec('python tester.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running Python script: ${error}`);
                return res.status(500).send('Error running Python script.');
            }

            console.log(`Python script output: ${stdout}`);

            // Redirect to http://localhost:5173
            res.json({ message: 'Python script executed successfully.' });
        });
    } catch (error) {
        console.error('Error submitting all:', error);
        res.status(500).send('Error submitting all.');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});