import Pregunta from '../models/questions.js'; 

const createQuestion = async (req, res) => {
    try {
        const { pregunta, respuesta, estado } = req.body;

        const preguntaExistente = await Pregunta.findOne({ pregunta });
        if (preguntaExistente) {
            return res.status(400).json({
                message: "La pregunta ya existe."
            });
        }

        const nuevaPregunta = new Pregunta({
            pregunta,
            respuesta,
            estado
        });

        await nuevaPregunta.save();
        res.status(201).json({
            status: 'success',
            message: 'Pregunta creada exitosamente.',
            nuevaPregunta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear la pregunta.',
            error: error.message
        });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        const preguntas = await Pregunta.find();
        
        res.status(200).json({
            status: 'success',
            preguntas
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las preguntas.',
            error: error.message
        });
    }
};

const getQuestionById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const pregunta = await Pregunta.findById(id);
        
        if (!pregunta) {
            return res.status(404).json({
                message: 'Pregunta no encontrada.'
            });
        }

        res.status(200).json({
            status: "success",
            pregunta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener la pregunta.',
            error: error.message
        });
    }
};

const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { pregunta, respuesta, estado } = req.body;

    try {
        const preguntaActualizada = await Pregunta.findByIdAndUpdate(
            id, 
            { pregunta, respuesta, estado },
            { new: true, runValidators: true }
        );

        if (!preguntaActualizada) {
            return res.status(404).json({
                message: 'Pregunta no encontrada.'
            });
        }

        res.status(200).json({
            status: "success",
            message: 'Pregunta actualizada exitosamente.',
            preguntaActualizada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar la pregunta.',
            error: error.message
        });
    }
};

const deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const preguntaEliminada = await Pregunta.findByIdAndDelete(id);

        if (!preguntaEliminada) {
            return res.status(404).json({
                message: 'Pregunta no encontrada.'
            });
        }

        res.status(200).json({
            message: 'Pregunta eliminada exitosamente.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar la pregunta.',
            error: error.message
        });
    }
};

export const changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Pregunta.findById(id);

        if (!question) {
            return res.status(404).json({ message: 'Pregunta no encontrado' });
        }

        question.estado = question.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
        await question.save();

        res.json({
            status: 'success',
            message: `El estado ha sido cambiado a ${question.estado}`,
            question
        });
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        res.status(500).json({ message: 'Error al cambiar el estado de la pregunta' });
    }
};

export default {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    changeState,
}