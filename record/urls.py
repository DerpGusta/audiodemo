from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('',views.recorder,name="recorder"),
    path('upload/',views.upload,name="upload"),
]