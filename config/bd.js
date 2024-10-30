import { connect } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const conexion = async() => {
    try {
        await connect(process.env.DATABASE_URL)
        console.log("Conectado correctamente a la base de datos camping")
    } catch(error){
        console.log(error);
    }
}
