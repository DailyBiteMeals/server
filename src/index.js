import express from "express";

// Import necessary modules and routers
import homeContactFormRouter from "./homeContactForm.js";
import productContactFormRouter from "./productContactForm.js";
import contactUsFormRouter from "./contactUsForm.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
