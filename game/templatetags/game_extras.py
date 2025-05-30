from django import template

register = template.Library()

@register.filter(name='to')
def to(value, arg):
    """
    Возвращает список чисел от value до arg включительно (по возрастанию).
    Использование в шаблоне:
        {% load game_extras %}
        {% for i in 1|to:5 %}...{% endfor %}
    """
    try:
        start = int(value)
        end = int(arg)
    except (ValueError, TypeError):
        return []
    if start <= end:
        return list(range(start, end + 1))
    return []

@register.filter(name='down_to')
def down_to(value, arg):
    """
    Возвращает список чисел от value до arg включительно (по убыванию).
    Использование в шаблоне:
        {% load game_extras %}
        {% for i in 12|down_to:1 %}...{% endfor %}
    """
    try:
        start = int(value)
        end = int(arg)
    except (ValueError, TypeError):
        return []
    if start >= end:
        return list(range(start, end - 1, -1))
    return []
