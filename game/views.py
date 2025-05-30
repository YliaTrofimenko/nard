from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from .models import GameSession

def create_game(request):
    return render(request, 'game/create_game.html')

# def board(request):
#     return render(request, 'game/board.html')

def new_game(request):
    if request.method == 'POST':
        # Читаем из POST
        game_type = request.POST.get('game_type', 'short')
        side      = request.POST.get('side', 'random')

        # Создаём с учётом выбранных опций
        game = GameSession.objects.create(
            game_type=game_type,
            side=side
        )
        return redirect(reverse("game:board", args=[game.id]))

    # Если GET — просто редиректим на форму
    return redirect('game:create_game')

def board(request, game_id):
    # получаем или 404
    game = get_object_or_404(GameSession, id=game_id)
    return render(request, "game/board.html", {
        "game_id": game.id,
        "game_type": game.game_type,
        "side": game.side,
    })
