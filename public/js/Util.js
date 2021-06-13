'use strict'

/**
 * Sauvegarde le score et renvoie la liste des scores mise à jours
 *
 * @param {[number]} cards Le tableau des cartes à mélanger
 * @return {[number]} shuffledCards Le tableau des cartes mélangées
 */
function shuffleArray (cards) {
    const shuffledCards = []
    const nbCards = cards.length
    for (let i = 0; i < nbCards; i++) {
        // Enleve aletoirement une carte du paquet 'cards' et la met dans le paquet 'shuffledCards'
        shuffledCards.push(cards.splice(getRandomInt(cards.length), 1)[0]);
    }
    return shuffledCards;
}

/**
 * Retourne une chaine de caractère donnant la valeur du temps en secondes / minutes
 *
 * @param {number} duration Temps en millisecondes
 * @return {string} Temps en secondes et minutes
 */
function getMinAndSecfromMs(duration) {
    let seconds = parseInt((duration/1000)%60)
    let minutes = parseInt((duration/(1000*60))%60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `00:${minutes}:${seconds}`;
}

/**
 * Retourne un entier alétoire comprit entre 0 et le paramètre max
 *
 * @param {number} max Valeur max du Int randow
 * @return {number} Entier alétoire comprit entre 0 et le paramètre max
 */
function getRandomInt (max) {
    return Math.floor(Math.random() * max);
}

module.exports = { shuffleArray, getMinAndSecfromMs }