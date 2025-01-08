import mongoose from "mongoose";

import { config } from "dotenv"; // Cargar las variables de entorno
config();

const connectDB = async () => {
  try {
    console.log("Conectando a MongoDB con URI:", process.env.MONGO_URI);

    await mongoose.connect(
      "mongodb+srv://pinguybros3000:elianfa3000@cluster0.ylz6l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/digilalskills"

      /*process.env.MONGO_URI || "mongodb://localhost:27017/digitalskills"*/
    );
    console.log(">>>----/mongooDB conectado");
  } catch (err) {
    console.error("Error al conectar con MongoDB:", err.message);
  }
};

export default connectDB;
