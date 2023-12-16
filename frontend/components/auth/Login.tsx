"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
  password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
})

// 入力データの型を定義
type InputType = z.infer<typeof schema>

// ログイン
const Login = () => {
  const [isLoading, setIsLoading] = useState(false)

  // フォームの状態
  const form = useForm<InputType>({
    // 入力値の検証
    resolver: zodResolver(schema),
    // 初期値
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 送信
  const onSubmit: SubmitHandler<InputType> = (data) => {
    setIsLoading(true)

    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // リダイレクトを無効化
    })
      .then((result) => {
        if (result?.error) {
          // エラーがある場合、エラーメッセージを表示
          toast.error("ログインに失敗しました")
        } else {
          // トップページにリダイレクト
          window.location.href = "/"
        }
      })
      .catch((error) => {
        toast.error("ログインに失敗しました")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="max-w-[400px] m-auto">
      <div className="text-2xl font-bold text-center mb-10">ログイン</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="xxxx@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ログイン
          </Button>
        </form>
      </Form>

      <div className="text-center mt-5">
        <Link href="/reset-password" className="text-sm text-blue-500">
          パスワードを忘れた方はこちら
        </Link>
      </div>

      <div className="text-center mt-2">
        <Link href="/signup" className="text-sm text-blue-500">
          アカウントを作成する
        </Link>
      </div>
    </div>
  )
}

export default Login
