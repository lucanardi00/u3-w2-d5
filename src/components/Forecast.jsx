import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import '../App.css'

const Forecast = () => {
  const { city } = useParams();
  const [forecastData, setForecastData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      const apiKey = '75ca12eda2d67ae84770190cdf90d241';
      try {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
          const forecastResponse = await fetch(forecastUrl);
          const forecast = await forecastResponse.json();
          const groupedData = groupForecastByDay(forecast.list);
          setForecastData(groupedData);
        } else {
          setError('No data found for specified city.');
        }
      } catch (e) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const groupForecastByDay = (data) => {
    return data.reduce((acc, cur) => {
      const date = new Date(cur.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(cur);
      return acc;
    }, {});
  };

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">{city.toUpperCase()} Weather Forecast</h1>
      {Object.keys(forecastData).map((date, idx) => (
        <div key={idx}>
          <h2 className="mt-4 mb-3">{date}</h2>
          <Row xs={1} sm={2} md={4} lg={5} className="g-4">
            {forecastData[date].map((item, index) => (
              <Col key={index}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Card.Title>
                    <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
                    <Card.Text>Actual Temp: {Math.round(item.main.temp - 273.15)}°C</Card.Text>
                    <Card.Text>High Temp: {Math.round(item.main.temp_max - 273.15)}°C</Card.Text>
                    <Card.Text>Low Temp: {Math.round(item.main.temp_min - 273.15)}°C</Card.Text>
                    <Card.Text>Humidity: {item.main.humidity}%</Card.Text>
                    <Card.Text>Wind: {(item.wind.speed * 3.6).toFixed(2)} km/h</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Forecast;
