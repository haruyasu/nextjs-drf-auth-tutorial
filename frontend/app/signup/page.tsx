import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/nextauth"
import Signup from "@/components/auth/Signup"

// アカウント仮登録ページ
const SignupPage = async () => {
  // 認証情報取得
  const user = await getAuthSession()

  if (user) {
    redirect("/")
  }

  return <Signup />
}

export default SignupPage
