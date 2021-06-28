from django.urls import path

from .views import TestRunRequestAPIView, TestRunRequestItemAPIView, AssetsAPIView, UploadFileAPIView

urlpatterns = [
    path('assets', AssetsAPIView.as_view(), name='assets'),
    path('upload-file', UploadFileAPIView.as_view(), name="upload_file"),
    path('test-run', TestRunRequestAPIView.as_view(), name='test_run_req'),
    path('test-run/<pk>', TestRunRequestItemAPIView.as_view(), name='test_run_req_item'),
]
