import express from "express";
import { z, ZodError } from "zod";
import sheets, { SHEET_ID } from "./sheetClient1.js";

const router = express.Router();

const homeContactFormSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  mobile: z.string().regex(/^\d{10}$/),
  message: z.string().optional(),
});

router.post("/HomeContactForm", async (req, res) => {
  try {
    const body = homeContactFormSchema.parse(req.body);

    // Object to Sheets
    const rows = Object.values(body);
    console.log("Rows to be added to Google Sheets:", rows);

    // Append data to Google Sheets
    const sheetsResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Home!A2:D2", // Adjust the range as per your Sheets structure
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      requestBody: {
        values: [rows],
      },
    });

    // If successful response from Google Sheets API
    res.json({ message: "Data added successfully", sheetsResponse });
  } catch (error) {
    if (error instanceof ZodError) {
      // Schema validation error
      res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    } else {
      // Other errors, including Google Sheets API errors
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
