const board = document.getElementById("board");

// прочитаем все три атрибута
const gameId = board.dataset.gameId;
const gameType = board.dataset.gameType;  // "short" или "long"
const side = board.dataset.side;      // "white", "black" или "random"

const points = [];  // 24 точки на доске

let colWidth, colHeight, pieceSize, offsetX, offsetY;
function recalcSizes() {
    // Размеры треугольников
    colWidth = board.offsetWidth / 12;
    colHeight = board.offsetHeight / 2;

    pieceSize = colWidth - 25;  // Размер фишки
    offsetX = (colWidth - pieceSize) / 2;  // Смещение по x от края треугольника
    offsetY = pieceSize + 5;  // Смещение по y (5 - это расстояние между фишками)
}

document.addEventListener('DOMContentLoaded', () => {
    recalcSizes();

    // Создаём 24 точки на доске
    for (let i = 0; i < 24; i++) {
        const point = document.createElement("div");
        point.classList.add("point");
        point.dataset.point = i;

        // Вычисляем позицию точки
        const x = (i < 12) ? (colWidth * i) : (colWidth * (23 - i));
        const y = (i < 12) ? 0 : colHeight;

        point.style.left = x + "px";
        point.style.top = y + "px";
        point.pieceCount = 0;      // счётчик фишек
        board.appendChild(point);
        points.push(point);
    }

    // Стартовые позиции фишек
    var startPositions;
    if (gameType == 'short') {
        startPositions = [
            { point: 0,  count: 5, color: 'white' },
            { point: 11,  count: 2, color: 'white' },
            { point: 17,  count: 5, color: 'white' },
            { point: 19,  count: 3, color: 'white' },
            { point: 4, count: 3, color: 'black' },
            { point: 6, count: 5, color: 'black' },
            { point: 12, count: 2, color: 'black' },
            { point: 23, count: 5, color: 'black' },
        ];
    }
    else {
        startPositions = [
            { point: 11,  count: 15, color: 'white' },
            { point: 23, count: 15, color: 'black' },
        ];
    }

    // Размещаем фишки на доске
    startPositions.forEach(({ point, count, color }) => {
        const currentPoint = points[point];
        for (let i = 0; i < count; i++) {
            const piece = createPiece(color);

            piece.style.width  = pieceSize + 'px';
            piece.style.height = pieceSize + 'px';

            // центруем по оси X
            piece.style.left = (currentPoint.offsetLeft + offsetX) + 'px';

            // смещаем Y в зависимости от количества фишек
            const topPos = (point < 12)
                ? (offsetY * currentPoint.pieceCount)
                : (board.offsetHeight - pieceSize - offsetY * currentPoint.pieceCount - 2);
            piece.style.top = topPos + 'px';

            // Запоминаем свою точку
            piece.dataset.pointIndex = point;

            board.appendChild(piece);
            currentPoint.pieceCount++;

            // Делаем фишку перетаскиваемой
            initDragAndDrop(piece);
        }
    });
});

/**
 * Инициализация перетаскивания фишки с помощью Pointer Events
 * @param {HTMLElement} piece
 */
function initDragAndDrop(piece) {
    let startX, startY, origX, origY;
    let dragging = false;

    // Обработчик начала перетаскивания
    piece.addEventListener('pointerdown', e => {
        e.preventDefault();
        dragging = true;
        piece.setPointerCapture(e.pointerId);

        // Текущая позиция мышки и фишки
        startX = e.clientX;
        startY = e.clientY;
        origX  = parseInt(piece.style.left);
        origY  = parseInt(piece.style.top);

        piece.classList.add('dragging');
    });

    // Обработчик движения
    piece.addEventListener('pointermove', e => {
        if (!dragging) return;
        // Вычисляем смещение
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        // Передвигаем фишку
        piece.style.left = (origX + dx) + 'px';
        piece.style.top  = (origY + dy) + 'px';
    });

    // Обработчик конца перетаскивания
    piece.addEventListener('pointerup', e => {
        if (!dragging) return;
        dragging = false;
        piece.releasePointerCapture(e.pointerId);
        piece.classList.remove('dragging');

        // Ищем ближайший поинт под фишкой
        const dropPoint = findNearestPoint(e.clientX, e.clientY);
        // console.log("№ "+parseInt(dropPoint.dataset.point));
        if (dropPoint !== null) {
            movePieceToPoint(piece, dropPoint);
        } else {
            // Если нет точки, возвращаем на прежнее место
            restorePiecePosition(piece);
        }
    });
}

