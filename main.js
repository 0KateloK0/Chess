var order_now = true;

function find_king() {
	for (var i = 0; i < 8; i++)
		for (var j = 0; j < 8; j++)
			if ((field[i][j] instanceof King) && (field[i][j].color == order_now)) 
				return {x: j, y: i};
}

function check() {
	var kp = find_king();
	return field.some( (a) => a.some( (b) => (b.color != order_now) && b.check0(kp.x, kp.y) ) );
}

class Figure {
	constructor (x, y, color, firstTurn=true, src='') {
		[this.x, this.y, this.color, this.firstTurn, this.src] = [x, y, color, firstTurn, src];
		$(`#chess>button[onclick="turn(${x}, ${y})"]>img`).attr('src', this.src);
	}

	static source () { return ''; }

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
			if (field[y][x] instanceof King) return true;
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
	 * making turn
	 * @return {boolean} return turn possibility
	 */
	turn (x, y) {
		if ((check() && this.check1(x, y)) || (!check() && this.check0(x, y))) {
			this.firstTurn = false;
			this.turn0(x, y);
			return true;
		} else return false;
	}

	show () {
		for (var i = 0; i < 8; i++) 
			for (var j = 0; j < 8; j++) 
				if ((check() && this.check1(j, i)) || (!check() && this.check0(j, i)))
					$(`#chess>button[onclick="turn(${j}, ${i})"]`).css('background', 'green');
	}

	unshow () {
		$('#chess>button').attr('style', '');
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
			if (this.firstTurn && field[y][this.x-x < 0 ? 0 : 7].firstTurn) {
				for (var c = this.x - Math.sign(this.x-x); c != (this.x-x < 0 ? 7 : 0); c -= Math.sign(this.x - x))
					for (var i = 0; i < 8; i++) 
						for (var j = 0; j < 8; j++)
							if ((field[i][j].color != this.color) && field[i][j].check0(c, y)) return false;
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
				field[y][tx - x > 0 ? 0 : 7].turn0(this.x + Math.sign(tx-x), y);
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
					if (/*!(field[i][x] instanceof King) && (*/field[i][x].color != undefined) return false;
				return true;
			}
			else if (this.y == y) {
				for (var i = this.x - Math.sign(this.x-x); i != x; i -= Math.sign(this.x-x))
					if (/*!(field[i][x] instanceof King) && (*/field[y][i].color != undefined) return false;
				return true;
			}
			else if (Math.abs(this.y - y) == Math.abs(this.x - x)) {
				var i = this.y - Math.sign(this.y-y);
				var j = this.x - Math.sign(this.x-x);
				while ((i != y) && (j != x)) {
					if (/*!(field[i][j] instanceof King) && (*/field[i][j].color != undefined) return false;
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
					if (/*!(field[i][x] instanceof King) && (*/field[i][j].color != undefined) return false;
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
				if (this.firstTurn) return this.color ? (this.y - y <= 2) && (this.y - y > 0) : (y - this.y <= 2) && (y - this.y > 0);
				else return this.color ? (this.y - y == 1) : (y - this.y == 1);
			}
		}
		else if (Math.abs(this.x - x) == 1)
			if (this.color && (this.y - y == 1) || !this.color && (y - this.y == 1)) {
				var copy = turns_arr[turns_arr.length - 1];
				if (copy != undefined) {
					if (copy.f == this.constructor) {
						if ((copy.now.x == x) && (Math.abs(copy.now.y - copy.prev.y) == 2) && 
							(copy.now.y == this.y) || (this.color && (copy.now.y - this.y == 1)) ||
							(!this.color && (copy.now.y - this.y == 1)))
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
												(!this.color && (copy.now.y - ty == 1))))
						field[copy.now.y][copy.now.x] = new Figure(copy.now.x, copy.now.y);
			if (this.color && (y == 0) || !this.color && y == 7) {
				var self = this;
				Array.prototype.forEach.call( document.querySelectorAll('.chess_menu img'), 
					a => a.setAttribute('src', `img/${self.color ? 'w' : 'b'}${a.getAttribute('data-f')}.png`) );
				$('#chess>#chess_overlay').css('display', 'block');

			}
			return true;
		} else return false;
	}
}

function init() {
	field = [];

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

	var chess = $('#chess_main');
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			chess.append(`<button onclick="turn(${j}, ${i})" data-color="${
				(i % 2 == j % 2) ? 'white' : 'black'
			}">
				<img src="${field[i][j].src}" alt="">
			</button>`);
		}
	}

	turns_arr = [];
}

var figure_chosen = undefined;

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
}

class Turn {
	// ????? переделать функцию turn?
	constructor (f, prev, now) {
		this.f = f;
		this.prev = prev;
		this.now = now;
	}
}

window.setFigure = function(f) {
	let figures = new Map([
		['Q', new Queen()],
		['R', new Rook()],
		['N', new Horse()],
		['B', new Bishop()]
	]);
	var copy = turns_arr[turns_arr.length - 1];
	var fig = figures.get(f);
	field[copy.now.y][copy.now.x] = new fig.constructor(copy.now.x, copy.now.y,
					 field[copy.now.y][copy.now.x].color, copy.firstTurn);
	$('#chess>#chess_overlay').css('display', 'none');
}

window.turn = function(x, y) {
	if (!figure_chosen) { // если undefined
		if (field[y][x].color == order_now) {
			figure_chosen = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
			figure_chosen.show();
		}
	}
	else {
		if ((field[y][x].color == undefined) || (field[y][x].color != order_now)) {
			var [tx, ty] = [figure_chosen.x, figure_chosen.y];
			if (!figure_chosen.turn(x, y))
				alert('Неправильный ход');
			else {
				turns_arr.push(new Turn(figure_chosen.constructor, {x: tx, y: ty}, {x: x, y: y}));
				figure_chosen.unshow();
				order_now = !order_now;
				figure_chosen = undefined;
			}
		}
		else {
			figure_chosen.unshow();
			figure_chosen = new field[y][x].constructor(x, y, field[y][x].color, field[y][x].firstTurn);
			figure_chosen.show();
		}
	}
}