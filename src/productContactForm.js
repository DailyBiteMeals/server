import express from "express";
import { z, ZodError } from "zod";
import sheets, { SHEET_ID } from "./sheetClient1.js";

const router = express.Router();

const productContactFormSchema = z.object({
  productId: z.string().nonempty(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(1, { message: "Email is required" }),
  mobile: z.string().refine((value) => /^\d{10}$/g.test(value), {
    message: "Mobile number should be 10 digits",
  }),
  deliveryDate: z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/g.test(value), {
      message: "Please enter a valid date in the format YYYY-MM-DD",
    }),
  quantity: z.string().min(1, { message: "Quantity should be greater than 0" }),
  deliveryLocation: z.string().min(1, {
    message: "Delivery Location is required",
  }),
  productDescription: z.string().optional(),
});

router.post("/ProductContactForm/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const body = productContactFormSchema.parse({
      ...req.body,
      productId, // Add the productId to the form data
    });

    // Object to Sheets
    const rows = Object.values({ ...body, productId }); // Include productId in rows
    console.log(rows);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Product!A2:H2",
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      requestBody: {
        values: [rows],
      },
    });
    res.json({ message: "Data added successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error });
    }
  }
});

export default router;
