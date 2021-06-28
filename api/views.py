from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from api.models import TestRunRequest, TestFilePath
from api.serializers import TestRunRequestSerializer, TestRunRequestItemSerializer
from api.tasks import execute_test_run_request
from api.usecases import get_assets
import os
import logging

logger = logging.getLogger(__name__)


class TestRunRequestAPIView(ListCreateAPIView):
    serializer_class = TestRunRequestSerializer
    queryset = TestRunRequest.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        instance = serializer.save()
        execute_test_run_request.delay(instance.id)


class TestRunRequestItemAPIView(RetrieveAPIView):
    serializer_class = TestRunRequestItemSerializer
    queryset = TestRunRequest.objects.all()
    lookup_field = 'pk'


class AssetsAPIView(APIView):

    def get(self, request):
        return Response(status=status.HTTP_200_OK, data=get_assets())


class UploadFileAPIView(APIView):

    def post(self, request):
        file = request.FILES.get('file', None)
        upload_to = settings.USER_TEST_BASE_DIRS
        try:
            fs = FileSystemStorage(upload_to)
            if file:
                if not file.name.endswith(".py"):
                    return Response(data={"message": "Please select python file."},
                                    status=status.HTTP_400_BAD_REQUEST)
                filename = fs.save(file.name, file)
                path = os.path.join(upload_to, filename)[6:]
                TestFilePath.objects.create(path=path)
                return Response(data={"message": "File uploaded with path: {}".format(path)}, status=status.HTTP_200_OK)
            else:
                return Response(data={"message": "Please upload file."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(e)

        return Response(data={"message": "Fail to upload file."}, status=status.HTTP_400_BAD_REQUEST)
