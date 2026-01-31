import { z } from "zod";
enum Role {
  User = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}
export const registerSchema = z.object({
    email : z.string("Email is required").email("Invalid email"),
    name : z.string("Name is required").min(2, "Name must be at least 2 characters"),
    password : z.string( "Password is required").min(5,"Must be at least 5 character"),
     role: z.nativeEnum(Role),
})