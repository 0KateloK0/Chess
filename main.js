(function($){
	$.fn.chess = function(settings){
		// initialization
		var field = [];

		function find_enemy_king () {
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					if ((field[i][j] instanceof King) && (field[i][j].color != order_now)) 
						return {x: j, y: i};
		}

		function check_enemy() {
			var kp = find_enemy_king();
			return field.some( (a) => a.some( (b) => b.check(kp.x, kp.y) ) );
		}

		function find_union_king() {
			for (var i = 0; i < 8; i++)
				for (var j = 0; j < 8; j++)
					if ((field[i][j] instanceof King) && (field[i][j].color == order_now)) 
						return {x: j, y: i};
		}

		function check_union() {
			var kp = find_union_king();
			return field.some( (a) => a.some( (b) => b.check(kp.x, kp.y) ) );
		}

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

			defends () { return false; }
			check () { return false; }

			test (x, y) {
				if ((field[y][x].color == undefined) || (field[y][x].color != this.color)) {
					var prev_figure = new field[y][x].constructor(field[y][x]);
					var [tx, ty] = [this.x, this.y];
					this.turn(x, y);
					var res = check_union();
					this.turn(tx, ty);
					field[y][x] = new prev_figure.constructor(prev_figure);
					return !res;
				}
				else return false;
			}

			get table (){
				var table = [];
				for (var i = 0; i < 8; i++) {
					table.push([]);
					for (var j = 0; j < 8; j++)
						table[i].push( this.defends(j, i) );
				}
				return table;
			}

			get table_turns () {
				var table_turns = [];
				for (var i = 0; i < 8; i++) {
					table_turns.push([]);
					for (var j = 0; j < 8; j++)
						table_turns[i].push( this.check(j, i) );
				}
				return table_turns;
			}

			show() {
				var t = this.table_turns;
				for (var i = 0; i < 8; i++)
					for (var j = 0; j < 8; j++)
						if (t[i][j])
							$(`#chess>button[onclick="turn(${j}, ${i})"]`).css('background', 'green');
			}

			unshow() {
				$('#chess>button').attr('style', '');
			}
		}

		for ( var i = 0; i < 8; i++ ) {
			field.push([]);
			for ( var j = 0; j < 8; j++ )
				field[i].push(new Figure({ x: j, y: i })); // color = undefined
		}

		// будем считать, что перед любым ходом быудет выполняться проверка, потому функция turn упрощается
		// и становится универсальной

		class King extends Figure {
			constructor (settings) {
				super(settings);
				this.first_turn = settings.first_turn;
			}
			turn (x, y) { // своя ф-ция хода, ибо ракировка
				super.turn(x, y);
				if (this.first_turn) this.first_turn = false;
			}
			check (x, y) { // O(n^3)
				if ((Math.abs(this.x - x) <= 1) && (Math.abs(this.y - y) <= 1)) {
					for (var i = 0; i < 8; i++) 
						for (var j = 0; j < 8; j++) 
							if (!((i == this.y) && (j == this.x)))
								if ((field[i][j].color != this.color) && field[i][j].defends(x, y))
									return false;
					return (field[y][x].color != this.color) || (field[y][x].color == undefined);
				}
				else return false;
			}
			defends (x, y) {
				if (!((this.x == x) && (this.y == y)))
					return (Math.abs(this.x - x) <= 1) && (Math.abs(this.y - y) <= 1);
				else return false;
			}
		}

		class Queen extends Figure {
			check (x, y) {
				if (this.x == x) {
					for (var i = this.y - Math.sign(this.y-y); i != y; i -= Math.sign(this.y-y))
						if (field[i][x].color != undefined) return false;
					if (field[y][x] instanceof King) return true;
					else return this.test(x, y);
				}
				else if (this.y == y) {
					for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
						if (field[y][i].color != undefined) return false;
					return this.test(x, y);
				}
				else if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
					var i = this.y - Math.sign(this.y-y);
					var j = this.x - Math.sign(this.x-x);
					while ((i != y) && (j != x)) {
						if (field[i][j].color != undefined) return false;
						i -= Math.sign(this.y - y);
						j -= Math.sign(this.x - x);
					}
					return this.test(x, y);
				}
				else return false;
			}
			defends (x, y) {
				if (!((this.x == x) && (this.y == y)))
					if (this.x == x) {
						for (var i = this.y - Math.sign(this.y-y); i != y; i -= Math.sign(this.y-y))
							if (!(field[i][x] instanceof King) && (field[i][x].color != undefined)) return false;
						return true;
					}
					else if (this.y == y) {
						for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
							if (!(field[i][x] instanceof King) && (field[y][i].color != undefined)) return false;
						return true;
					}
					else if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
						var i = this.y - Math.sign(this.y-y);
						var j = this.x - Math.sign(this.x-x);
						while ((i != y) && (j != x)) {
							if (!(field[i][j] instanceof King) && (field[i][j].color != undefined)) return false;
							i -= Math.sign(this.y - y);
							j -= Math.sign(this.x - x);
						}
						return true;
					}
					else return false;
				else return false;
			}
		}
		class Rook extends Figure {
			constructor (settings) {
				super(settings);
				this.first_turn = settings.first_turn;
			}
			turn (x, y) {
				super.turn(x, y);
				if (this.first_turn) this.first_turn = false;
			}
			check (x, y) {
				if (this.x == x) {
					for (var i = this.y - Math.sign(this.y-y); i != y; i -= Math.sign(this.y-y))
						if (field[i][x].color != undefined) return false;
					return this.test(x, y);
				}
				else if (this.y == y){
					for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
						if (field[y][i].color != undefined) return false;
					return this.test(x, y);
				}
				else return false;
			}
			defends (x, y) {
				if (!((this.x == x) && (this.y == y)))
					if (this.x == x) {
						for (var i = this.y - Math.sign(this.y-y); i != y; i -= Math.sign(this.y-y))
							if (!(field[i][x] instanceof King) && (field[i][x].color != undefined)) return false;
						return true;
					}
					else if (this.y == y){
						for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
							if (!(field[y][i] instanceof King) && (field[y][i].color != undefined)) return false;
						return true;
					}
					else return false;
				else return false;
			}
		}
		class Bishop extends Figure {
			check (x, y) {
				if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
					var i = this.y - Math.sign(this.y-y);
					var j = this.x - Math.sign(this.x-x);
					while ((i != y) && (j != x)) {
						if (field[i][j].color != undefined) return false;
						i -= Math.sign(this.y - y);
						j -= Math.sign(this.x - x);
					}
					return this.test(x, y);
				}
				else return false;
			}
			defends (x, y) {
				if (!((this.x == x) && (this.y == y)))
					if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
						var i = this.y - Math.sign(this.y-y);
						var j = this.x - Math.sign(this.x-x);
						while ((i != y) && (j != x)) {
							if (!(field[i][x] instanceof King) && (field[i][j].color != undefined)) return false;
							i -= Math.sign(this.y - y);
							j -= Math.sign(this.x - x);
						}
						return true;
					}
					else return false;
				else return false;
			}
		}
		class Horse extends Figure {
			check (x, y) {
				if (((Math.abs(this.x - x) == 2) && (Math.abs(this.y - y) == 1)) ||
					((Math.abs(this.x - x) == 1) && (Math.abs(this.y - y) == 2))) 
					return this.test(x, y);
				else return false;
			}
			defends (x, y) {
				if (!((this.x == x) && (this.y == y)))
					return (((Math.abs(this.x - x) == 2) && (Math.abs(this.y - y) == 1)) ||
						((Math.abs(this.x - x) == 1) && (Math.abs(this.y - y) == 2)));
				else return false;
			}
		}
		class Pawn extends Figure {
			constructor (settings) {
				super(settings);
				this.first_turn = settings.first_turn;
			}
			turn(x, y) {
				super.turn(x, y);
				if (this.first_turn) this.first_turn = false;
			}
			check (x, y) {
				if (this.x == x) {
					if (field[this.y + (this.color ? -1 : 1)][x].color != undefined) return false;
					if (this.first_turn && field[this.y + (this.color ? -2 : 2)][x].color != undefined) return false;
					if (this.first_turn) return this.color ? (this.y - y == 2 || this.y - y == 1) 
														   : (y - this.y == 2 || y - this.y == 1);
					else return this.color ? (this.y - y == 1) : (y - this.y == 1);
				}
				else if (Math.abs(this.x - x) == 1)
					if (this.color && this.y - y == 1 || !this.color && y - this.y == 1)
						return (field[y][x].color != undefined) && (this.color != field[y][x].color);
					else return false;
			}
			defends (x, y) {
				if (!((this.x == x) && (this.y == y)))
					if (Math.abs(this.x - x) == 1)
						if (this.color && this.y - y == 1 || !this.color && y - this.y == 1)
							return true;
						else return false;
				else return false;
			}
		}

		// записывать буду сразу на свои позиции

		field[7][4] = new King({ x: 4, y: 7, color: true, src: 'img/wK.png', first_turn: true }); // белый король
		field[0][4] = new King({ x: 4, y: 0, color: false, src: 'img/bK.png', first_turn: true }); // черный король

		field[7][3] = new Queen({ x: 3, y: 7, color: true, src: 'img/wQ.png' }); // белый ферзь
		field[0][3] = new Queen({ x: 3, y: 0, color: false, src: 'img/bQ.png' }); // черный ферзь

		field[7][7] = new Rook({ x: 7, y: 7, color: true, src: 'img/wR.png', first_turn: true }); // белая ладья_1
		field[7][0] = new Rook({ x: 0, y: 7, color: true, src: 'img/wR.png', first_turn: true }); // белая ладья_2
		field[0][7] = new Rook({ x: 7, y: 0, color: false, src: 'img/bR.png', first_turn: true }); // черная ладья_1
		field[0][0] = new Rook({ x: 0, y: 0, color: false, src: 'img/bR.png', first_turn: true }); // черная ладья_2

		field[7][2] = new Bishop({ x: 2, y: 7, color: true, src: 'img/wB.png' }); // белый слон_1
		field[7][5] = new Bishop({ x: 5, y: 7, color: true, src: 'img/wB.png' }); // белый слон_2
		field[0][2] = new Bishop({ x: 2, y: 0, color: false, src: 'img/bB.png' }); // черный слон_1
		field[0][5] = new Bishop({ x: 5, y: 0, color: false, src: 'img/bB.png' }); // черный слон_2

		field[7][1] = new Horse({ x: 1, y: 7, color: true, src: 'img/wN.png' }); // белый конь_1
		field[7][6] = new Horse({ x: 6, y: 7, color: true, src: 'img/wN.png' }); // белый конь_2
		field[0][1] = new Horse({ x: 1, y: 0, color: false, src: 'img/bN.png' }); // черный конь_1
		field[0][6] = new Horse({ x: 6, y: 0, color: false, src: 'img/bN.png' }); // черный конь_2

		for (var i = 0; i < 8; i++) {
			field[6][i] = new Pawn({ x: i, y: 6, color: true, src: 'img/wP.png', first_turn: true }); // белая пешка
			field[1][i] = new Pawn({ x: i, y: 1, color: false, src: 'img/bP.png', first_turn: true }); // черная пешка
		}

		// initializating field

		for (var i = 0; i < 8; i++) 
			for (var j = 0; j < 8; j++) 
				$(this).append(`<button onclick="turn(${j}, ${i})" data-color="${
					(i % 2 == 0) && (j % 2 == 0) || (i % 2 == 1) && (j % 2 == 1) ? 'white' : 'black'
				}">
					<img src="${field[i][j].src != undefined ? field[i][j].src : ''}" alt="">
				</button>`);

		var order_now = true; // true == ход белых
		var figure_chosen = undefined; // undefined - фигура не выбрана

		function checkmate() {
			var kp = find_enemy_king();
			if (check_enemy()) 
				if (field[kp.y][kp.x].table_turns.every((a) => a.every((b) => !b))) {
					var arr = [];
					for (var i = 0; i < 8; i++) 
						for (var j = 0; j < 8; j++) 
							if (field[i][j].check(kp.x, kp.y))
								arr.push({x: j, y: i});
					if (arr.length == 1)
						if (field[arr[0].y][arr[0].x] instanceof Horse) return true;
						else if (field[arr[0].y][arr[0].x] instanceof Pawn) return true;
						else if (field.some( (a) => a.some( (b) => b.check(arr[0].x, arr[0].y) ) ) )
							return false;
						else {
							if (kp.x == arr[0].x) {
								for (var i = arr[0].y - Math.sign(arr[0].y-kp.y); i != kp.y; i -= Math.sign(arr[0].y-kp.y))
									for (let j = 0; j < 8; j++)
										for (let m = 0; m < 8; m++)
											if ((field[j][m].color != order_now) && field[j][m].check(arr[0].x, i))
												return false;
								return true;
							}
							else if (arr[0].y == kp.y) {
								for (var i = arr[0].x - Math.sign(arr[0].x-kp.x); i != kp.x; i -= Math.sign(arr[0].x-kp.x))
									for (let j = 0; j < 8; j++) 
										for (let m = 0; m < 8; m++)
											if ((field[j][m].color != order_now) && field[j][m].check(i, arr[0].y))
												return false;
								return true;
							}
							else if (Math.abs(arr[0].y - kp.y) == Math.abs(arr[0].x - kp.x)) {
								var i = arr[0].y - Math.sign(arr[0].y-kp.y);
								var j = arr[0].x - Math.sign(arr[0].x-kp.x);
								while ((i != kp.y) && (j != kp.x)) {
									for (let m = 0; m < 8; m++)
										for (let l = 0; l < 8; l++)
											if ((field[m][l].color != order_now) && field[m][l].check(j, i))
												return false;
									i -= Math.sign(arr[0].y - kp.y);
									j -= Math.sign(arr[0].x - kp.x);
								}
								return true;
							}
						}
					else return true;
				}
				else return false;
			else return false;
		}

		window.turn = function (x, y) {
			if (!figure_chosen) { // если undefined
				if (field[y][x].color == order_now){
					figure_chosen = field[y][x];
					figure_chosen.show();
				}
				return;
			}
			else {
				figure_chosen.unshow();
				if (field[y][x].color != order_now || typeof field[y][x].color == "undefined") {
					if (figure_chosen.check(x, y)) {
						figure_chosen.turn(x, y);
						if (checkmate())
							alert(`${order_now ? 'Белые' : 'Черные'} победили!`);
						order_now = !order_now;
						figure_chosen = undefined;
					}
				} else {
					figure_chosen = field[y][x];
					figure_chosen.show();
				}
			}
		}
	}
})(jQuery);