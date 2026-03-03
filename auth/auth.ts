import bcryptjs from "bcryptjs"
import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/schema/zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserFromDb } from "@/utils/lib/user"
import prisma from "@/utils/lib/prisma"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email и пароль обязательны"); 
          }
 
          const { email, password } = await signInSchema.parseAsync(credentials);
 
          const user = await getUserFromDb(email);
 
          if (!user || !user.passwordHash) {
            throw new Error("Неверный ввод данных.");
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            throw new Error("Неверный ввод данных.");
          }
 
          // return JSON object with the user data
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 3600
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }

})