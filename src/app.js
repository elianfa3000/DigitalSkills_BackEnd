import express from "express";
import cookieParser from "cookie-parser";
import authRouth from "./routes/auth.routes.js";
import cors from "cors";
//import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: "https://digital-skills-hub.vercel.app",
    //"http://localhost:5173"
    /*"https://digital-skills-hub.vercel.app" , "https://elianfa3000.github.io"*/
    //http://localhost:5173
    credentials: true,
  })
);

//app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use(authRouth);
export default app;
