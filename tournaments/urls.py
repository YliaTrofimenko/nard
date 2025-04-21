from django.urls import path

from tournaments import views

app_name = 'tournaments'

urlpatterns = [
    path('', views.tournaments, name='tournaments'),
]
# 1 url-адрес / фукция / обращение
