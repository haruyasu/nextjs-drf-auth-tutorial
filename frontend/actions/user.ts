"use server"

interface TemporarrySignupProps {
  name: string
  email: string
  password: string
  rePassword: string
}

// アカウント仮登録
export const temporarrySignup = async ({
  name,
  email,
  password,
  rePassword,
}: TemporarrySignupProps) => {
  try {
    const body = JSON.stringify({
      name,
      email,
      password,
      re_password: rePassword,
    })

    // アカウント仮登録を送信
    const apiRes = await fetch(`${process.env.API_URL}/api/auth/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    // APIレスポンスが正常でない場合、失敗を返す
    if (!apiRes.ok) {
      return {
        success: false,
      }
    }

    // 成功を返す
    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗を返す
    return {
      success: false,
    }
  }
}

interface CompleteSignupProps {
  uid: string
  token: string
}

// アカウント本登録
export const completeSignup = async ({ uid, token }: CompleteSignupProps) => {
  try {
    const body = JSON.stringify({
      uid,
      token,
    })

    // アカウント本登録を送信
    const apiRes = await fetch(
      `${process.env.API_URL}/api/auth/users/activation/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    )

    // APIレスポンスが正常でない場合、失敗を返す
    if (!apiRes.ok) {
      return {
        success: false,
      }
    }

    // 成功を返す
    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗を返す
    return {
      success: false,
    }
  }
}

interface ForgotPasswordProps {
  email: string
}

// パスワード再設定
export const forgotPassword = async ({ email }: ForgotPasswordProps) => {
  try {
    const body = JSON.stringify({
      email,
    })

    // パスワード再設定を送信
    const apiRes = await fetch(
      `${process.env.API_URL}/api/auth/users/reset_password/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    )

    // APIレスポンスが正常でない場合、失敗を返す
    if (!apiRes.ok) {
      return {
        success: false,
      }
    }

    // 成功を返す
    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗を返す
    return {
      success: false,
    }
  }
}

interface ResetPasswordProps {
  uid: string
  token: string
  newPassword: string
  reNewPassword: string
}

// パスワード再設定確認
export const resetPassword = async ({
  uid,
  token,
  newPassword,
  reNewPassword,
}: ResetPasswordProps) => {
  try {
    const body = JSON.stringify({
      uid,
      token,
      new_password: newPassword,
      re_new_password: reNewPassword,
    })

    // パスワード再設定確認を送信
    const apiRes = await fetch(
      `${process.env.API_URL}/api/auth/users/reset_password_confirm/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    )

    // APIレスポンスが正常でない場合、失敗を返す
    if (!apiRes.ok) {
      return {
        success: false,
      }
    }

    // 成功を返す
    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗を返す
    return {
      success: false,
    }
  }
}

export interface UserDetailType {
  uid: string
  name: string
  email: string
  avatar: string | undefined
  introduction: string
  created_at: string
}

interface GetUserDetailProps {
  userId: string
}

// ユーザー詳細取得
export const getUserDetail = async ({ userId }: GetUserDetailProps) => {
  try {
    // APIからユーザー詳細を取得
    const apiRes = await fetch(`${process.env.API_URL}/api/users/${userId}/`, {
      method: "GET",
      cache: "no-store",
    })

    // APIレスポンスが正常でない場合、失敗とnullを返す
    if (!apiRes.ok) {
      return {
        success: false,
        user: null,
      }
    }

    // レスポンスをJSONとして解析し、ユーザー詳細を取得
    const user: UserDetailType = await apiRes.json()

    // 成功と取得したユーザー詳細を返す
    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗とnullを返す
    return {
      success: false,
      user: null,
    }
  }
}

interface UpdateUserProps {
  accessToken: string
  name: string
  introduction: string | undefined
  avatar: string | undefined
}

// プロフィール編集
export const updateUser = async ({
  accessToken,
  name,
  introduction,
  avatar,
}: UpdateUserProps) => {
  try {
    const body = JSON.stringify({
      name,
      introduction,
      avatar,
    })

    // プロフィール編集を送信
    const apiRes = await fetch(`${process.env.API_URL}/api/auth/users/me/`, {
      method: "PATCH",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    })

    // APIレスポンスが正常でない場合、失敗とnullを返す
    if (!apiRes.ok) {
      return {
        success: false,
        user: null,
      }
    }

    // レスポンスをJSONとして解析し、ユーザー詳細を取得
    const user: UserDetailType = await apiRes.json()

    // 成功と取得したユーザー詳細を返す
    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗とnullを返す
    return {
      success: false,
      user: null,
    }
  }
}

interface UpdatePasswordProps {
  accessToken: string
  currentPassword: string
  newPassword: string
  reNewPassword: string
}

// パスワード変更
export const updatePassword = async ({
  accessToken,
  currentPassword,
  newPassword,
  reNewPassword,
}: UpdatePasswordProps) => {
  try {
    const body = JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      re_new_password: reNewPassword,
    })

    // パスワード変更を送信
    const apiRes = await fetch(
      `${process.env.API_URL}/api/auth/users/set_password/`,
      {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body,
      }
    )

    // APIレスポンスが正常でない場合、失敗を返す
    if (!apiRes.ok) {
      return {
        success: false,
      }
    }

    // 成功を返す
    return {
      success: true,
    }
  } catch (error) {
    console.error(error)
    // エラー発生時に、失敗を返す
    return {
      success: false,
    }
  }
}
