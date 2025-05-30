from django.urls import path

from game import views

app_name = 'game'

urlpatterns = [
    path('', views.create_game, name='create_game'),
    # path('board/', views.board, name='board'),
    # создаёт новую сессию и редиректит
    path("new/", views.new_game, name="new_game"),
    # собственно доска игры
    path("<str:game_id>/", views.board, name="board"),
]
# 1 url-адрес / фукция / обращение
