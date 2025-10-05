import { z } from "zod";

export const registerShape = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().default("USER"),
  position: z.string().min(2, "Position must be at least 2 characters"),
});

