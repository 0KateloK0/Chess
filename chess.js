(function($) {
	$.fn.chess = function(settings) {
		function init() {

			var order_now = true;

<<<<<<< HEAD
		function check() {
			var kp = find_king();
			return field.some( (a) => a.some( (b) => !(b instanceof King) && (b.color != order_now) && b.check0(kp.x, kp.y) ) );
		}

		class Figure {
			constructor (x, y, color, firstTurn=true, src='') {
				[this.x, this.y, this.color, this.firstTurn, this.src] = [x, y, color, firstTurn, src];
				$(`#inner-chess_main>button[onclick="turn(${x}, ${y})"]>img`).attr('src', this.src);
=======
			function find_king() {
				for (var i = 0; i < 8; i++)
					for (var j = 0; j < 8; j++)
						if ((field[i][j] instanceof King) && (field[i][j].color == order_now)) 
							return {x: j, y: i};
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""
			}

			function check() {
				var kp = find_king();
				return field.some( (a) => a.some( (b) => !(b instanceof King) && (b.color != order_now) && b.check0(kp.x, kp.y) ) );
			}

			class Figure {
				constructor (x, y, color, firstTurn=true, src='') {
					[this.x, this.y, this.color, this.firstTurn, this.src] = [x, y, color, firstTurn, src];
					// $(`#chess_main>button[data-x="${x}"][data-y="${y}"]>img`).attr('src', this.src);
				}

				defends (x, y) {
					return false;
				}

				/**
				 * it checking turn possibility without check
				 * it needs to have possibility to use with super();
				 * @return {boolean}
				 */
				check0 (x, y) {
					if ( this.defends(x, y) ) {
						if (field[y][x].color != this.color) {
							var copy = new this.constructor(this.x, this.y, this.color, this.firstTurn);
							field[this.y][this.x] = new Figure(this.x, this.y);
							var res = check();
							if (res) 
								res = !this.check1(x, y);
							field[copy.y][copy.x] = new copy.constructor(copy.x, copy.y, copy.color, copy.firstTurn);
							return !res;
						} else return false;
					} else return false;
				}

				/**
				 * it checking turn possibility with check
				 * it needs to have possibility to use with super();
				 * @return {boolean}
				 */
				check1 (x, y) {
					if ( this.defends(x, y) ) {
						if (field[y][x] instanceof King) return true; // sometimes it happening some bad things with king. DON'T DELETE THIS
						else if (field[y][x].color != this.color) {
							var copy = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
							var [tx, ty] = [this.x, this.y];
							this.turn0(x, y);
							var res = check();
							this.turn0(tx, ty);
							field[y][x] = new copy.constructor(copy.x, copy.y, copy.color, field[y][x].firstTurn);
							return !res;
						} else return false;
					} else return false;
				}

				/**
				 * translates figure into x, y;
				 */
				turn0 (x, y) {
					var [tx, ty] = [this.x, this.y];
					field[y][x] = new this.constructor(x, y, this.color, this.firstTurn);
					[this.x, this.y] = [x, y];
					field[ty][tx] = new Figure(tx, ty);
				}

				/**
				 * translates figure into x, y with animation
				 */
				turn1 (x, y) {
					$(`#chess_main>button[data-x="${this.x}"][data-y="${this.y}"]`).find('img').attr('src', '');
					$('#chess_main').append(`<img id="chess_movable_figure" src="${this.src}">`);
					var img = $('#chess_movable_figure');
					img.attr('style', `left: ${(this.x + 1) * 50}px; top: ${(this.y + 1) * 50}px`);
					var [tx, ty] = [this.x, this.y];
					this.turn0(x, y);
					img.animate({'left': `${(tx + 1) * 50 - 12.5}px`,
						'top': `${(ty + 1) * 50 - 12.5}px`,
						'width': '75px'
					}, 125).animate({
						'left': `${(x + 1) * 50 - 12.5}px`,
						'top': `${(y + 1) * 50 - 12.5}px`
					}, 375).animate({'left': `${(x + 1) * 50}px`,
						'top': `${(y + 1) * 50}px`,
						'width': '50px'
					}, 125);
					var self = this;
					setTimeout(()=>{
						img.remove();
						$(`#chess_main>button[data-x="${self.x}"][data-y="${self.y}"]`).find('img').attr('src', self.src);
					}, 675);
				}

<<<<<<< HEAD
			show () {
				for (var i = 0; i < 8; i++) 
					for (var j = 0; j < 8; j++) 
						if ((check() && this.check1(j, i)) || (!check() && this.check0(j, i)))
							$(`#inner-chess_main>button[onclick="turn(${j}, ${i})"]`).css('background', 'green');
			}

			unshow () {
				$('#inner-chess_main>button').attr('style', '');
			}
=======
				/**
				 * making turn
				 * @return {boolean} return turn possibility
				 */
				turn (x, y) {
					if ((check() && this.check1(x, y)) || (!check() && this.check0(x, y))) {
						this.firstTurn = false;
						this.turn1(x, y);
						return true;
					} else return false;
				}

				show () {
					for (var i = 0; i < 8; i++) 
						for (var j = 0; j < 8; j++) 
							if ((check() && this.check1(j, i)) || (!check() && this.check0(j, i)))
								if ((field[j][i].color != this.color) && (field[i][j].color != undefined))
									$(`#chess_main>button[data-x="${j}"][data-y="${i}"]`).addClass('chess_eatable-figure')
								else
									$(`#chess_main>button[data-x="${j}"][data-y="${i}"]`).addClass('chess_possible-figure');
				}
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""

				unshow () {
					$('#chess_main>button').attr('class', '');
				}

				get table() {
					var table = [];
					for (var i = 0; i < 8; i++) {
						table.push([]);
						for (var j = 0; j < 8; j++)
							table[i].push( this.check0(j, i) );
					}
					return table;
				}
			}

			class King extends Figure {
				constructor (x, y, color, firstTurn) {
					super(x, y, color, firstTurn, color ? 'img/wK.png' : 'img/bK.png');
				}

				defends (x, y) {
					if ((Math.abs(this.x - x) == 2) && (this.y == y)) {
						// if it's some figures between king and rook it's still can do ракировка
						if (this.firstTurn && field[y][this.x-x < 0 ? 7 : 0].firstTurn) {
							for (var c = this.x - Math.sign(this.x-x); c != (this.x-x < 0 ? 7 : 0); c -= Math.sign(this.x - x)) {
								if (field[y][c].color != undefined) return false;
								for (var i = 0; i < 8; i++) 
									for (var j = 0; j < 8; j++)
										if ((field[i][j].color != this.color) && field[i][j].check0(c, y)) return false;
							}
							return true;
						}
					}
					return ((Math.abs(this.x - x) <= 1) && (Math.abs(this.y - y) <= 1));
				}

				check0 (x, y) {
					if ( this.defends(x, y) ) 
						if ( field[y][x].color != this.color ) {
							var copy = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
							var [tx, ty] = [this.x, this.y];
							this.turn0(x, y);
							var res = check();
							this.turn0(tx, ty);
							field[copy.y][copy.x] = new copy.constructor(copy.x, copy.y, copy.color, copy.firstTurn);
							return !res;
						}
					else
						return false;
				}

				check1 (x, y) {
					if (Math.abs(this.x - x) == 2) return false;
					else return this.check0(x, y);
				}

				turn (x, y) {
					var tx = this.x;
					if (super.turn(x, y)) {
						if (Math.abs(tx - x) == 2)
							setTimeout(()=>field[y][tx - x > 0 ? 0 : 7].turn1(this.x + Math.sign(tx-x), y), 680);
						return true;
					} else return false;
				}
			}

			class Queen extends Figure {
				constructor (x, y, color, firstTurn) {
					super(x, y, color, firstTurn, color ? 'img/wQ.png' : 'img/bQ.png');
				}

				defends (x, y) {
					if (!((this.x == x) && (this.y == y)))
						if (this.x == x) {
							for (var i = this.y - Math.sign(this.y-y); i != y; i -= Math.sign(this.y-y))
								if (field[i][x].color != undefined) return false;
							return true;
						}
						else if (this.y == y) {
							for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
								if (field[y][i].color != undefined) return false;
							return true;
						}
						else if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
							var i = this.y - Math.sign(this.y-y);
							var j = this.x - Math.sign(this.x-x);
							while ((i != y) && (j != x)) {
								if (field[i][j].color != undefined) return false;
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
				constructor (x, y, color, firstTurn) {
					super(x, y, color, firstTurn, color ? 'img/wR.png' : 'img/bR.png');
				}

				defends (x, y) {
					if (this.x == x) {
						for (var i = this.y - Math.sign(this.y-y); i != y; i -= Math.sign(this.y-y))
							if (field[i][x].color != undefined) return false;
						return true;
					}
					else if (this.y == y){
						for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
							if (field[y][i].color != undefined) return false;
						return true;
					}
					else return false;
				}
			}

			class Bishop extends Figure {
				constructor (x, y, color, firstTurn) {
					super(x, y, color, firstTurn, color ? 'img/wB.png' : 'img/bB.png');
				}

				defends (x, y) {
					if (!((this.x == x) && (this.y == y)))
						if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
							var i = this.y - Math.sign(this.y-y);
							var j = this.x - Math.sign(this.x-x);
							while ((i != y) && (j != x)) {
								if (field[i][j].color != undefined) return false;
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
				constructor (x, y, color, firstTurn) {
					super(x, y, color, firstTurn, color ? 'img/wN.png' : 'img/bN.png');
				}

				defends (x, y) {
					return ((Math.abs(this.x - x) == 2) && (Math.abs(this.y - y) == 1)) ||
							((Math.abs(this.x - x) == 1) && (Math.abs(this.y - y) == 2));
				}
			}

			class Pawn extends Figure {
				constructor (x, y, color, firstTurn) {
					super(x, y, color, firstTurn, color ? 'img/wP.png' : 'img/bP.png');
				}

				defends (x, y) {
					if (this.x == x) {
						if (field[y][x].color == undefined) {
							if (this.firstTurn && (this.color ? (this.y - y <= 2) && (this.y - y > 0) : (y - this.y <= 2) && (y - this.y > 0))) 
								return field[this.y + (this.color ? -1 : 1)][x].color == undefined;
							else return this.color ? (this.y - y == 1) : (y - this.y == 1);
							if (this.firstTurn) return this.color ? (this.y - y <= 2) && (this.y - y > 0) : (y - this.y <= 2) && (y - this.y > 0);
							else return this.color ? (this.y - y == 1) : (y - this.y == 1);
						}
					}
					else if (Math.abs(this.x - x) == 1)
						if (this.color && (this.y - y == 1) || !this.color && (y - this.y == 1)) {
							var copy = turns_arr[turns_arr.length - 1];
							if (copy != undefined) {
								if (copy.f == this.constructor) {
									if ((copy.now.x == x) && (Math.abs(copy.now.y - copy.prev.y) == 2) && (
										(copy.now.y == this.y) || (this.color && (copy.now.y - this.y == 1)) ||
										(!this.color && (this.y - copy.now.y == 1))))
										return true;
								}
							}
							return (field[y][x].color != this.color) && (field[y][x].color != undefined);
						} else return false;
				}

				turn (x, y) {
					var ty = this.y;
					if (super.turn(x, y)) {
						var copy = turns_arr[turns_arr.length - 1];
						if (copy != undefined)
							if (copy.f == this.constructor)
								if ((copy.now.x == x) && (Math.abs(copy.now.y - copy.prev.y) == 2) && 
									((copy.now.y == ty) || (this.color && (copy.now.y - ty == 1)) ||
															(!this.color && (ty - copy.now.y == 1))))
									field[copy.now.y][copy.now.x] = new Figure(copy.now.x, copy.now.y);
						if (this.color && (y == 0) || !this.color && y == 7) {
							var self = this;
							Array.prototype.forEach.call( document.querySelectorAll('.chess_menu img'), 
								a => a.setAttribute('src', `img/${self.color ? 'w' : 'b'}${a.getAttribute('data-f')}.png`) );
							$('#chess_overlay').css('display', 'block');

						}
						return true;
					} else return false;
				}
			}

			var field = [];

			num_let = new Map([
				[0, 'a'],
				[1, 'b'],
				[2, 'c'],
				[3, 'd'],
				[4, 'e'],
				[5, 'f'],
				[6, 'g'],
				[7, 'h']
			]);

			for (var i = 0; i < 8; i++) {
				field.push([]);
				for (var j = 0; j < 8; j++)
					field[i].push(new Figure(j, i));
			}

			field[7][4] = new King(4, 7, true); // белый король
			field[0][4] = new King(4, 0, false); // черный король

			field[7][3] = new Queen(3, 7, true); // белый ферзь
			field[0][3] = new Queen(3, 0, false); // черный ферзь

			field[7][7] = new Rook(7, 7, true); // белая ладья_1
			field[7][0] = new Rook(0, 7, true); // белая ладья_2
			field[0][7] = new Rook(7, 0, false); // черная ладья_1
			field[0][0] = new Rook(0, 0, false); // черная ладья_2

			field[7][2] = new Bishop(2, 7, true); // белый слон_1
			field[7][5] = new Bishop(5, 7, true); // белый слон_2
			field[0][2] = new Bishop(2, 0, false); // черный слон_1
			field[0][5] = new Bishop(5, 0, false); // черный слон_2

			field[7][1] = new Horse(1, 7, true); // белый конь_1
			field[7][6] = new Horse(6, 7, true); // белый конь_2
			field[0][1] = new Horse(1, 0, false); // черный конь_1
			field[0][6] = new Horse(6, 0, false); // черный конь_2

			for (var i = 0; i < 8; i++) {
				field[6][i] = new Pawn(i, 6, true); // белая пешка
				field[1][i] = new Pawn(i, 1, false); // черная пешка
			}

			var chess = $('#chess');
<<<<<<< HEAD
			chess.append(`<div id="chess_main">
							<div id="inner-chess_main">
								<div id="chess_overlay">
									<div id="inner-chess_overlay">
										<button class="chess_menu" onclick="setFigure('Q')"><img alt="" data-f="Q"> Ферзь</button>
										<button class="chess_menu" onclick="setFigure('R')"><img alt="" data-f="R"> Ладья</button>
										<button class="chess_menu" onclick="setFigure('B')"><img alt="" data-f="B"> Слон</button>
										<button class="chess_menu" onclick="setFigure('N')"><img alt="" data-f="N"> Конь</button>
									</div>
								</div>
							</div>
						</div>
						<div id="chess_UI">
							<div id="chess_turns">
								<div></div>
								<div><img src="img/wK.png" style="height: 30px;"> <span>White</span></div>
								<div><img src="img/bK.png" style="height: 30px;"> <span>Black</span></div>
								<div>1</div>
							</div>
							<div id="chess_buttons">
								<button onclick="undo_turn()">Отменить</button>
								<button>Сдаться</button>
							</div>
						</div>`);

			var chess_main = $('#inner-chess_main');

			$('#chess_main').append('<div></div>');
			for (var i = 0; i < 8; i++)
				$('#chess_main').append(`<span>${num_let.get(i)}</span>`);
			$('#chess_main').append('<div></div>');

			for (var i = 0; i < 8; i++) {
				$('#chess_main').append(`<span>${8-i}</span>`);
=======

			chess.append(`<div id="chess_menu_overlay">
							<h1>Chess</h1>
							<button class="chess_menu_btn" id="chess_menu_play">Play</button>
						</div>
						<div id="chess_main"></div>
						<div id="chess_UI_turns">
							<div></div>
							<div class="chess_UI_turns-header"><img src="img/wK.png"><span>white</span></div>
							<div class="chess_UI_turns-header"><img src="img/bK.png"><span>black</span></div>
							<div class="chess_UI_smb">1</div>
						</div>
						<div id="chess_UI_buttons">
							<div id="inner-chess_UI_buttons">
								<button id="chess_undo_btn">Undo</button>
								<button id="chess_surrend_btn">Surrender</button>
							</div>
						</div>
						<div id="chess_overlay">
							<div id="inner-chess_overlay">
								<button data-f="Q" class="chess_overlay_btn"><img src="">Queen</button>
								<button data-f="R" class="chess_overlay_btn"><img src="">Rook</button>
								<button data-f="B" class="chess_overlay_btn"><img src="">Bishop</button>
								<button data-f="N" class="chess_overlay_btn"><img src="">Horse</button>
							</div>
						</div>`);

			let bukvi = new Map([[0, 'a'], [1, 'b'], [2, 'c'], [3, 'd'], [4, 'e'], [5, 'f'], [6, 'g'], [7, 'h']]);

			chess.find('#chess_main').append('<div></div>');
			for (var i = 0; i < 8; i++)
				chess.find('#chess_main').append(`<div class="chess_top-bukvi">${bukvi.get(i)}</div>`);
			chess.find('#chess_main').append('<div></div>');
			for (var i = 0; i < 8; i++) {
				$('#chess_main').append(`<div class="chess_left-nums">${8-i}</div>`);
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""
				for (var j = 0; j < 8; j++)
					$('#chess_main').append(`<button data-x="${j}" data-y="${i}" data-color="${
						(i % 2 == j % 2) ? 'white' : 'black'
					}">
						<img src="${field[i][j].src}" alt="">
					</button>`);
<<<<<<< HEAD
				$('#chess_main').append(`<span>${8-i}</span>`);
			}

			$('#chess_main').append('<div></div>');
			for (var i = 0; i < 8; i++)
				$('#chess_main').append(`<span>${num_let.get(i)}</span>`);
			$('#chess_main').append('<div></div>');

			turns_arr = [];

			var elem = document.getElementById('chess_turns');

			var prev_scrolled = window.offsetY || elem.scrollTop;
			elem.onscroll = function() {
				var scrolled = window.offsetY || elem.scrollTop;

				if (scrolled % 30 != 0) 
					if (prev_scrolled - scrolled > 0)
						elem.scrollBy(0, 30 - scrolled % 30);
					else if (prev_scrolled - scrolled < 0)
						elem.scrollBy(0, -scrolled % 30);
				prev_scrolled = window.offsetY || elem.scrollTop;
			}
		}
=======
				$('#chess_main').append(`<div class="chess_right-nums">${8-i}</div>`);
			}
			chess.find('#chess_main').append('<div></div>');
			for (var i = 0; i < 8; i++)
				chess.find('#chess_main').append(`<div class="chess_bottom-bukvi">${bukvi.get(i)}</div>`);
			chess.find('#chess_main').append('<div></div>');

			document.getElementById('chess_menu_play').onclick = function(e) {
				$('#chess_menu_overlay').css('display', 'none');
			}
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""

			document.getElementById('chess_undo_btn').onclick = function(e) {
				var turn = turns_arr[turns_arr.length - 1],
					pf = prev_figure;
				if (turn != undefined) {
					field[turn.now.y][turn.now.x].turn1(turn.prev.x, turn.prev.y);
					field[turn.now.y][turn.now.y] = new pf.constructor(pf.x, pf.y, pf.color, pf.firstTurn);
					order_now = !order_now;
					if (turns_arr.length % 2 == 0)
						$('#chess_UI_turns>*:last').remove();
					turns_arr.pop();
					$('#chess_UI_turns>*:last').remove();
				}
			}

<<<<<<< HEAD
		var prev_figure = undefined;

		window.undo_turn= function() {
			if (turns_arr.length > 0) {
				var turn = turns_arr[turns_arr.length - 1];
				field[turn.now.y][turn.now.x].turn0(turn.prev.x, turn.prev.y);
				field[turn.now.y][turn.now.y] = new prev_figure.constructor(turn.now.x, turn.now.y, prev_figure.color, prev_figure.firstTurn);

				$('#chess_turns');
			}
		}

		window.checkmate = function () {
			var kp = find_king();
			if (check()) {
				if ( field[kp.y][kp.x].table.every(a=>a.every(b=>!b)) ) {
					var arr = [];
					field.map( (a, i) => a.map( (b, j) => {if (b.check0(kp.x, kp.y)) arr.push({x: j, y: i})} ) );
					if (arr.length == 2) return true;
					else {
						if (field[arr[0].y][arr[0].x] instanceof Horse) return true;
						else if (field[arr[0].y][arr[0].x] instanceof Pawn)
							return arr[0].x != kp.x;
						else if (kp.x == arr[0].x) {
							for (var i = arr[0].y - Math.sign(arr[0].y-kp.y); i != kp.y; i -= Math.sign(arr[0].y-kp.y))
								for (let j = 0; j < 8; j++)
									for (let m = 0; m < 8; m++)
										if ((field[j][m].color != order_now) && field[j][m].check0(arr[0].x, i))
											return false;
							return true;
						}
						else if (arr[0].y == kp.y) {
							for (var i = arr[0].x - Math.sign(arr[0].x-kp.x); i != kp.x; i -= Math.sign(arr[0].x-kp.x))
								for (let j = 0; j < 8; j++) 
=======
			forEach = Array.prototype.forEach;
			
			forEach.call($('#inner-chess_overlay>button'), a => a.onclick = function(e) {
				let figures = new Map([
					['Q', new Queen()],
					['R', new Rook()],
					['N', new Horse()],
					['B', new Bishop()]
				]);
				var copy = turns_arr[turns_arr.length - 1];
				var fig = figures.get(e.currentTarget.getAttribute('data-f'));
				field[copy.now.y][copy.now.x] = new fig.constructor(copy.now.x, copy.now.y,
								 field[copy.now.y][copy.now.x].color, copy.firstTurn);
				$('#chess_overlay').css('display', 'none');
			});

			function checkmate() {
				var kp = find_king();
				if (check()) {
					if ( field[kp.y][kp.x].table.every((a)=>a.every((b)=>!b)) ) {
						var arr = [];
						field.map( (a, i) => a.map( (b, j) => {if (b.check0(kp.x, kp.y)) arr.push({x: j, y: i})} ) );
						if (arr.length == 2) return true;
						else {
							if (field[arr[0].y][arr[0].x] instanceof Horse) return true;
							else if (field[arr[0].y][arr[0].x] instanceof Pawn)
								return arr[0].x != kp.x;
							else if (kp.x == arr[0].x) {
								for (var i = arr[0].y - Math.sign(arr[0].y-kp.y); i != kp.y; i -= Math.sign(arr[0].y-kp.y))
									for (let j = 0; j < 8; j++)
										for (let m = 0; m < 8; m++)
											if ((field[j][m].color != order_now) && field[j][m].check0(arr[0].x, i))
												return false;
								return true;
							}
							else if (arr[0].y == kp.y) {
								for (var i = arr[0].x - Math.sign(arr[0].x-kp.x); i != kp.x; i -= Math.sign(arr[0].x-kp.x))
									for (let j = 0; j < 8; j++) 
										for (let m = 0; m < 8; m++)
											if ((field[j][m].color != order_now) && field[j][m].check0(i, arr[0].y))
												return false;
								return true;
							}
							else if (Math.abs(arr[0].y - kp.y) == Math.abs(arr[0].x - kp.x)) {
								var i = arr[0].y - Math.sign(arr[0].y-kp.y);
								var j = arr[0].x - Math.sign(arr[0].x-kp.x);
								while ((i != kp.y) && (j != kp.x)) {
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""
									for (let m = 0; m < 8; m++)
										for (let l = 0; l < 8; l++)
											if ((field[m][l].color != order_now) && field[m][l].check0(j, i))
												return false;
									i -= Math.sign(arr[0].y - kp.y);
									j -= Math.sign(arr[0].x - kp.x);
								}
								return true;
							}
						}
					} else return false;
				} else return false;
<<<<<<< HEAD
			} else return false;
		}

		class Turn {
			// ????? переделать функцию turn?
			constructor (f, prev, now) {
				this.f = f;
				this.prev = prev;
				this.now = now;
				turns_arr.push(this);

				var text = `${num_let.get(prev.x)}${8-prev.y}-${num_let.get(now.x)}${8-now.y}`;
				var turn_num = Math.floor((turns_arr.length) / 2) + 1;
				$('#chess_turns').append(`<div>${text}</div>`);
				if ((turns_arr.length != 0) && (turns_arr.length % 2 == 0))
					$('#chess_turns').append(`<div>${turn_num}</div>`);
=======
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""
			}

			var order_now = true,
				figure_chosen = undefined,
				turns_arr = [],
				prev_figure = undefined;

			forEach.call($('#chess_main>button'), a => a.onclick = function(e) {
				var x = Number( e.currentTarget.getAttribute('data-x') ),
					y = Number( e.currentTarget.getAttribute('data-y') );
				if (!figure_chosen) { // если undefined
					if (field[y][x].color == order_now) {
						figure_chosen = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
						figure_chosen.show();
					}
				}
<<<<<<< HEAD
			}
			else {
				if ((field[y][x].color == undefined) || (field[y][x].color != order_now)) {
					var [tx, ty] = [figure_chosen.x, figure_chosen.y];
					prev_figure = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
					if (!figure_chosen.turn(x, y))
						alert('Неправильный ход');
					else {
						var turn = new Turn(figure_chosen.constructor, {x: tx, y: ty}, {x: x, y: y});
						if (checkmate())
							alert(`${order_now ? 'Белые' : 'Черные'} победили!`);
=======
				else {
					if ((field[y][x].color == undefined) || (field[y][x].color != order_now)) {
						var [tx, ty] = [figure_chosen.x, figure_chosen.y];
						var pf = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
						if (!figure_chosen.turn(x, y))
							alert('Неправильный ход');
						else {
							prev_figure = pf;
							if (checkmate())
								alert(`${order_now ? 'Белые' : 'Черные'} победили!`);
							turns_arr.push(new Turn(figure_chosen.constructor, {x: tx, y: ty}, {x: x, y: y}));
							figure_chosen.unshow();
							order_now = !order_now;
							figure_chosen = undefined;
						}
					}
					else {
>>>>>>> parent of 49026c9... Revert "Revert "Revert "UI"""
						figure_chosen.unshow();
						figure_chosen = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
						figure_chosen.show();
					}
				}
			});

			class Turn {
				// ????? переделать функцию turn?
				constructor (f, prev, now) {
					this.f = f;
					this.prev = prev;
					this.now = now;

					let num_let = new Map([
						[0, 'a'],
						[1, 'b'],
						[2, 'c'],
						[3, 'd'],
						[4, 'e'],
						[5, 'f'],
						[6, 'g'],
						[7, 'h']
					]);

					var text = `${num_let.get(prev.x)}${8-prev.y}-${num_let.get(now.x)}${8-now.y}`;
					var turn_num = Math.floor((turns_arr.length) / 2) + 1;
					$(`#chess_UI_turns`).append(`<div>${text}</div>`);
					if ((turns_arr.length != 0) && (turns_arr.length % 2 == 1))
						$('#chess_UI_turns').append(`<div>${turn_num+1}</div>`);
				}
			}

		}

		init();
	}
})(jQuery);