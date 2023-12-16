import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"

// NextAuthとJWTの型を拡張してアクセストークンとリフレッシュトークンを含める
declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}

// ユーザー型の定義
export interface UserType {
  accessToken: string
  uid: string
  name: string
  email: string
  avatar: string | undefined
  introduction: string
}

// 共通のAPIリクエスト
const fetchAPI = async (url: string, options: RequestInit) => {
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    throw new Error("API URLが設定されていません")
  }

  const response = await fetch(`${apiUrl}${url}`, options)

  if (!response.ok) {
    throw new Error("APIでエラーが発生しました")
  }

  return response.json()
}

// アクセストークンの検証
const verifyAccessToken = async (token: JWT) => {
  return fetchAPI("/api/auth/jwt/verify/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token.accessToken }),
  }).then((res) => res.ok)
}

// アクセストークンの更新
const refreshAccessToken = async (token: JWT) => {
  const { access } = await fetchAPI("/api/auth/jwt/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: token.refreshToken }),
  })

  return {
    accessToken: access,
    refreshToken: token.refreshToken,
  }
}

// ユーザー情報取得
const authorizeUser = async (email: string, password: string) => {
  const session = await fetchAPI("/api/auth/jwt/create/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const user = await fetchAPI("/api/auth/users/me/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${session.access}`,
    },
  })

  return {
    ...session,
    user,
  }
}

// NextAuth設定
export const authOptions: NextAuthOptions = {
  // 認証プロバイダーの設定
  providers: [
    // メールアドレス認証
    CredentialsProvider({
      name: "credentials",
      credentials: {
        // メールアドレスとパスワード
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください")
        }

        // ユーザー情報を取得
        return authorizeUser(credentials.email, credentials.password)
      },
    }),
  ],
  // セッションの設定
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        return {
          ...token,
          accessToken: user.access,
          refreshToken: user.refresh,
        }
      }

      // アクセストークンの検証
      if (await verifyAccessToken(token)) {
        return token
      }

      // アクセストークンの更新
      return refreshAccessToken(token)
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken

      return session
    },
  },
}

// 認証情報取得
export const getAuthSession = async () => {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return null
  }

  // ユーザー情報を取得
  const user = await fetchAPI("/api/auth/users/me/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${session.accessToken}`,
    },
  })

  const userData: UserType = {
    ...user,
    accessToken: session.accessToken,
  }

  return userData
}
