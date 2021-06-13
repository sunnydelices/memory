const $ = require('jquery');
const Game = require('./Game');

require('bootstrap/dist/css/bootstrap.css')
require('../css/main.scss')

$( document ).ready(function() {
    const $board = $('.game-wrapper');
    new Game($board);
});