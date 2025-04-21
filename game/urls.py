from django.urls import path

from game import views

app_name = 'game'

urlpatterns = [
    path('', views.create_game, name='create_game'),
]
# 1 url-адрес / фукция / обращение
