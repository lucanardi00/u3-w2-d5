import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Card, Alert } from 'react-bootstrap';
import '../App.css'

const Home = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiKey = '75ca12eda2d67ae84770190cdf90d241';

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/forecast/${city}`);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        fetchCurrentWeather(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        setError("Unable to access your location. Please enter a city name.");
      });
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchCurrentWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setCurrentWeather({
          city: data.name,
          temp: data.main.temp,
          description: data.weather[0].description
        });
      })
      .catch(() => {
        setError("Failed to fetch weather data.");
      });
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center">
      <h1>Weather Forecast Finder</h1>
      {currentWeather && (
        <Card className="mb-4" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Current Weather in {currentWeather.city}</Card.Title>
            <Card.Text>
              Temperature: {Math.round(currentWeather.temp - 273.15)}°C
            </Card.Text>
            <Card.Text>
              Description: {currentWeather.description}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="w-100">
        <Form.Group className="w-50">
          <Form.Control
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="mb-2"
          />
        </Form.Group>
        <Button variant="primary" type="submit">Get Forecast</Button>
      </Form>
    </Container>
  );
};

export default Home;
