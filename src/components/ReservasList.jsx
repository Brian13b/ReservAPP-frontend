import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import { getReservas, deleteReserva } from '../api/ReservasApi';
import { getCanchaById } from '../api/CanchasApi';
import { Container, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../estilos/ReservasList.css';

const HORARIO_ATENCION_INICIO = 9;
const HORARIO_ATENCION_FIN = 23;

function ReservasList() {

    const { canchaId } = useParams();
    const [cancha, setCancha] = useState({});
    const [reservas, setReservas] = useState([]);
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        getCanchaById(canchaId).then((data) => setCancha(data));
    }, [canchaId]);

    useEffect(() => {
        getReservas().then((data) => setReservas(data));
    }, [canchaId]);

    const reservasFiltradas = reservas.filter(
        (reserva) => reserva.cancha_id === parseInt(canchaId)
    );

    const reservasDelDia = reservasFiltradas.filter((reserva) => {
        const fechaReserva = new Date(reserva.fecha);
        fechaReserva.setDate(fechaReserva.getDate() + 1);

        return (
            fechaReserva.getDate() === date.getDate() &&
            fechaReserva.getMonth() === date.getMonth() &&
            fechaReserva.getFullYear() === date.getFullYear()
        );
    });

    const obtenerHorasOcupadas = () => {
        const horasOcupadas = reservasDelDia.map((reserva) => {
            const [horaInicio, minutoInicio] = reserva.hora.split(':');
            const horaFin = (parseInt(horaInicio) + parseInt(reserva.duracion)).toString().padStart(2, '0');
            return `${horaInicio}:${minutoInicio} - ${horaFin}:${minutoInicio}`;
        });
        return horasOcupadas;
    };

    const obtenerHorasLibres = () => {
        const horasOcupadas = Array(14).fill(false); // Array de 14 elementos, uno por cada hora de atencion

        reservasDelDia.forEach((reserva) => {
            const horaInicio = parseInt(reserva.hora.split(':')[0], 10);
            const duracion = parseInt(reserva.duracion, 10);
            const horaFin = horaInicio + duracion;

            for (let hora = horaInicio; hora < horaFin; hora++) {
                if (hora >= HORARIO_ATENCION_INICIO && hora < HORARIO_ATENCION_FIN) {
                    horasOcupadas[hora - HORARIO_ATENCION_INICIO] = true;
                }
            }
        }); // Filtramos las reservas del día y marcamos las horas ocupadas 

        const horasLibres = []; // Array para almacenar las horas libres
        let horaInicioLibre = null; // Variable para almacenar la hora de inicio de la reserva libre
    
        for (let i = 0; i < horasOcupadas.length; i++) {
            if (!horasOcupadas[i]) {
                if (horaInicioLibre === null) {
                    horaInicioLibre = i + HORARIO_ATENCION_INICIO;
                } // Si la hora esta libre y no hay una hora de inicio libre, la guardo
            } else {
                if (horaInicioLibre !== null) {
                    const horaFinLibre = i + HORARIO_ATENCION_INICIO;
                    horasLibres.push(`${horaInicioLibre.toString().padStart(2, '0')}:00 - ${horaFinLibre.toString().padStart(2, '0')}:00`); 
                    horaInicioLibre = null;
                } // Si la hora esta ocupada y hay una hora de inicio libre, guardo la hora de inicio y fin de la reserva.
            }
        } // Recorro el array de horas ocupadas para encontrar las horas libres

        if (horaInicioLibre !== null) {
            const horaFinLibre = HORARIO_ATENCION_FIN;
            horasLibres.push(`${horaInicioLibre.toString().padStart(2, '0')}:00 - ${horaFinLibre.toString().padStart(2, '0')}:00`);
        } // Si la hora de inicio libre no es nula, guardo la hora de inicio y fin de la reserva
        return horasLibres;
    };

    // Funcion para verificar la disponibilidad de la cancha en una fecha determinada
    const verificarDisponibilidad = (fecha) => {
        const reservasDelDia = reservasFiltradas.filter((reserva) => {
            const fechaReserva = new Date(reserva.fecha);
            fechaReserva.setDate(fechaReserva.getDate() + 1); // Le sumo 1 día porque la fecha de la reserva está en UTC, y me daba problemas con el calendario

            return (
                fechaReserva.getDate() === fecha.getDate() &&
                fechaReserva.getMonth() === fecha.getMonth() &&
                fechaReserva.getFullYear() === fecha.getFullYear()
            );
        }); // Filtramos las reservas de la cancha para la fecha seleccionada

        const horasOcupadas = Array(14).fill(false); // Array de 14 elementos, uno por cada hora de atención

        reservasDelDia.forEach((reserva) => {
            const horaInicio = parseInt(reserva.hora.split(':')[0], 10);
            const duracion = parseInt(reserva.duracion, 10);
            const horaFin = horaInicio + duracion;

            for (let hora = horaInicio; hora < horaFin; hora++) {
                if (hora >= HORARIO_ATENCION_INICIO && hora <= HORARIO_ATENCION_FIN) {
                    horasOcupadas[hora - HORARIO_ATENCION_INICIO] = true;
                }
            }
        }); // Recorremos las reservas del día y marcamos las horas ocupadas

        const estaCompleto = horasOcupadas.every((hora) => hora === true); // Verificamos si todas las horas están ocupadas

        if (reservasDelDia.length === 0) return 'sin-reservas';
        if (estaCompleto) return 'completo'; 
        return 'disponible'; 
    };

    const handleChangeDate = (newDate) => {
        setDate(newDate);
    };

    const handleModificarReserva = (reserva) => {
        navigate(`/reservas/${canchaId}/modificar/${reserva.id}`, {
            state: { reserva }  
        });
    }; 

    const handleEliminarReserva = async (reservaId) => {
        try {
            const response = window.confirm('¿Estás seguro que deseas eliminar la reserva?');

            if (!response) 
                return;

            await deleteReserva(reservaId);
            
            setReservas(reservas.filter(reserva => reserva.id !== reservaId));
            console.log(`Reserva con ID: ${reservaId} eliminada correctamente`);
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
        }
    };

    return (
        <Container className="reservas-list">
            <h2 className="text-center mt-4 mb-2">Reservas para {cancha.nombre}</h2>
            <p className="text-center mb-4">Selecciona una fecha para ver las reservas</p>

            <div className="calendar-container-reserva">  
                <Calendar
                    onChange={handleChangeDate}
                    value={date}
                    tileClassName={({ date, view }) => {
                        if (view === 'month') {
                            const estadoDia = verificarDisponibilidad(date);
                            if (estadoDia === 'completo') {
                                return 'turno-completo';
                            }
                            if (estadoDia === 'disponible') {
                                return 'turno-disponible';
                            }
                            return 'turno-sin-reservas';
                        }
                    }}
                />

                <div className="reservas-del-dia">
                    <h4>Reservas para {date.toLocaleDateString()}</h4>
                    {reservasDelDia.length === 0 ? (<p>No hay reservas para este día</p>
                    ) : (
                        <ul className="list-unstyled">
                            {reservasDelDia.map((reserva) => (
                                <li key={reserva.id} className="mb-3 p-3 border rounded">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{reserva.nombreContacto}</strong> - 
                                            {`${(parseInt(reserva.hora.split(':')[0])).toString().padStart(2,'0')}:${reserva.hora.split(':')[1]}`} 
                                            {' '} a {' '}
                                            {`${(parseInt(reserva.hora.split(':')[0]) + parseInt(reserva.duracion)).toString().padStart(2, '0')}:${reserva.hora.split(':')[1]}`}
                                        </div>
                                        <div className="btn-group">
                                            <Button variant="warning" size="sm" onClick={() => handleModificarReserva(reserva)} className="me-2">
                                                Modificar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleEliminarReserva(reserva.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>   
            </div>

            <div className="mt-4">
                <h5>Horarios disponibles en este día:</h5>
                {obtenerHorasOcupadas().length === 0 ? (
                    <p>No hay horas ocupadas en este día</p>
                ) : (
                    <ul className="list-unstyled">
                        {obtenerHorasLibres().map((hora, index) => (   
                            <li key={index} className="mb-2">{hora}</li>
                        ))}
                    </ul>
                )} 
            </div>
        </Container>
    );
}

export default ReservasList;