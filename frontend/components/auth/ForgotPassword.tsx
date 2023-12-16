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
import { forgotPassword } from "@/actions/user"
import toast from "react-hot-toast"

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
})

// 入力データの型を定義
type InputType = z.infer<typeof schema>

// パスワード再設定
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  // フォームの状態
  const form = useForm<InputType>({
    // 入力値の検証
    resolver: zodResolver(schema),
    // 初期値
    defaultValues: {
      email: "",
    },
  })

  // 送信
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true)

    try {
      // パスワード再設定
      const res = await forgotPassword(data)

      if (!res.success) {
        toast.error("パスワード再設定に失敗しました")
        return
      }

      setIsForgotPassword(true)
    } catch (error) {
      toast.error("パスワード再設定に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-[400px] m-auto">
      {isForgotPassword ? (
        <>
          <div className="text-2xl font-bold text-center mb-10">
            パスワード再設定メール送信
          </div>
          <div className="">
            パスワード再設定に必要なメールを送信しました。
            <br />
            メールのURLよりパスワード再設定画面へ進んでいただき、パスワードを再設定してください。
            <br />
            ※メールが届かない場合、入力したメールアドレスが間違っている可能性があります。
            <br />
            お手数ですが、再度、パスワード再設定からやり直してください。
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold text-center mb-10">
            パスワード再設定
          </div>

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

export default ForgotPassword
