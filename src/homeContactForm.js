import express from "express";
import { z, ZodError } from "zod";
import sheets, { SHEET_ID } from "./sheetClient1.js";

const router = express.Router();

const homeContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(1, { message: "Email is required" }),
  mobile: z.string().refine((value) => /^\d{10}$/g.test(value), {
    message: "Mobile number should be 10 digits",
  }),
  message: z.string().optional(),
});

router.post("/HomeContactForm", async (req, res) => {
  try {
    const body = homeContactFormSchema.parse(req.body);

    // Object to Sheets
    const rows = Object.values(body);
    console.log(rows);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Home!A2:D2",
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
