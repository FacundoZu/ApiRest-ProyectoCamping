import Reservation from '../models/reservation.js';
import Cabin from '../models/cabin.js';
import Payment from '../models/payment.js';

const createReservation = async (req, res) => {
    try {
        const { usuarioId, cabaniaId, fechaInicio, fechaFinal, precioTotal, payment, guestInfo } = req.body;
        const fechaActual = new Date();

        if (!cabaniaId || !fechaInicio || !fechaFinal || !precioTotal || !payment) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos para la reserva.' });
        }

        if (new Date(fechaInicio) <= fechaActual) {
            return res.status(400).json({ mensaje: 'La reserva debe ser para una fecha futura.' });
        }

        if (!usuarioId) {
            if (!guestInfo || !guestInfo.nombre || !guestInfo.email || !guestInfo.telefono) {
                return res.status(400).json({ mensaje: 'Se requiere información del huésped para reservas sin cuenta.' });
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
                return res.status(400).json({ mensaje: 'Por favor ingresa un email válido.' });
            }
        }

        const reservasExistentes = await Reservation.find({
            cabaniaId,
            $or: [
                {
                    fechaInicio: { $lt: new Date(fechaFinal) },
                    fechaFinal: { $gt: new Date(fechaInicio) }
                },
                {
                    fechaInicio: { $gte: new Date(fechaInicio), $lte: new Date(fechaFinal) }
                },
                {
                    fechaFinal: { $gte: new Date(fechaInicio), $lte: new Date(fechaFinal) }
                }
            ]
        });

        if (reservasExistentes.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe una reserva para estas fechas.' });
        }

        const nuevaReserva = new Reservation({
            usuarioId: usuarioId || null,
            cabaniaId,
            fechaInicio,
            fechaFinal,
            precioTotal,
            metodoPago: payment.tipo,
            estadoReserva: 'pendiente',
            guestInfo: !usuarioId ? {
                nombre: guestInfo.nombre,
                email: guestInfo.email,
                telefono: guestInfo.telefono
            } : null
        });

        const reservaGuardada = await nuevaReserva.save();

        const nuevoPago = new Payment({
            reservaId: reservaGuardada._id,
            tipo: payment.tipo,
            precioTotal,
            estadoPago: payment.estadoPago || 'pendiente',
            transaccionId: payment.transaccionId || null,
            cuotas: payment.cuotas || null
        });

        const pagoGuardado = await nuevoPago.save();

        await Cabin.findByIdAndUpdate(cabaniaId, {
            $push: { reservas: reservaGuardada._id }
        });

        res.status(201).json({
            status: "success",
            reserva: reservaGuardada,
            pago: pagoGuardado
        });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ 
            status: "error",
            mensaje: 'Error al crear la reserva',
            error: error.message 
        });
    }
};

const getReservations = async (req, res) => {
    try {
        const cabinId = req.params.id;
        const fechaActual = new Date();

        const fechaDosMesesAtras = new Date();
        fechaDosMesesAtras.setMonth(fechaActual.getMonth() - 1);

        const reservas = await Reservation.find({
            cabaniaId: cabinId,
            $or: [
                { fechaInicio: { $gte: fechaDosMesesAtras } },
                { estado: 'activa' }
            ]
        });


        if (!reservas || reservas.length === 0) {
            return res.status(404).json({
                mensaje: 'No se encontraron reservas para esta cabaña.',
            });
        }

        return res.status(200).json({
            reservas,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error al obtener las reservas.',
        });
    }
};

const getAllReservationsCabin = async (req, res) => {

    try {
        const cabinId = req.params.id;
        const reservas = await Reservation.find({
            cabaniaId: cabinId,
        });

        if (!reservas || reservas.length === 0) {
            return res.status(404).json({
                mensaje: 'No se encontraron reservas para esta cabaña.',
            });
        }

        return res.status(200).json({
            reservas,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error al obtener las reservas.',
        });
    }
};

const getReservationsUser = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const reservas = await Reservation.find({ usuarioId })
            .populate('cabaniaId')
            .exec();
        res.status(200).json({ success: true, reservas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener reservas' });
    }
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('cabaniaId');
        res.status(200).json({ reservations });
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        res.status(500).json({ message: "Error al obtener las reservas" });
    }
};

export const getUserReservations = async (req, res) => {
    const { userId, cabinId } = req.params;

    try {
        const reservas = await Reservation.find({
            usuarioId: userId,
            cabaniaId: cabinId,
        });

        res.status(200).json({ reservas });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener reservas del usuario", error });
    }
};

export default {
    createReservation,
    getReservations,
    getReservationsUser,
    getAllReservations,
    getUserReservations,
    getAllReservationsCabin
};
