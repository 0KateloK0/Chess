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
	constructor (x, y, color, src='') {
		[this.x, this.y, this.color, this.src, this.firstTurn] = [x, y, color, src, true];
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
				var copy = new this.constructor(this.x, this.y, this.color);
				field[this.y][this.x] = new Figure(this.x, this.y);
				var res = check();
				field[copy.y][copy.x] = new copy.constructor(copy.x, copy.y, copy.color);
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
			if (field[y][x].color != this.color) {
				var copy = new field[y][x].constructor(field[y][x].x, field[y][x].y, field[y][x].color);
				var [tx, ty] = [this.x, this.y];
				this.turn0(x, y);
				var res = check();
				this.turn0(tx, ty);
				field[y][x] = new copy.constructor(copy.x, copy.y, copy.color);
				return !res;
			} else return false;
		} else return false;
	}

	/**
	 * translates figure into x, y;
	 */
	turn0 (x, y) {
		var [tx, ty] = [this.x, this.y];
		field[y][x] = new this.constructor(x, y, this.color);
		[this.x, this.y] = [x, y];
		field[ty][tx] = new Figure(tx, ty);
	}

	/**
	 * making turn
	 * @return {boolean} return turn possibility
	 */
	turn (x, y) {
		if (check()) {
			if ( this.check1(x, y) ){
				this.turn0(x, y);
				this.firstTurn = false;
				return true;
			} else return false;
		}
		else {
			if ( this.check0(x, y) ) {
				this.turn0(x, y);
				this.firstTurn = false;
				return true;
			} else return false;
		} 
	}

	show () {
		for (var i = 0; i < 8; i++) 
			for (var j = 0; j < 8; j++) 
				if ((check() && this.check1(j, i)) || this.check0(j, i))
					$(`#chess>button[onclick="turn(${j}, ${i})"]`).css('background', 'green');
	}

	unshow () {
		$('#chess>button').attr('style', '');
	}
}

class King extends Figure {
	constructor (x, y, color) {
		super(x, y, color, color ? 'img/wK.png' : 'img/bK.png');
	}
	defends (x, y) {
		return ((Math.abs(this.x - x) <= 1) && (Math.abs(this.y - y) <= 1));
	}
	check0 (x, y) {
		if ( this.defends(x, y) ) 
			if ( field[y][x].color != this.color ) {
				var copy = new field[y][x].constructor(field[y][x].x, field[y][x].y, field[y][x].color);
				var [tx, ty] = [this.x, this.y];
				this.turn0(x, y);
				var res = check();
				this.turn0(tx, ty);
				field[copy.y][copy.x] = new copy.constructor(copy.x, copy.y, copy.color);
				return !res;
			}
		else
			return false;
	}
	check1 (x, y) {
		return this.check0(x, y);
	}
}

class Queen extends Figure {
	constructor (x, y, color) {
		super(x, y, color, color ? 'img/wQ.png' : 'img/bQ.png');
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
	constructor (x, y, color) {
		super(x, y, color, color ? 'img/wR.png' : 'img/bR.png');
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
	constructor (x, y, color) {
		super(x, y, color, color ? 'img/wB.png' : 'img/bB.png');
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
	constructor (x, y, color) {
		super(x, y, color, color ? 'img/wN.png' : 'img/bN.png');
	}
	defends (x, y) {
		return ((Math.abs(this.x - x) == 2) && (Math.abs(this.y - y) == 1)) ||
				((Math.abs(this.x - x) == 1) && (Math.abs(this.y - y) == 2));
	}
}

class Pawn extends Figure {
	constructor (x, y, color) {
		super(x, y, color, color ? 'img/wP.png' : 'img/bP.png');
	}
	defends (x, y) {
		if (this.x == x) {
			if (field[this.y + (this.color ? -1 : 1)][x].color != undefined) return false;
			if (this.firstTurn && field[this.y + (this.color ? -2 : 2)][x].color != undefined) return false;
			if (this.firstTurn) return this.color ? (this.y - y == 2 || this.y - y == 1) 
												   : (y - this.y == 2 || y - this.y == 1);
			else return this.color ? (this.y - y == 1) : (y - this.y == 1);
		}
		else if (Math.abs(this.x - x) == 1)
			if (this.color && (this.y - y == 1) || !this.color && (y - this.y == 1))
				return (this.color != field[y][x].color) && (field[y][x].color != undefined);
			else return false;
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

	var chess = $('#chess');
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			chess.append(`<button onclick="turn(${j}, ${i})" data-color="${
				(i % 2 == j % 2) ? 'white' : 'black'
			}">
				<img src="${field[i][j].src}" alt="">
			</button>`);
		}
	}
}

var figure_chosen = undefined;

window.turn = function(x, y) {
	if (!figure_chosen) { // если undefined
		if (field[y][x].color == order_now) {
			figure_chosen = new field[y][x].constructor(field[y][x].x, field[y][x].y, field[y][x].color);
			figure_chosen.show();
		}
	}
	else {
		if ((field[y][x].color == undefined) || (field[y][x].color != order_now))
			if (!figure_chosen.turn(x, y))
				alert('Неправильный ход');
			else {
				figure_chosen.unshow();
				order_now = !order_now;
				figure_chosen = undefined;
			}
		else {
			figure_chosen.unshow();
			figure_chosen = new field[y][x].constructor(field[y][x].x, field[y][x].y, field[y][x].color);
			figure_chosen.show();
		}
	}
}