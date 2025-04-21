from django.shortcuts import render

def create_game(request):
    return render(request, 'game/create_game.html')
