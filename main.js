'use strict'

let playerName = localStorage.getItem('shogi-name');
if (!playerName) {
    playerName = prompt("名前を入力してください：");
    while (!playerName) {
        playerName = prompt("名前を入力してください：");
    }
    localStorage.setItem('shogi-name', playerName);
}
