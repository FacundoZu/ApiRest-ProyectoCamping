import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { en_ZA } from '@faker-js/faker';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'facundozuleta70@gmail.com',
        pass: 'krvs fwun vdmu sgqo',
    },
});

export const enviarEmailTicket = (correoUsuario, detallesReserva) => {
    const { fechaInicio, fechaFinal, precioTotal, metodoPago, cabaña } = detallesReserva;

    const doc = new PDFDocument({
        size: 'A6',
        margins: { top: 20, left: 20, bottom: 20, right: 20 },
    });

    const pdfPath = `ticket_${new Date().getTime()}.pdf`;

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fillColor('#333').fontSize(12);
    doc.fontSize(20).fillColor('#4CAF50').text('TICKET DE RESERVA', { align: 'center' }).moveDown(1);
    doc.lineWidth(0.5).moveTo(20, 40).lineTo(200, 40).stroke('#4CAF50');

    doc.fontSize(12).fillColor('#333');
    doc.text(`Fecha de Inicio: ${new Date(fechaInicio).toLocaleDateString('es-ES')}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Fecha de Fin: ${new Date(fechaFinal).toLocaleDateString('es-ES')}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Precio Total: ${precioTotal} €`, { align: 'left' }).moveDown(0.5);
    doc.text(`Método de Pago: ${metodoPago}`, { align: 'left' }).moveDown(1);

    doc.fontSize(14).fillColor('#4CAF50').text('Detalles de la Cabaña', { align: 'center' }).moveDown(0.5);
    doc.lineWidth(0.5).moveTo(20, doc.y).lineTo(200, doc.y).stroke('#4CAF50').moveDown(1);
    doc.fontSize(12).fillColor('#333');
    doc.text(`Nombre: ${cabaña.nombre}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Capacidad: ${cabaña.cantidadPersonas} personas`, { align: 'left' }).moveDown(0.5);
    doc.text(`Habitaciones: ${cabaña.cantidadHabitaciones}`, { align: 'left' }).moveDown(0.5);
    doc.text(`Baños: ${cabaña.cantidadBaños}`, { align: 'left' }).moveDown(1);

    doc.lineWidth(0.5).moveTo(20, doc.y).lineTo(200, doc.y).stroke('#4CAF50').moveDown(1);

    doc.fontSize(10).fillColor('#4CAF50').text('¡Gracias por elegirnos!', { align: 'center' });

    doc.end();

    const emailHTML = `
        <h1 style="color: #4CAF50;">Confirmación de Reserva</h1>
        <p>Estimado cliente,</p>
        <p>Gracias por reservar con nosotros. A continuación, encontrarás los detalles de tu reserva:</p>
        <ul style="line-height: 1.6;">
            <li><strong>Fecha de Inicio:</strong> ${new Date(fechaInicio).toLocaleDateString('es-ES')}</li>
            <li><strong>Fecha de Fin:</strong> ${new Date(fechaFinal).toLocaleDateString('es-ES')}</li>
            <li><strong>Total:</strong> ${precioTotal} €</li>
            <li><strong>Método de Pago:</strong> ${metodoPago}</li>
        </ul>
        <h3 style="color: #4CAF50;">Detalles de la Cabaña</h3>
        <ul style="line-height: 1.6;">
            <li><strong>Nombre:</strong> ${cabaña.nombre}</li>
            <li><strong>Capacidad:</strong> ${cabaña.cantidadPersonas} personas</li>
            <li><strong>Habitaciones:</strong> ${cabaña.cantidadHabitaciones}</li>
            <li><strong>Baños:</strong> ${cabaña.cantidadBaños}</li>
        </ul>
        <p>En el archivo adjunto encontrarás tu ticket oficial. ¡Te esperamos para disfrutar de tu estancia!</p>
        <p>Saludos,</p>
        <p><strong>Equipo de Reservas</strong></p>
    `;

    const mailOptions = {
        from: 'facundozuleta70@gmail.com',
        to: correoUsuario,
        subject: 'Ticket de Compra - Reserva Confirmada',
        html: emailHTML,
        attachments: [
            {
                filename: 'ticket_reserva.pdf',
                path: pdfPath,
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado con éxito:', info.response);
        }

        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }
    });
};

export const enviarEmailConsulta = (name, email, message) => {

    const mailOptions = {
        from: "facundozuleta70@gmail.com",
        to: "facundozuleta90@gmail.com",
        subject: `Nuevo mensaje de ${name}. Web CampingCachi`,
        text: `Email: ${email}\n\nMensaje: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado con éxito:', info.response);
        }

    });
}