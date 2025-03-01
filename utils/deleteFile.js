import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase.js';

const deleteFileFromStorage = async (fileUrl) => {
    try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
    } catch (error) {
        console.error("Error al eliminar la imagen del almacenamiento:", error);
        throw error;
    }
};

export { deleteFileFromStorage };