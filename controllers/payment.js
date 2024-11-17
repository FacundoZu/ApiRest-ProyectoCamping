import Payment from "../models/payment.js";


export const payment = async (req, res) => {
    const { reservaId, tipo, transaccionId, estadoPago, cuotas, precioTotal} = req.body;

    try {
        const payment = new Payment({
            reservaId,
            tipo,
            estadoPago,
            precioTotal,
            cuotas,
            transaccionId,
        });
        await payment.save();

        res.status(201).json({ message: 'Método de pago guardado exitosamente', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el método de pago', error });
    }
};


export default {
    payment,
}