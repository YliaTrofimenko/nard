// Добавляем обработчики событий на кнопки
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnCreateGame').addEventListener('click', function () {
        window.location.href = "game/";
    });
    document.getElementById('btnProfile').addEventListener('click', function () {
        window.location.href = "profile/";
    });
});