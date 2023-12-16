import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/nextauth"
import ForgotPassword from "@/components/auth/ForgotPassword"

// パスワード再設定ページ
const ForgotPasswordPage = async () => {
  // 認証情報取得
  const user = await getAuthSession()

  if (user) {
    redirect("/")
  }

  return <ForgotPassword />
}

export default ForgotPasswordPage
