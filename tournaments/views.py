from django.shortcuts import render

def tournaments(request):
    html_context = {
        'user_name': 'Юля',
    }
    return render(request, 'tournaments/tournaments.html', html_context)
