import app from "./app.js";
import DB from "./db.js";
import { config } from "dotenv";

config();
DB();
app.listen(3000);
