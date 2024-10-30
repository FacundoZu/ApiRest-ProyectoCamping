import Service from "../models/service.js";

const createService = async (req, res) => {
    try {
        const { nombre, imagen, descripcion } = req.body;
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "El nombre del servicio es obligatorio" });
        }
        if (!imagen || imagen.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "La imagen del servicio es obligatoria" });
        }
        if (!descripcion || descripcion.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "La descripción del servicio es obligatoria" });
        }
        const newService = new Service({ nombre, imagen, descripcion });
        const savedService = await newService.save();
        return res.status(201).json({ success: true, mensaje: "Servicio creado exitosamente", service: savedService });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: 'Error al crear el servicio', error });
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

export default {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};