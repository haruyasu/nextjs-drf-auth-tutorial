import { authOptions } from "@/lib/nextauth"
import NextAuth from "next-auth/next"

// NextAuth関数に設定オプションを渡して認証ハンドラを作成
const handler = NextAuth(authOptions)

// 作成したハンドラをGETとPOSTのリクエストハンドラとしてエクスポート
export { handler as GET, handler as POST }
