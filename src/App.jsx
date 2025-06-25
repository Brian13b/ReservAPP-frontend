import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import HomePage from "./components/HomePage";
import CanchasList from "./components/CanchasList";
import ReservasList from "./components/ReservasList";
import TodasReservasList from "./components/TodasReservasList";
import ReservaForm from "./components/ReservaForm";
import CanchasForm from "./components/CanchasForm";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'; 

function App() {
  return (
    <Router> 
      <Navbar bg="custom" variant="dark" expand="lg" fixed="top" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/Logo3.jpg" 
              alt="Reservas App"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" /> 
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/canchas">Canchas</Nav.Link>
              <Nav.Link as={Link} to="/reservas">Reservas</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5 pt-4"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/canchas" element={<CanchasList />} />
          <Route path="/reservas" element={<TodasReservasList />} />
          <Route path="/reservas/:canchaId" element={<ReservasList />} />
          <Route path="/reservas/:canchaId/nueva" element={<ReservaForm />} />
          <Route path="/reservas/:canchaId/modificar/:reservaId" element={<ReservaForm />} />
          <Route path="/canchas/nueva" element={<CanchasForm /> }/>
          <Route path="/canchas/modificar/:canchaId" element={<CanchasForm /> }/>
        </Routes>
      </Container>

      <footer className="footer-custom text-white text-center py-3 fixed-bottom">
        <Container>
          <p className="mb-0">&copy; 2025 ReservAPP - Todos los derechos reservados</p>
        </Container>
      </footer>
    </Router>
  );
}

export default App;