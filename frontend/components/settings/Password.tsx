"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { updatePassword } from "@/actions/user"
import { UserType } from "@/lib/nextauth"
import toast from "react-hot-toast"

// 入力データの検証ルールを定義
const schema = z
  .object({
    currentPassword: z
      .string()
      .min(3, { message: "3文字以上入力する必要があります" }),
    password: z.string().min(3, { message: "3文字以上入力する必要があります" }),
    repeatedPassword: z
      .string()
      .min(3, { message: "3文字以上入力する必要があります" }),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "新しいパスワードと確認用パスワードが一致しません",
    path: ["repeatedPassword"],
  })

// 入力データの型を定義
type InputType = z.infer<typeof schema>

interface PasswordProps {
  user: UserType
}

// パスワード変更
const Password = ({ user }: PasswordProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // フォームの状態
  const form = useForm<InputType>({
    // 入力値の検証
    resolver: zodResolver(schema),
    // 初期値
    defaultValues: {
      currentPassword: "",
      password: "",
      repeatedPassword: "",
    },
  })

  // 送信
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true)

    try {
      // パスワード変更
      const res = await updatePassword({
        accessToken: user.accessToken,
        currentPassword: data.currentPassword,
        newPassword: data.password,
        reNewPassword: data.repeatedPassword,
      })

      if (!res.success) {
        toast.error("パスワードの変更に失敗しました")
        return
      }

      toast.success("パスワードを変更しました")
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error("パスワードの変更に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="text-xl font-bold text-center mb-5">パスワード変更</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>現在のパスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
            変更
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Password
