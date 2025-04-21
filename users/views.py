from django.http import HttpResponse
from django.shortcuts import render

def profile(request):
    html_context = {
        'user_name': 'Юля',
    }
    return render(request, 'users/profile.html', html_context)

def leaders(request):
    html_context = {
        'user_name': 'Юля',
    }
    return render(request, 'users/leaders.html', html_context)
