import Cabin from "../models/cabin.js";
import { uploadFile } from '../utils/uploadFile.js'

const getCabins = async (req, res) => {
    try {
        const { descripcion, cantidadPersonas, cantidadHabitaciones, cantidadBaños, servicios } = req.query;

        const filtros = {};

        if (descripcion) {
            filtros.descripcion = { $regex: descripcion, $options: 'i' };
        }

        if (cantidadPersonas && cantidadPersonas !== "0") {
            filtros.cantidadPersonas = cantidadPersonas;
        }

        if (cantidadHabitaciones && cantidadHabitaciones !== "0") {
            filtros.cantidadHabitaciones = cantidadHabitaciones;
        }

        if (cantidadBaños && cantidadBaños !== "0") {
            filtros.cantidadBaños = cantidadBaños;
        }

        if (servicios) {
            const serviciosArray = servicios.split(',');
            filtros.servicios = { $in: serviciosArray.map(serviceId => serviceId.trim()) };
        }

        const cabins = await Cabin.find(filtros).populate('servicios');

        return res.status(200).json({
            success: true,
            cabins
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las cabañas',
            error
        });
    }
};

const createCabin = async (req, res) => {
    try {
        const { nombre, modelo, precio, descripcion, cantidadPersonas, cantidadBaños, cantidadHabitaciones, estado, servicios } = req.body;
        const newCabin = new Cabin({ nombre, modelo, precio, descripcion, cantidadPersonas, cantidadBaños, cantidadHabitaciones, estado, servicios });
        const savedCabin = await newCabin.save();
        return res.status(201).json({
            status: 'success',
            cabin: savedCabin
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la cabaña",
            error,
        });
    }
};

const uploadImageCabin = async (req, res) => {
    try {
        if (!req.file && !req.files) {
            return res.status(400).json({
                status: "error",
                message: "No se ha subido ningún archivo"
            });
        }

        const image = req.files.image;
        if (!image || image.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No se ha encontrado una imagen válida"
            });
        }

        const { downloadURL } = await uploadFile(image[0], 1280, 720);

        const cabinId = req.params.id;
        const isMain = req.body.isMain;

        const updateData = isMain === "true"
            ? { imagenPrincipal: downloadURL }
            : { $push: { imagenes: downloadURL } };

        const cabañaActualizada = await Cabin.findOneAndUpdate(
            { _id: cabinId },
            updateData,
            { new: true }
        );

        if (!cabañaActualizada) {
            return res.status(404).json({
                status: "error",
                message: "Cabaña no encontrada"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Imagen actualizada correctamente",
            cabaña: cabañaActualizada,
        });

    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return res.status(500).json({
            status: "error",
            message: "Error interno en el servidor"
        });
    }
};

const getCabin = async (req, res) => {
    const { id } = req.params;

    try {
        const cabin = await Cabin.findById(id)
            .populate('servicios')
            .select('nombre modelo precio descripcion cantidadPersonas cantidadBaños cantidadHabitaciones estado servicios imagenPrincipal imagenesAdicionales');

        if (!cabin) {
            return res.status(404).json({ message: 'Cabaña no encontrada' });
        }

        return res.status(200).json({ cabin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener la cabaña' });
    }
}

const updateCabin = async (req, res) => {
    try {
        const updatedCabin = await Cabin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCabin) return res.status(404).json({
            mensaje: 'Cabaña no encontrada'
        });
        return res.status(200).json({
            status: 'success',
            updatedCabin
        })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la cabaña' });
    }
};

export const getOpcionesCabania = async (req, res) => {
    try {
        const modelos = Cabin.getModelos();
        const disponibilidades = Cabin.getDisponibilidades();
        return res.status(200).json({
            modelos, disponibilidades
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener opciones", error });
    }
};

export const changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const cabin = await Cabin.findById(id);

        if (!cabin) {
            return res.status(404).json({ message: 'Cabaña no encontrada' });
        }

        cabin.estado = cabin.estado === 'Disponible' ? 'No Disponible' : 'Disponible';

        await cabin.save();
        res.json({ message: `Estado cambiado a ${cabin.estado}`, cabin });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado de la cabaña' });
    }
};

export default {
    createCabin,
    getCabins,
    uploadImageCabin,
    getCabin,
    getOpcionesCabania,
    updateCabin,
    changeState
}
