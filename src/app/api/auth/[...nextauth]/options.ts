import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Имя пользователя",
          type: "text",
          placeholder: "имя при регистрации клиента",
          required: true,
        },
        password: {
          label: "Пароль",
          type: "password",
          placeholder: "ваш пароль",
          required: true,
        },
      },
      async authorize(credentials) {
        const user = { id: "1001", name: "admin", password: "admin" };
        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Укажите путь к вашей странице входа, если она есть
  },
  session: {
    strategy: "jwt", // Используйте JWT для хранения сессий
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Сохраняем id пользователя в токене
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Проверяем, существует ли session.user, если нет, создаем его
        session.user = session.user || {};
        session.user.name = token.name; // Добавляем id пользователя в сессию
      }
      return session;
    },
  },
};
