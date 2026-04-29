import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Hardcoded admin credentials for development
        // In production, use a proper database lookup with hashed passwords
        if (
          credentials?.username === 'admin' &&
          credentials?.password === 'admin'
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@kateys-bnb.com',
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production',
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name
      }
      return session
    },
  },
}
