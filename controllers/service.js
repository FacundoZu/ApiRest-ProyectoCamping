import Service from "../models/service.js";
import { uploadFile } from "../utils/uploadFile.js";

const createService = async (req, res) => {
    try {
        const { nombre, imagen, descripcion } = req.body;

        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "El nombre del servicio es obligatorio" });
        }

        if (!descripcion || descripcion.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "La descripción del servicio es obligatoria" });
        }

        const newService = new Service({ nombre, imagen, descripcion });
        const savedService = await newService.save();

        return res.status(201).json({ success: true, mensaje: "Servicio creado exitosamente", service: savedService });
    } catch (error) {
        console.error("Error al crear el servicio:", error);
        return res.status(500).json({ success: false, mensaje: 'Error al crear el servicio', error });
    }
};

const uploadServiceImage = async (req, res) => {
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

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        return res.status(200).json({ success: true, services });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al obtener los servicios', error });
    }
};

const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, mensaje: "Servicio no encontrado" });
        }
        return res.status(200).json({ success: true, service });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al obtener el servicio', error });
    }
};

const updateService = async (req, res) => {
    try {
        const { nombre, imagen, descripcion } = req.body;
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { nombre, imagen, descripcion },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ success: false, mensaje: "Servicio no encontrado" });
        }
        return res.status(200).json({ success: true, mensaje: "Servicio actualizado exitosamente", service: updatedService });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al actualizar el servicio', error });
    }
};

const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ success: false, mensaje: "Servicio no encontrado" });
        }
        return res.status(200).json({ success: true, mensaje: "Servicio eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al eliminar el servicio', error });
    }
};

export const changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        service.estado = service.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
        await service.save();

        res.json({
            status: 'success',
            message: `El estado ha sido cambiado a ${service.estado}`,
            service
        });
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        res.status(500).json({ message: 'Error al cambiar el estado del servicio' });
    }
};


export default {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    changeState,
    uploadServiceImage
};
