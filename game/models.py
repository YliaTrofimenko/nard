import uuid
from django.db import models

def generate_short_id():
    # берём первые 8 символов от uuid4
    return uuid.uuid4().hex[:8]

class GameSession(models.Model):
    """
    Одна сессия игры. PK — короткая строка длиной 8 символов.
    """
    GAME_TYPES = [
      ('short', 'Короткие нарды'),
      ('long',  'Длинные нарды'),
    ]
    SIDES = [
      ('random', 'Случайно'),
      ('white',  'Белые'),
      ('black',  'Чёрные'),
    ]

    id = models.CharField(
        max_length=8,
        primary_key=True,
        default=generate_short_id,
        editable=False,
        unique=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    game_type = models.CharField(
        max_length=5,
        choices=GAME_TYPES,
        default='short',
    )

    side = models.CharField(
        max_length=6,
        choices=SIDES,
        default='random',
    )

    def __str__(self):
        return f"{self.id} [{self.get_game_type_display()}, {self.get_side_display()}]"
