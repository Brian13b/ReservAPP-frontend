import React from 'react';
import { Container, Button } from 'react-bootstrap';
import '../estilos/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <Container className="text-center">
        <h1 className="display-2 mt-4">Bienvenido a <strong>ReservAPP</strong></h1>
        <p className="lead">Reserva tu cancha de padel favorita en un solo clic</p>
        <Button className="btn-reservar-hp mt-2 mb-4" href={`/canchas`}>Reservar</Button>
      </Container> 
      <img src="/freepik__expand__57452.jpeg" alt="Cancha de padel" className="img-fluid rounded " />
    </div>
  );
}

export default HomePage;