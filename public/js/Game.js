'use strict'

const $ = require('jquery')
const Util = require("./Util")

class Game {

    constructor($board) {
        this.$board = $board // le board correspond au div du DOm dans lequel seront affichés les cartes
        this.cardsDeck = [] // card represente le paquet de cartes (chaque entier correspond à un fruit)
        this.$flipedCard1 = null
        this.$flipedCard2 = null
        this.bestTimes = [] // tableau des meilleurs temps
        this.nbPairs = 14 // nombre de pairs de cartes en jeu
        this.nbRemainingPairs = this.nbPairs // nombre de pairs de cartes restante à trouver
        this.timeCounter = 0 // compteur de millisecondes
        this.timeMax = 120000 // temps de jeu max avant d'avoir perdu

        this.$board.find('.js-start').on('click', () => {
            this.startGame()
        });

        // on delegue au board le fait d'écouter l'événement click sur les cartes
        this.$board.find('.cards-board').on(
            'click',
            '.card-clickable',
            this.flipCard.bind(this) // on bind le this pour garder notre instance Game et non l'élément du DOM cliqué
        );
    }

    /**
     * Lance le jeu
     */
    startGame() {
        this.resetBoard()
        this.$board.find('.best-times-wrapper').hide()
        this.drawCards()
        this.displayCards()

        // on lance un update du compteur toutes les secondes
        this.timeCountdown = setInterval(() => {
            const timerSize = 100 * this.timeCounter / this.timeMax
            this.timeCounter = this.timeCounter + 1000
            this.$board.find('.timer').width(`${timerSize}%`)
            if (this.timeCounter > this.timeMax) {
                clearInterval(this.timeCountdown)
                this.looseGame()
            }
        }, 1000);
    }

    /**
     * Fait le tirage des cartes
     */
    drawCards() {
        for (let i = 0; i < this.nbPairs; i++) {
            this.cardsDeck.push(i, i)
        }
        this.cardsDeck = Util.shuffleArray(this.cardsDeck);
    }

    /**
     * Affiche les cartes dans le DOM
     */
    displayCards() {
        this.cardsDeck.forEach((card, index) => {
            const htmlCard = `
            <div class="card-wrapper">
                <div class="card card-clickable" id="${index}" data-fruit="${card}">
                    <div class="card-img fruit-${card}">
                    </div>
                </div>
            </div>
            `;
            this.$board.find('.cards-board').append(htmlCard)
        })
    }

    /**
     * Affiche le tableau des meilleurs temps dans le DOM
     */
    displayBestTimes() {
        let htmlScoreTable = ""
        this.bestTimes.forEach((time, index) => {
            htmlScoreTable +=  `
        <tr>
            <td>${index+1} - </td>
            <td>${time} </td>
        </tr>
`
        })
        this.$board.find('.best-times').empty();
        this.$board.find('.best-times').append(htmlScoreTable);
    }


    /**
     * Retourne une carte
     *
     * @param {event} e Click sur une carte
     */
    flipCard(e) {
        // on verifie que 2 cartes ne sont pas déjà retournées
        if (this.$flipedCard1 != null && this.$flipedCard2 != null) {
            return false;
        }

        // on retourne la carte
        $(e.currentTarget).addClass("flipped");

        if (this.$flipedCard1 === null ) {
            this.$flipedCard1 = $(e.currentTarget)
        }
        else {
            this.$flipedCard2 = $(e.currentTarget)

            // Si c'est la deuxième carte, on compare son numéro de fruit avec la première
            if (this.$flipedCard1.attr('data-fruit') === this.$flipedCard2.attr('data-fruit')) {
                // Yeah c'est une paire !!
                // on enleve les listeners
                this.$flipedCard2.removeClass("card-clickable");
                this.$flipedCard1.removeClass("card-clickable");
                this.$flipedCard1 = null
                this.$flipedCard2 = null

                // on enleve la paire trouvée du paquet
                this.nbRemainingPairs --

                // on check si c'était la dernière paire
                if (this.nbRemainingPairs === 0) {
                    setTimeout(() => {
                        this.winGame()
                    }, 1000);
                }

            }
            else {
                // Les cartes sont différentes, on laisse au joueur le temps de voir la deuxième puis on les retourne
                setTimeout(() => {
                    this.$flipedCard2.removeClass("flipped");
                    this.$flipedCard1.removeClass("flipped");
                    this.$flipedCard1 = null
                    this.$flipedCard2 = null
                }, 1000);
            }
        }
    }

    /**
     * Le joueur à perdu
     */
    looseGame() {
        clearInterval(this.timeCountdown)
        alert('Vous avez perdu :-(')
        this.resetBoard()
    }

    /**
     * Le joueur à gagné, cette fonction enregistre le score et mets à jour le tableau des meilleurs score
     */
    async winGame() {
        clearInterval(this.timeCountdown)
        const gameTime = this.timeCounter
        alert('Vous avez Gagnééééé !!!! \n\n TEMPS : ' + Util.getMinAndSecfromMs(gameTime))
        try {
            const json = await this.saveScore(gameTime)
            this.bestTimes = json.games
            this.displayBestTimes()
        }
        catch (error) {
            console.log(error);
        }
        this.resetBoard()
    }

    /**
     * Sauvegarde le score et renvoie la liste des scores mise à jours
     *
     * @param {number} score Le temps
     * @return {json} La liste des 10 meilleurs temps en base
     */
    async saveScore(score) {
        return $.ajax({
            url: '/newgame/'+score,
            method: 'POST'
        })
    }

    /**
     * Ré-initialise le timer, les cartes, ré-affiche le tableau des meilleurs temps
     *
     */
    resetBoard() {
        // reinitialise le timer
        clearInterval(this.timeCountdown)
        this.timeCounter = 0
        this.$board.find('.timer').width("0")

        // reinitialise les cartes
        this.$flipedCard1 = null
        this.$flipedCard2 = null
        this.cardsDeck = []
        this.nbRemainingPairs = this.nbPairs
        this.$board.find('.card-wrapper').remove()

        // affiche le tableau de meilleurs temps
        this.$board.find('.best-times-wrapper').show()
    }

}

module.exports = Game;