/**
 * Находит ближайшую точку к координатам курсора
 * @param {number} x - Координата курсора
 * @param {number} y - Координата курсора
 * @returns {HTMLElement|null} - Ближайший треугольник
 */
function findNearestPoint(x, y) {
    let closest = null;
    let minDist = Infinity;
    points.forEach(pt => {
        const rect = pt.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dist = Math.hypot(x - cx, y - cy);
        if (dist < minDist) {
            minDist = dist;
            closest = pt;
        }
    });
    return closest;
}

/**
 * Перемещает фишку на новую точку и обновляет счётчики
 * @param {HTMLElement} piece
 * @param {HTMLElement} newPoint
 */
function movePieceToPoint(piece, newPoint) {
    const oldIndex = parseInt(piece.dataset.pointIndex);
    const oldPoint = points[oldIndex];
    // Уменьшаем счётчик старой точки
    oldPoint.pieceCount = Math.max(0, oldPoint.pieceCount - 1);

    // Вычисляем новую позицию в стеке
    const newIndex = parseInt(newPoint.dataset.point);
    const stackPos = newPoint.pieceCount;
    const topPos = (newIndex < 12)
                ? (offsetY * stackPos)
                : (board.offsetHeight - pieceSize - offsetY * stackPos - 2);
    // Ставим фишку на поинт
    piece.style.left = (newPoint.offsetLeft + offsetX) + 'px';
    piece.style.top = topPos + 'px';
    piece.dataset.pointIndex = newIndex;

    // Увеличиваем счётчик новой точки
    newPoint.pieceCount++;
}

/**
 * Возвращает фишку на её прежнюю точку (при неудачном дропе)
 * @param {HTMLElement} piece
 */
function restorePiecePosition(piece) {
    const idx = parseInt(piece.dataset.pointIndex);
    const pt  = points[idx];
    const stackPos = pt.pieceCount;
    const left = pt.offsetLeft + offsetX;
    let top;
    if (idx < 12) {
        top = offsetY * (stackPos - 1);
    } else {
        top = board.offsetHeight - pieceSize - offsetY * (stackPos - 1) - 2;
    }
    piece.style.left = left + 'px';
    piece.style.top  = top  + 'px';
}


/** Функция создания фишки
 * @param {string} color - Цвет создаваемой фишки
 * @param {HTMLElement} piece - Созданная фишка
 */
function createPiece(color) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    if (color === 'black') piece.classList.add('black');
    return piece;
}

const rollBtn = document.getElementById('roll-button');
const die1El  = document.getElementById('die1');
const die2El  = document.getElementById('die2');

// текущее состояние кубиков
let dice = [0, 0];

/**
 * Кидает два кубика и рисует их на экране
 */
function rollDice() {
  // генерируем два числа от 1 до 6
  dice[0] = Math.floor(Math.random() * 6) + 1;
  dice[1] = Math.floor(Math.random() * 6) + 1;

  // отображаем
  die1El.textContent = dice[0];
  die2El.textContent = dice[1];

  // при желании: разблокировать ход (lock/unlock фишек)
  // enablePiecesMove();
}

// назначаем обработчик
rollBtn.addEventListener('click', rollDice);

// Chat logic
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  appendMessage('Вы', text);
  chatInput.value = '';

  // Здесь можно отправлять текст на сервер или WebSocket
  // например: socket.emit('chat_message', text);
});

// Функция добавления сообщения в окно чата
function appendMessage(sender, message) {
  const msgEl = document.createElement('div');
  msgEl.classList.add('chat-message');
  msgEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(msgEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Пример получения сообщений от собеседника (через WebSocket)
// socket.on('chat_message', ({sender, text}) => {
//   appendMessage(sender, text);
//});