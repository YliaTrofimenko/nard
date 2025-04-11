from django.urls import path

from users import views

urlpatterns = [
    path('profile/', views.profile, name='profile'),
]
# 1 url-адрес / фукция / обращение
