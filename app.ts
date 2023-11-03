import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./routes/package/connection/index.ts";
import userRouter from "./routes/api/user.controller.ts";
import categoryRouter from "./routes/api/category.controller.ts";
import orchidRouter from "./routes/api/orchid.controller.ts";

var app = express();

// view engine setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
connectDB();

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/orchid", orchidRouter);
export default app;
