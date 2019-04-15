(function($){
	$.fn.chess = function(settings){
		// initialization
		var field = [];

		// система наследования: от класса фигуры наследуют классы королевы, короля, пешки, ладьи, коня, слона
		// от этих фигур наследуют их клоны, для черных и для белых со своими позициями. Затем они расставляются.
		// Затем уже отображаются. При ходе будут сравниваться две фигуры.
		// Сделать через прототипы (удобнее)
		// color: true означает былй цвет, false - черный, undefined - пустая клетка
		class Figure{
			constructor(settings) {
				this.color = settings.color;
				this.src = settings.src;
				this.x = settings.x;
				this.y = settings.y;
			}
		}

		for ( var i = 0; i < 8; i++ ) {
			field.push([]);
			for ( var j = 0; j < 8; j++ )
				field[i].push(new Figure({ x: j, y: i })); // color = undefined
		}

		class King extends Figure {
			turn (x, y) {

			}
			check (x, y) {

			}
		}
		class Queen extends Figure {
			turn (x, y) {

			}
			check (x, y) {

			}
		}
		class Rook extends Figure {
			turn (x, y) {

			}
			check (x, y) {

			}
		}
		class Bishop extends Figure {
			turn (x, y) {

			}
			check (x, y) {

			}
		}
		class Horse extends Figure {
			turn (x, y) {

			}
			check (x, y) {

			}
		}
		class Pawn extends Figure {
			constructor (settings) {
				super(settings);
				this.first_turn = true;
			}
			turn (x, y) {
				field[y][x] = this;
				field[this.y][this.x] = new Figure({x: this.x, y: this.y});
				$(`#chess>button[onclick="turn(${this.x}, ${this.y})"]`).html(
					`<img src="${field[this.y][this.x].src != undefined ? field[this.y][this.x].src : ''}" alt="">`
				)
				if (this.first_turn) this.first_turn = false;
				this.x = x;
				this.y = y;
				$(`#chess>button[onclick="turn(${x}, ${y})"]`).html(
					`<img src="${field[y][x].src != undefined ? field[y][x].src : ''}" alt="">`
				)
			}
			check (x, y) {
				if (this.x == x) {
					if (field[this.y + (this.color ? -1 : 1)][x].color != undefined) return false;
					if (this.first_turn && field[this.y + (this.color ? -2 : 2)][x].color != undefined) return false;
					if (this.first_turn) return this.color ? (this.y - y == 2 || this.y - y == 1) 
														   : (y - this.y == 2 || y - this.y == 1);
					else return this.color ? (this.y - y == 1) : (y - this.y == 1);
				} else if (Math.abs(this.x - x) == 1)
					if (this.color && this.y - y == 1 || !this.color && y - this.y == 1)
						return (field[y][x].color != undefined) && (this.color != field[y][x].color);
					else return false;
			}
		}

		// записывать буду сразу на свои позиции

		field[7][4] = new King({ x: 4, y: 7, color: true, src: 'img/wK.png' }); // белый король
		field[0][4] = new King({ x: 4, y: 0, color: false, src: 'img/bK.png' }); // черный король

		field[7][3] = new Queen({ x: 3, y: 7, color: true, src: 'img/wQ.png' }); // белый ферзь
		field[0][3] = new Queen({ x: 3, y: 0, color: false, src: 'img/bQ.png' }); // черный ферзь

		field[7][7] = new Rook({ x: 7, y: 7, color: true, src: 'img/wR.png' }); // белая ладья_1
		field[7][0] = new Rook({ x: 0, y: 7, color: true, src: 'img/wR.png' }); // белая ладья_2
		field[0][7] = new Rook({ x: 7, y: 0, color: false, src: 'img/bR.png' }); // черная ладья_1
		field[0][0] = new Rook({ x: 0, y: 0, color: false, src: 'img/bR.png' }); // черная ладья_2

		field[7][2] = new Bishop({ x: 2, y: 7, color: true, src: 'img/wB.png' }); // белый слон_1
		field[7][5] = new Bishop({ x: 5, y: 7, color: true, src: 'img/wB.png' }); // белый слон_2
		field[0][2] = new Bishop({ x: 2, y: 0, color: false, src: 'img/bB.png' }); // черный слон_1
		field[0][5] = new Bishop({ x: 5, y: 0, color: false, src: 'img/bB.png' }); // черный слон_2

		field[7][1] = new Horse({ x: 1, y: 7, color: true, src: 'img/wN.png' }); // белый конь_1
		field[7][6] = new Horse({ x: 6, y: 7, color: true, src: 'img/wN.png' }); // белый конь_2
		field[0][1] = new Horse({ x: 1, y: 0, color: false, src: 'img/bN.png' }); // черный конь_1
		field[0][6] = new Horse({ x: 6, y: 0, color: false, src: 'img/bN.png' }); // черный конь_2

		for (var i = 0; i < 8; i++) {
			field[6][i] = new Pawn({ x: i, y: 6, color: true, src: 'img/wP.png' }); // белая пешка
			field[1][i] = new Pawn({ x: i, y: 1, color: false, src: 'img/bP.png' }); // черная пешка
		}

		// initializating field

		for (var i = 0; i < 8; i++) 
			for (var j = 0; j < 8; j++) 
				$(this).append(`<button onclick="turn(${j}, ${i})" data-color="${
					(i % 2 == 0) && (j % 2 == 0) || (i % 2 == 1) && (j % 2 == 1) ? 'white' : 'black'
				}">
					<img src="${field[i][j].src != undefined ? field[i][j].src : ''}" alt="">
				</button>`);

		// function turn
		
		var order_now = true; // true == ход белых
		var figure_chosen = undefined; // undefined - фигура не выбрана, 0 - пустая клетка
		window.turn = function (x, y) {
			if (!figure_chosen) { // если undefined
				if (typeof field[y][x] != "object") return;
				if (field[y][x].color == order_now)
					figure_chosen = field[y][x];
				return;
			}
			else {
				if (typeof field[y][x] == "object") {
					if (field[y][x].color != order_now || typeof field[y][x].color == "undefined") {
						if (figure_chosen.check(x, y)) {
							figure_chosen.turn(x, y);
							order_now = !order_now;
							figure_chosen = undefined;
						}
					} else {
						figure_chosen = field[y][x];
					}
				}
			}
		}
	}
})(jQuery);