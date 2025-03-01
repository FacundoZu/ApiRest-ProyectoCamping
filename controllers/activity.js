import Actividad from "../models/activity.js";
import { uploadFile } from "../utils/uploadFile.js";

const createActivity = async (req, res) => {
    try {
        const { titulo, imagen, descripcion, fechaInicio, fechaFinal } = req.body;

        if (!titulo || titulo.trim() === "") {
            return res.status(400).json({
                success: false, mensaje: "El título de la actividad es obligatorio"
            });
        }

        const newActivity = new Actividad({
            titulo,
            imagen,
            descripcion,
            fechaInicio,
            fechaFinal
        });

        const savedActivity = await newActivity.save();
        return res.status(201).json({
            status: 'success',
            mensaje: "Actividad creada exitosamente",
            activity: savedActivity
        });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al crear la actividad', error });
    }
};

const getAllActivities = async (req, res) => {
    try {
        const activities = await Actividad.find();
        return res.status(200).json({
            status: 'success',
            activities
        });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al obtener las actividades', error });
    }
};

const getActivityById = async (req, res) => {
    try {
        const activity = await Actividad.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({
                status: 'error',
                mensaje: "Actividad no encontrada"
            });
        }
        return res.status(200).json({
            status: 'success',
            activity
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al obtener la actividad',
            error
        });
    }
};

const updateActivity = async (req, res) => {
    try {
        const { titulo, imagen, descripcion, fechaInicio, fechaFinal } = req.body;

        const updateFields = { titulo, imagen, descripcion };

        if (fechaInicio) {
            const fechaInicioDate = new Date(fechaInicio);
            fechaInicioDate.setMinutes(fechaInicioDate.getMinutes() + fechaInicioDate.getTimezoneOffset());
            updateFields.fechaInicio = fechaInicioDate;
        }

        if (fechaFinal) {
            const fechaFinalDate = new Date(fechaFinal);
            fechaFinalDate.setMinutes(fechaFinalDate.getMinutes() + fechaFinalDate.getTimezoneOffset());
            updateFields.fechaFinal = fechaFinalDate;
        }

        const updatedActivity = await Actividad.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({
                status: 'error',
                mensaje: "Actividad no encontrada"
            });
        }

        return res.status(200).json({
            status: 'success',
            mensaje: "Actividad actualizada exitosamente",
            activity: updatedActivity
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            mensaje: 'Error al actualizar la actividad',
            error
        });
    }
};

const uploadActivityImage = async (req, res) => {
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

        const { downloadURL } = await uploadFile(image[0], 600, 600);

        return res.status(200).json({
            status: "success",
            imageUrl: downloadURL,
            message: "Imagen subida correctamente",
        });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return res.status(500).json({
            status: "error",
            message: "Error interno en el servidor"
        });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const deletedActivity = await Actividad.findByIdAndDelete(req.params.id);
        if (!deletedActivity) {
            return res.status(404).json({ success: false, mensaje: "Actividad no encontrada" });
        }
        return res.status(200).json({ success: true, mensaje: "Actividad eliminada exitosamente" });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al eliminar la actividad', error });
    }
};

export const changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Actividad.findById(id);

        if (!activity) {
            return res.status(404).json({ message: 'Actividad no encontrada' });
        }

        activity.estado = activity.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
        await activity.save();

        res.json({
            status: 'success',
            message: `El estado ha sido cambiado a ${activity.estado}`,
            activity
        });
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        res.status(500).json({ message: 'Error al cambiar el estado de la actividad' });
    }
};

export default {
    createActivity,
    getAllActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
    changeState,
    uploadActivityImage
};
