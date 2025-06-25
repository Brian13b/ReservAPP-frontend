import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Container } from 'react-bootstrap';
import { getReservas } from '../api/ReservasApi';
import { getCanchas } from '../api/CanchasApi';
import 'react-calendar/dist/Calendar.css';
import '../estilos/Reservas.css';

const HORARIO_ATENCION_INICIO = 9;
const HORARIO_ATENCION_FIN = 23;

function TodasReservasList() {
    const [reservas, setReservas] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        getReservas().then((data) => setReservas(data));
        getCanchas().then((data) => setCanchas(data));
    }, []);

    const reservasDelDia = reservas.filter((reserva) => {
        const fechaReserva = new Date(reserva.fecha);
        return (
            fechaReserva.getDate() === date.getDate() &&
            fechaReserva.getMonth() === date.getMonth() &&
            fechaReserva.getFullYear() === date.getFullYear()
        );
    }); // Filtrar las reservas del dia seleccionado

    const verificarDisponibilidad = (fecha) => {
        const reservasDelDia = reservas.filter((reserva) => {
            const fechaReserva = new Date(reserva.fecha);
            return (
                fechaReserva.getDate() === fecha.getDate() &&
                fechaReserva.getMonth() === fecha.getMonth() &&
                fechaReserva.getFullYear() === fecha.getFullYear()
            );
        });

        if (reservasDelDia.length === 0) {
            return 'disponible';
        }

        if (reservasDelDia.length === canchas.length * (HORARIO_ATENCION_FIN - HORARIO_ATENCION_INICIO)) {
            return 'completo';
        }

        return 'parcial';
    }; // Verificar la disponibilidad de las canchas en el calendario

    return (
        <Container className="container mt-4">
            <h2 className="text-center">Calendario de Reservas</h2>
            <p className="text-center">Selecciona una fecha para ver todas las reservas del dia</p>

            <div className="calendar-container mb-4">
                <Calendar 
                    onChange={setDate} value={date}
                    tileClassName={({ date }) => verificarDisponibilidad(date)}
                    
                />
            </div>

            <div className="reserva-grid d-flex mb-5">
                <div className="grid-header d-flex ">
                    <div className="cancha-header">Canchas</div>
                    <div className="horas-header d-flex">
                        {[...Array(HORARIO_ATENCION_FIN - HORARIO_ATENCION_INICIO + 1)].map((_, i) => (
                            <div key={i} className="hora-header">{HORARIO_ATENCION_INICIO + i}:00</div>
                        ))}
                    </div>
                </div>

                {canchas.map((cancha) => (
                    <div key={cancha.id} className="cancha-row d-flex">
                        <div className="cancha-nombre-list">{cancha.nombre}</div>
                        <div className="horas-container d-flex">
                            {[...Array(HORARIO_ATENCION_FIN - HORARIO_ATENCION_INICIO + 1)].map((_, i) => {
                                const horaActual = HORARIO_ATENCION_INICIO + i;
                                const reservaExistente = reservasDelDia.find((reserva) => {
                                    const horaInicio = parseInt(reserva.hora.split(':')[0], 10);
                                    const horaFin = horaInicio + reserva.duracion;
                                    return (
                                        reserva.cancha_id === cancha.id &&
                                        horaActual >= horaInicio &&
                                        horaActual < horaFin
                                    );
                                });

                                return (
                                    <div
                                        key={i}
                                        className={`hora-slot ${reservaExistente ? 'ocupado' : 'disponible'}`}
                                    >
                                        {reservaExistente ? reservaExistente.nombreContacto : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default TodasReservasList;
