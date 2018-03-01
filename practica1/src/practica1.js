//GRUPO 15
/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
	this.cards = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"];
	this.statusGame = "Memory Game";
	this.gs = gs;
	this.board = [];
	this.boardLength = 0;
	this.flipped_card = undefined;
	this.nCards = 0;
	this.wait = false;

	this.initGame = function(){
		var pos_cards = [];
		this.board = new Array(16);
		this.boardLength = 16;

		for(var i = 0; i < 16; i++){
			pos_cards.push(i);
		}

		for(var i = 0; i < 8; i++){
			var pos = Math.floor(Math.random() * pos_cards.length);
        	this.board[pos_cards[pos]] = new MemoryGameCard(this.cards[i]);
        	pos_cards.splice(pos, 1);

        	pos = Math.floor(Math.random() * pos_cards.length);
        	this.board[pos_cards[pos]] = new MemoryGameCard(this.cards[i]);
        	pos_cards.splice(pos, 1);
		}

		this.draw(this);
	}

	this.draw = function(mg){
		mg.gs.drawMessage(mg.statusGame);

		for(var i = 0; i < mg.boardLength; i++){
			if(mg.board[i].status === 0){
				mg.gs.draw("back", i);
			}else{
				mg.gs.draw(mg.board[i].sprite, i);
			}
		}
	}

	this.onClick = function(cardId){
		var c = this.board[cardId];

		if(c.status !== 2 && c.status !== 1 && !this.wait){ //Si la carta no ha sido ya girada
			c.flip();
			this.draw(this);

			if(this.flipped_card === undefined){ //Si no hay otra carta girada
				this.flipped_card = cardId;
			}
			else{
				var other = this.board[this.flipped_card];
				if(c.compareTo(other)){
					this.board[cardId].found();
					this.board[this.flipped_card].found();
					this.statusGame = "Match found";
					this.nCards += 2;
					this.flipped_card = undefined;

					if(this.nCards === 16){
						this.statusGame = "You Win!!";
					}
					this.draw(this);
				}else{
					this.statusGame = "Try again";
					this.draw(this);
					this.wait = true;
					this.board[cardId].unflip();
					this.board[this.flipped_card].unflip();
					this.flipped_card = undefined;
					this.wait = false;


					setTimeout(this.draw, 1000, this);
				}
			}
		}
	}

};


/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	this.sprite = id;
	this.status = 0;

	this.unflip = function(){
		this.status = 0;
	}

	this.flip = function(){
		this.status = 1;
	}

	this.found = function(){
		this.status = 2;
	}

	this.compareTo = function(otherCard){
		if(this.sprite === otherCard.sprite)
			return true;

		return false;
	}
};
