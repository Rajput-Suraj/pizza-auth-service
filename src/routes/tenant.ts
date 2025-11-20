import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  res.status(201).json({ message: "Tenant created" });
});

export default router;
