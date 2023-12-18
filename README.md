# Next.js14 と Django5 で作る！認証システム構築入門

このリポジトリは、Next.js14 と Django5 で作る！認証システム構築入門に関するものです。

![画像](https://res.cloudinary.com/dhaciqd0v/image/upload/v1702881955/LINE/youtube_dqrygv.png)

[動画チュートリアル](https://youtu.be/Jzp3ZAL0PFA)

[解説](https://zenn.dev/hathle/books/next-drf-auth-book)

主な機能:

- 認証
  - ログイン
  - サインアップ
  - ログアウト
  - パスワード再設定
- アカウント設定
  - プロフィール編集
  - パスワード変更
- プロフィール表示

## バックエンド

### .env ファイルの設定

```env
CLOUDINARY_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
DEFAULT_FROM_EMAIL="xxx@gmail.com"
EMAIL_BACKEND="django.core.mail.backends.console.EmailBackend"
EMAIL_HOST_USER="xxx@gmail.com"
EMAIL_HOST_PASSWORD=""
EMAIL_HOST=smtp.gmail.com
SITE_DOMAIN=localhost:3000
SITE_NAME=""
```

## フロントエンド

### .env ファイルの設定

```env
NEXTAUTH_SECRET=""
NEXTAUTH_URL=http://localhost:3000
API_URL=http://localhost:8000
```
