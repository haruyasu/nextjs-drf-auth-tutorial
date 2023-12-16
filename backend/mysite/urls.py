from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    # アカウント
    path("api/", include("accounts.urls")),
    # 管理画面
    path("admin/", admin.site.urls),
]
