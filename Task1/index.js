require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    try {
        const { visitor_name: visitorName } = req.query;
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

        // For development, using a hardcoded IP address
        // const locationResponse = await axios.get(`http://ip-api.com/json/24.48.0.1`);
        
        // In production, use the actual IP
        const locationResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const location = locationResponse.data.city;

        // Get weather data from the correct endpoint
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_KEY}&units=metric`);
        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: ip,
            location: location,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});