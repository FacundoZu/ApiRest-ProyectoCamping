import Service from "../models/service.js";

const createService = async (req, res) => {
    try {
        const { nombre, imagen, descripcion } = req.body;
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({
                success: false,
                mensaje: "El nombre del servicio es obligatorio"
            });
        }

        if (!imagen || imagen.trim() === "") {
            return res.status(400).json({
                success: false,
                mensaje: "La imagen del servicio es obligatoria"
            });
        }

        if (!descripcion || descripcion.trim() === "") {
            return res.status(400).json({
                success: false,
                mensaje: "La descripción del servicio es obligatoria"
            });
        }
        const newService = new Service({
            nombre,
            imagen,
            descripcion
        });
        const savedService = await newService.save();

        return res.status(201).json({
            success: true,
            mensaje: "Servicio creado exitosamente",
            service: savedService
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            mensaje: 'Error al crear el servicio',
            error 
        });
    }
}

export default {
    createService
}