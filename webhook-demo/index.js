const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const event = req.body;

    console.log('Webhook received:', event);

    // Respond to the webhook sender
    res.status(200).send('Webhook received successfully!');

    // Handle the event
    handleEvent(event);
});

// Function to handle webhook events
function handleEvent(event) {
    if (event.type === 'payment.success') {
        console.log('Payment successful:', event.data);
    } else if (event.type === 'user.created') {
        console.log('User created:', event.data);
    } else {
        console.log('Unhandled event type:', event.type);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
