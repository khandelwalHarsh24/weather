const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = '76b6f9f1c748964fb59143eae76f90b5';

const cors=require('cors');
app.use(cors());
app.use('*',cors());

app.use(express.json());


app.get('/',(req,res)=>{
  res.status(200).json("Hello World")
})

app.post('/weather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || cities.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of cities.' });
    }

    const weatherPromises = cities.map(city => getWeather(city));
    const weatherResults = await Promise.all(weatherPromises);

    res.json(weatherResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function getWeather(city) {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    const weatherData = {
      city: response.data.name,
      temperature: `${response.data.main.temp}`,
      description: response.data.weather[0].description,
    };

    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather for ${city}: ${error.message}`);
    return { city, error: 'Failed to fetch weather data' };
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
