import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { getCanchas, deleteCancha } from "../api/CanchasApi";
import { useNavigate } from "react-router-dom";
import "../estilos/CanchasList.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function CanchasList() {
  const [canchas, setCanchas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCanchas()
      .then((data) => setCanchas(data))
      .catch((err) => console.error("Error obteniendo canchas", err));
  }, [canchas]); 

  const filteredCanchas = canchas.filter((cancha) =>
    cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModificarCancha = (cancha) => {
    try {
      console.log("Cancha a modificar: ", cancha, cancha.id);
      navigate(`/canchas/modificar/${cancha.id}`, {
        state: {cancha}});
    } catch (err) {
      console.error("Error al modificar la cancha. ", err);
    }
  }

  const handleDeleteCancha = async (id) => {
    try {
      const response = window.confirm("¿Estás seguro que deseas eliminar la cancha?");

      if (!response)
      {
        return;
      }

      await deleteCancha(id);

      alert("Cancha eliminada correctamente.");
      
    } catch (err) {
      console.error("Error al eliminar la cancha. ", err);
    }
  }

  return (
    <div className="canchas-list p-3"> 
      <h2 className="text-center mb-2">Lista de Canchas</h2>
      <p className="text-center">Lista completas de canchas</p>

      <Form className="mb-3">
        <Form.Label>Filtrar</Form.Label>
        <Form.Control
          className="search-input mb-2"
          type="text"
          placeholder="Buscar por nombre de cancha"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Row> 
        {filteredCanchas.sort((a, b) => a.precio - b.precio ).map((cancha) => (
          <Col key={cancha.id} sm={12} md={6} lg={4}>
            <Card className="mb-3">
              <Card.Img
                variant="top"
                src={cancha.portada || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png"} 
                alt={cancha.nombre}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{cancha.nombre}</Card.Title>
                <Card.Text>
                  {cancha.techada ? "Techada" : "No Techada"}
                </Card.Text>
                <Card.Text>
                  Precio: ${cancha.precio? cancha.precio : "Consultar"}
                </Card.Text>
                <Card.Text>
                  Dirección: {cancha.direccion}
                </Card.Text>
                
                <Button
                  className="btn-custom-canchas"
                  href={`/reservas/${cancha.id}/nueva`}
                >
                  Reservar
                </Button>
                <Button
                  className="btn-secondary"
                  href={`/reservas/${cancha.id}`}
                >
                  Ver Reservas
                </Button>
                <Button className="btn-warning" onClick={() => {handleModificarCancha(cancha)}}><i class="bi bi-pen"></i></Button>
                <Button className="btn-danger" onClick={() => {handleDeleteCancha(cancha.id)}}><i class="bi bi-trash"></i></Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button href="/canchas/nueva" className="btn-custom-canchas justify-content-center">Nueva Cancha</Button>
    </div>
  );
}

export default CanchasList;