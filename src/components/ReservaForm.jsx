import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCanchaById } from '../api/CanchasApi';
import { createReserva, updateReserva } from '../api/ReservasApi'; 
import { Container, Form, Button, Alert } from 'react-bootstrap';
import "../estilos/ReservaForm.css";

function ReservaForm() {
    const { canchaId, reservaId } = useParams(); 
    const [cancha, setCancha] = useState({}); 
    const navigate = useNavigate(); 
    const {state} = useLocation(); 
    const [nuevaReserva, setNuevaReserva] = useState({
        nombreContacto: '',
        telefonoContacto: '',
        fecha: '',
        hora: '',
        duracion: '',
    }); 

    const [error, setError] = useState(null);

    useEffect(() => {
        if (state?.reserva) {
          setNuevaReserva(state.reserva); 
        }
        getCanchaById(canchaId).then((data) => setCancha(data));
    }, [canchaId, state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reserva = { ...nuevaReserva, cancha_id: canchaId };

        try {
            if (reservaId) {
                await updateReserva(reservaId, reserva);
                navigate(`/reservas/${canchaId}`);
            } else {
                await createReserva(reserva);
                navigate(`/reservas/${canchaId}`);
                console.log('Reserva creada. reserva:', reserva);
            }
        } catch (err) {
            setError('Error al reservar. Intenta nuevamente. ' + err.response.data.detail);
        }
    };

    return (
        <Container>
            <h2 className="text-center mt-4 mb-2">{reservaId ? 'Modificar Reserva' : 'Reservar cancha'}</h2>
            <p className="text-center mb-2">{reservaId ? 'Modifica los datos de la reserva' : 'Completa el siguiente formulario para reservar la cancha'}</p>

            {error && <Alert variant="danger">{error}</Alert>}
            <br />

            <Form className='formulario' onSubmit={handleSubmit}>
                <Form.Group controlId="formCancha">
                    <Form.Label>Cancha</Form.Label>
                    <Form.Control
                        type="text"
                        value={cancha.nombre}
                        disabled
                    />
                </Form.Group>

                <Form.Group controlId="formNombreContacto">
                    <Form.Label>Nombre de Contacto</Form.Label>
                    <Form.Control
                        type="text"
                        value={nuevaReserva.nombreContacto}
                        onChange={(e) => setNuevaReserva({ ...nuevaReserva, nombreContacto: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formTelefonoContacto">
                    <Form.Label>Telefono de Contacto</Form.Label>
                    <Form.Control
                        type="text"
                        value={nuevaReserva.telefonoContacto}
                        onChange={(e) => setNuevaReserva({ ...nuevaReserva, telefonoContacto: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFecha">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={nuevaReserva.fecha}
                        onChange={(e) => setNuevaReserva({ ...nuevaReserva, fecha: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formHora">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                        type="time"
                        value={nuevaReserva.hora}
                        onChange={(e) => setNuevaReserva({ ...nuevaReserva, hora: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formDuracion">
                    <Form.Label>Duración</Form.Label>
                    <Form.Control
                        type="number"
                        value={nuevaReserva.duracion}
                        placeholder="Duración en horas"
                        onChange={(e) => setNuevaReserva({ ...nuevaReserva, duracion: e.target.value })}
                        required
                    />
                </Form.Group>

                <Button className="btn-custom-agregar mt-3" type='submit'>
                    {reservaId ? 'Modificar Reserva' : 'Reservar'}
                </Button>
            </Form>
        </Container>
    );
}

export default ReservaForm;
