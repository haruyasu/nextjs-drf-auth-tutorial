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
import { resetPassword } from "@/actions/user"
import toast from "react-hot-toast"
import Link from "next/link"

// 入力データの検証ルールを定義
const schema = z
  .object({
    password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
    repeatedPassword: z
      .string()
      .min(8, { message: "8文字以上入力する必要があります" }),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "新しいパスワードと確認用パスワードが一致しません",
    path: ["repeatedPassword"], // エラーメッセージが適用されるフィールド
  })

// 入力データの型を定義
type InputType = z.infer<typeof schema>

interface ResetPasswordProps {
  uid: string
  token: string
}

// パスワード再設定確認
const ResetPassword = ({ uid, token }: ResetPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)

  // フォームの状態
  const form = useForm<InputType>({
    // 入力値の検証
    resolver: zodResolver(schema),
    // 初期値
    defaultValues: {
      password: "",
      repeatedPassword: "",
    },
  })

  // 送信
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true)

    try {
      // パスワード再設定
      const res = await resetPassword({
        uid,
        token,
        newPassword: data.password,
        reNewPassword: data.repeatedPassword,
      })

      if (!res.success) {
        toast.error("パスワード再設定に失敗しました")
        return
      }

      setIsResetPassword(true)
    } catch (error) {
      toast.error("パスワード再設定に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-[400px] m-auto">
      {isResetPassword ? (
        <div className="text-center">
          <div className="text-2xl font-bold mb-10">パスワード再設定完了</div>

          <div>パスワードの再設定が完了しました</div>
          <div className="mb-5">ログインしてください</div>
          <Button asChild className="font-bold">
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-center mb-10">
            パスワード再設定
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新しいパスワード</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repeatedPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新しいパスワード(確認用)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                送信
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  )
}

export default ResetPassword
