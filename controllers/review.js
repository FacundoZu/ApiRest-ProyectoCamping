import Review from "../models/review.js";
import Cabania from "../models/cabin.js"

const createReview = async (req, res) => {
    try {
        const { user, cabin, rating, comment } = req.body;

        if (!user || !cabin || !rating) {
            return res.status(400).json({ success: false, mensaje: "Todos los campos son obligatorios" });
        }

        const existingReview = await Review.findOne({ user, cabin });
        if (existingReview) {
            return res.status(400).json({ success: false, mensaje: "Ya has puntuado esta cabaña" });
        }

        const newReview = new Review({ user, cabin, rating, comments: [{ text: comment }] });
        const cabinact = await Cabania.findByIdAndUpdate(cabin, {
            $push: { comentarios: newReview._id }
        });
        console.log(cabinact)
        const savedReview = await newReview.save();

        return res.status(201).json({ success: true, mensaje: "Reseña creada exitosamente", review: savedReview });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: "Error al crear la reseña", error });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("user cabin");
        return res.status(200).json({ success: true, reviews });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: "Error al obtener las reseñas", error });
    }
};

const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id).populate("user cabin");

        if (!review) {
            return res.status(404).json({ success: false, mensaje: "Reseña no encontrada" });
        }

        return res.status(200).json({ success: true, review });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: "Error al obtener la reseña", error });
    }
};

const getReviewsByCabin = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ cabin: id })
            .populate("user", "name imageUrl")
            .populate("cabin", "nombre");

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "No se encontraron reseñas para esta cabaña"
            });
        }
        return res.status(200).json({
            success: true,
            mensaje: "Reseñas obtenidas exitosamente",
            reviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            mensaje: "Error al obtener las reseñas",
            error
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, mensaje: "Reseña no encontrada" });
        }
 
        review.rating = rating;

        if (review.comments && review.comments.length > 0) {
            review.comments[0].text = comment;
        } else {
            review.comments = [{ text: comment }];
        }

        await review.save();

        res.status(200).json({ success: true, mensaje: "Reseña actualizada", review });
    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
        res.status(500).json({ success: false, mensaje: "Error al actualizar la reseña", error });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({ success: false, mensaje: "Reseña no encontrada" });
        }

        return res.status(200).json({ success: true, mensaje: "Reseña eliminada exitosamente" });
    } catch (error) {
        return res.status(500).json({ success: false, mensaje: "Error al eliminar la reseña", error });
    }
};

export const changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        review.estado = review.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
        await review.save();

        res.json({
            status: 'success',
            message: `El estado ha sido cambiado a ${review.estado}`,
            review
        });
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        res.status(500).json({ message: 'Error al cambiar el estado del comentario' });
    }
};

export default {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByCabin,
    changeState,
};
