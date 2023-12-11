import express from "express";

// Import necessary modules and routers
import homeContactFormRouter from "./src/homeContactForm.js";
import productContactFormRouter from "./src/productContactForm.js";
import contactUsFormRouter from "./src/contactUsForm.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "https://dailybite4-0-backend.onrender.com/"
  );
  next();
});

app.use(express.json());
// app.use(express.static("/ContactForm"));

// Use respective routers for each form
app.use("/", homeContactFormRouter);
app.use("/", productContactFormRouter);
app.use("/", contactUsFormRouter);

app.listen(process.env.PORT || 5000, () =>
  console.log(`App running on http://localhost:5000`)
);
