import base64

from rest_framework import serializers
from django.core.files.base import ContentFile


# Base64エンコードされた画像データを処理
class Base64ImageField(serializers.ImageField):
    # 入力データをPythonデータタイプに変換
    def to_internal_value(self, data):
        # Base64でエンコードされた画像データを処理
        if isinstance(data, str) and data.startswith("data:image"):
            # Base64データを取り出す
            format, imgstr = data.split(";base64,")
            # 画像の拡張子を取得
            ext = format.split("/")[-1]
            # Base64エンコードされた画像データをデコードし、ContentFileオブジェクトを作成
            data = ContentFile(base64.b64decode(imgstr), name="temp." + ext)

        # 継承されたImageFieldのto_internal_valueメソッドを呼び出し、処理済みのデータを渡す
        return super(Base64ImageField, self).to_internal_value(data)
