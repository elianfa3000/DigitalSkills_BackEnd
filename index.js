import app from "./src/app.js";
import DB from "./src/db.js";
import { config } from "dotenv";

config();
DB();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
