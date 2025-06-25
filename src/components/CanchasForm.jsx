import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createCancha, updateCancha } from '../api/CanchasApi'; 
import { Button, Container, Form } from 'react-bootstrap';
import "../estilos/ReservaForm.css";

function CanchasForm() {

    const { canchaId } = useParams();
    const [nuevaCancha, setCancha] = useState({
        nombre: '',
        techada: false,
        precio: 0,
        direccion: '',
        imagen: ''
    });
    const navigate = useNavigate();
    const {state} = useLocation();

    useEffect(() => {
        if (state?.cancha) {
            setCancha(state.cancha);
        }
    }, [state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cancha = {...nuevaCancha, cancha_id: canchaId};

        try {
            if (canchaId) {
                await updateCancha(canchaId, cancha);
                navigate(`/canchas`);
            } else {
                await createCancha(cancha);
                navigate('/canchas');
            }
        } catch (err) {
            console.error('Error al agregar/modificar cancha:', err);
        }
    }

    return (
        <Container>
            <h2 className="text-center mt-4 mb-2">{canchaId? 'Modificar cancha' : 'Nueva cancha'}</h2>
            <p className="text-center mb-2">Completa el siguiente formulario para {canchaId? 'modificar la cancha' : 'agregar una nueva cancha'}</p>

            <Form className='formulario' onSubmit={handleSubmit}>

                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        value={nuevaCancha.nombre}
                        onChange={(e) => setCancha({ ...nuevaCancha, nombre: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formTechada">
                    <Form.Label>Es techada?</Form.Label>
                    <Form.Check
                        type="switch"
                        label={nuevaCancha.techada ? "Techada" : "No techada"}
                        checked={nuevaCancha.techada}
                        onChange={(e) => setCancha({ ...nuevaCancha, techada: e.target.checked })}
                        id="custom-switch"
                    />
                </Form.Group>

                <Form.Group controlId="formPrecio">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        value={nuevaCancha.precio}
                        onChange={(e) => setCancha({ ...nuevaCancha, precio: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formDireccion">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                        type="text"
                        value={nuevaCancha.direccion}
                        onChange={(e) => setCancha({ ...nuevaCancha, direccion: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formImagen">
                    <Form.Label>Portada</Form.Label>
                    <Form.Control
                        type="file"
                        name='imagen'
                        value={nuevaCancha.imagen}
                        onChange={(e) => setCancha({ ...nuevaCancha, imagen: e.target.value })}
                    />
                </Form.Group>

                <Button className="btn-custom-agregar mt-3" type="submit">
                    {canchaId ? 'Modificar' : 'Agregar'}
                </Button>
            </Form>
        </Container>
    );
}

export default CanchasForm;