from django.urls import path

from users import views

app_name = 'users'

urlpatterns = [
    path('profile/', views.profile, name='profile'),
    path('leaders/', views.leaders, name='leaders'),
]
# 1 url-адрес / фукция / обращение
