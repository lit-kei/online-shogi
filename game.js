const kinMoves = [{pos:[-1,-1],inf:false},{pos:[-1,0],inf:false},{pos:[-1,1],inf:false},{pos:[0,-1],inf:false},{pos:[0,1],inf:false},{pos:[1,0],inf:false}];
const mapping = {
    0:{display: "", move: [], value: 0},
    1:{display: "歩", move: [{pos:[-1,0],inf:false}], value: 10},
    2:{display: "香", move: [{pos:[-1,0],inf:true}], value: 20},
    3:{display: "桂", move: [{pos:[-2,-1],inf:false},{pos:[-2,1],inf:false}], value: 20},
    4:{display: "銀", move: [{pos:[-1,-1],inf:false},{pos:[-1,0],inf:false},{pos:[-1,1],inf:false},{pos:[1,-1],inf:false},{pos:[1,1],inf:false}], value: 35},
    5:{display: "金", move: [...kinMoves], value: 50},
    6:{display: "角", move: [{pos:[-1,-1],inf:true},{pos:[-1,1],inf:true},{pos:[1,-1],inf:true},{pos:[1,1],inf:true}], value: 80},
    7:{display: "飛", move: [{pos:[-1,0],inf:true},{pos:[0,-1],inf:true},{pos:[0,1],inf:true},{pos:[1,0],inf:true}], value: 100},
    8:{display: "と", move: [...kinMoves], value: 12},
    9:{display: "成香", move: [...kinMoves], value: 24},
    10:{display: "成桂", move: [...kinMoves], value: 24},
    11:{display: "成銀", move: [...kinMoves], value: 42},
    12:{display: "馬", move: [{pos:[-1,-1],inf:true},{pos:[-1,1],inf:true},{pos:[1,-1],inf:true},{pos:[1,1],inf:true},{pos:[-1,0],inf:false},{pos:[0,-1],inf:false},{pos:[0,1],inf:false},{pos:[1,0],inf:false}], value: 96},
    13:{display: "龍", move: [{pos:[-1,0],inf:true},{pos:[0,-1],inf:true},{pos:[0,1],inf:true},{pos:[1,0],inf:true},{pos:[-1,-1],inf:false},{pos:[-1,1],inf:false},{pos:[1,-1],inf:false},{pos:[1,1],inf:false}], value: 120},
    14:{display: "王", move: [{pos:[-1,-1],inf:false},{pos:[-1,0],inf:false},{pos:[-1,1],inf:false},{pos:[0,-1],inf:false},{pos:[0,1],inf:false},{pos:[1,-1],inf:false},{pos:[1,0],inf:false},{pos:[1,1],inf:false}], value: 500},
    15:{display: "玉", move: [{pos:[-1,-1],inf:false},{pos:[-1,0],inf:false},{pos:[-1,1],inf:false},{pos:[0,-1],inf:false},{pos:[0,1],inf:false},{pos:[1,-1],inf:false},{pos:[1,0],inf:false},{pos:[1,1],inf:false}], value: 500}
}
const players = {white: -1, black: 1};
const initialSetup = [
[ {t:2,p:'white'},{t:3,p:'white'},{t:4,p:'white'},{t:5,p:'white'},{t:15,p:'white'},{t:5,p:'white'},{t:4,p:'white'},{t:3,p:'white'},{t:2,p:'white'} ],
[ null,{t:7,p:'white'},null,null,null,null,null,{t:6,p:'white'},null ],
[ {t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'},{t:1,p:'white'} ],
[ null,null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null,null ],
[ {t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'},{t:1,p:'black'} ],
[ null,{t:6,p:'black'},null,null,null,null,null,{t:7,p:'black'},null ],
[ {t:2,p:'black'},{t:3,p:'black'},{t:4,p:'black'},{t:5,p:'black'},{t:14,p:'black'},{t:5,p:'black'},{t:4,p:'black'},{t:3,p:'black'},{t:2,p:'black'} ],
];
const onlyKingsBoard = [
  [null,null,null,null,{t:15,p:'white'},null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null],
  [null,null,null,null,{t:14,p:'black'},null,null,null,null],
];
const onlyKingsKomadai = {
  black: {1:9, 2:2, 3:2, 4:2, 5:2, 6:1, 7:1},
  white: {1:9, 2:2, 3:2, 4:2, 5:2, 6:1, 7:1}
};
const allKomadai = {
  black: {},
  white: {1:18, 2:4, 3:4, 4:4, 5:4, 6:2, 7:2}
};
const promote = [false,8,9,10,11,false,12,13,false,false,false,false,false,false,false,false];
const toJa = {1:["１","一"],2:["２","二"],3:["３","三"],4:["４","四"],5:["５","五"],6:["６","六"],7:["７","七"],8:["８","八"],9:["９","九"]};
const masuValue = [
[3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3],
[2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2],
[1,1,1,1,1,1,1,1,1],
[3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3]
];


let onlyKings = false;
let allKoma = false;
let boardHistory = [];
let searchDepth = 4;
let maxPutWidth = 30;
let aiMode = {white: false, black: false};
let boardState = [];
let last = [-1,-1];
let currentPlayer = "white";
let selected = null;
let count = 0;
let put = null;
let finish = true;
let nowMoves = [];
let possibleMoves = [];
const komadai = { black: {}, white: {} };
const boardEl = document.getElementById("board");
const turnEl = document.getElementById("turn");
const komadaiBlackEl = document.getElementById("komadai-black");
const komadaiWhiteEl = document.getElementById("komadai-white");
const modal = document.getElementById('modal');
function init() {
  boardHistory = [];
  boardState = cloneBoard(onlyKings ? onlyKingsBoard : initialSetup);
  last = [-1,-1];
  currentPlayer = "white";
  selected = null;
  count = 0;
  put = null;
  finsih = true;
  if (onlyKings) {
    if (allKoma) {
      komadai.black = allKomadai.black;
      komadai.white = allKomadai.white;
    } else {
      komadai.black = onlyKingsKomadai.black;
      komadai.white = onlyKingsKomadai.white;
    }
  } else {
    komadai.black = {};
    komadai.white = {};
  }
  nowMoves = getLegalMoves(komadai, boardState, currentPlayer).moves;
  possibleMoves = [];
  renderBoard();
  renderKomadai();
  updateTurnUI();
}
function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const sq = document.createElement("div");
      sq.className = "square";
      sq.dataset.r = r;
      sq.dataset.c = c;
      const piece = boardState[r][c];
      if (piece) {
        const p = document.createElement("div");
        p.className = "piece";
        p.textContent = mapping[piece.t].display;
        p.draggable = false;
        p.dataset.player = piece.p;
        p.dataset.r = r;
        p.dataset.c = c;
        sq.appendChild(p);
      }
      sq.addEventListener("click", onSquareClick);
      boardEl.appendChild(sq);
    }
  }
}
async function onSquareClick(e) {
  const sq = e.currentTarget;
  const r = Number(sq.dataset.r);
  const c = Number(sq.dataset.c);
  const cell = boardState[r][c];
  if (cell && cell.p === currentPlayer) {
    clearHighlights();
    if (selected && r == selected.r && c == selected.c) {
        selected = null;
        return;
    }
    selected = { r, c };
    put = null;
    sq.classList.add("selected");
    possibleMoves = nowMoves.filter(e => e.from.put == false && e.from.r == r && e.from.c == c);
    possibleMoves.forEach(e => {
      document.querySelector(`.square[data-r='${e.to.r}'][data-c='${e.to.c}']`).classList.add("highlight");
    });
    return;
  }
  if (selected && possibleMoves.some(move => move.from.put === false && move.to.r === r && move.to.c === c)) {
    const from = { put: false, ...selected };
    const to = { r, c };
    let promoted = null;
    const piece = boardState[selected.r][selected.c];
    if ((to.r <= 2 && piece.p == 'black' && promote[piece.t]) || (to.r >= 6 && piece.p == 'white' && promote[piece.t]) || 
        (from.r <= 2 && piece.p == 'black' && promote[piece.t]) || (from.r >= 6 && piece.p == 'white' && promote[piece.t])) {
          switch (piece.t) {
            case 1:
                if (to.r == reverse(0, piece.p)) {
                    promoted = true;
                } else {
                    promoted = await askPromotion();
                }
                break;
            case 2:
                if (to.r == reverse(0, piece.p)) {
                    promoted = true;
                } else {
                    promoted = await askPromotion();
                }
                break;
            case 3:
                if (to.r == reverse(0, piece.p) || to.r == reverse(1, piece.p)) {
                    promoted = true;
                } else {
                    promoted = await askPromotion();
                }
                break;
            default:
                promoted = await askPromotion();
                break;
        }
    }
    to.promoted = promoted;
    makeMove(from, to);
    selected = null;
    put = null;
    clearHighlights();
  }
  if (put && possibleMoves.some(move => move.from.put === true && move.to.r === r && move.to.c === c)) {
    makeMove({put: true,t: put}, {r, c});
    selected = null;
    put = null;
    clearHighlights();
  }
}
function getMoveList(board, r, c, friendFire = false) {
    const e = board[r][c];
    if (!e) return [];
    const s = players[e.p];
    const moves = mapping[e.t].move;
    const list = [];
    moves.forEach(move => {
        if (move.inf == false) {
            const newR = move.pos[0] * s + r;
            const newC = move.pos[1] + c;
            if (rangeCheck(newR) && rangeCheck(newC)) {
                const cell = board[newR][newC];
                if (!cell || cell.p !== e.p || friendFire) list.push([newR, newC]);
            }
        } else {
            let newR = move.pos[0] * s + r;
            let newC = move.pos[1] + c;
            while (rangeCheck(newR) && rangeCheck(newC) && (!board[newR][newC] || board[newR][newC].p !== e.p || friendFire)) {
                const cell = board[newR][newC];
                list.push([newR, newC]);
                if (cell) break;
                newR += move.pos[0] * s;
                newC += move.pos[1];
            }
        }
    });
    return list;
}
function cloneBoard(board) {
  return board.map(row => row.map(cell => cell ? {...cell} : null));
}

function cloneKomadai(koma) {
  const newKomadai = {};
  for (const player of Object.keys(koma)) {
    newKomadai[player] = {...koma[player]};
  }
  return newKomadai;
}

function getLegalMoves(koma, board,p) {
    const moves = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
              if (board[r][c] && board[r][c].p == p) {
                const piece = board[r][c];
                getMoveList(board, r, c).forEach(([tr, tc]) => {
                  if ((tr <= 2 && p == 'black' && promote[piece.t]) || (tr >= 6 && p == 'white' && promote[piece.t]) || 
                      (r <= 2 && p == 'black' && promote[piece.t]) || (r >= 6 && p == 'white' && promote[piece.t])) {
                        switch (piece.t) {
                          case 2:
                              if (tr == reverse(0, piece.p)) {
                                moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: true}});
                              } else {
                                moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: true}});
                                moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: false}});
                              }
                              break;
                          case 3:
                              if (tr == reverse(0, piece.p) || tr == reverse(1, piece.p)) {
                                moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: true}});
                              } else {
                                moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: true}});
                                moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: false}});
                              }
                              break;
                          case 4:
                              moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: true}});
                              moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: false}});
                              break;
                          default:
                              moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: true}});
                              break;
                      }
                  } else {
                    moves.push({from: {put: false, r, c}, to: {r: tr, c: tc, promoted: null}});
                  }
                });
              }
        
        }
    }
    const change = moves.length;
    for (const ko in koma[p]) {
      if (!Object.hasOwn(koma[p], ko) || koma[p][ko] <= 0) continue;
      const pieceType = Number(ko);

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] !== null) continue; // すでに駒あり

          // 歩の二歩チェック
          if (pieceType === 1) {
            const hasPawn = board.some(row =>
              row[c] && row[c].p === p && row[c].t === 1
            );
            if (hasPawn) continue;
          }

          // 盤端打ち禁止（歩・香・桂）
          if ((pieceType === 1 || pieceType === 2) && r === reverse(0, p)) continue;
          if (pieceType === 3 && (r === reverse(0, p) || r === reverse(1, p))) continue;

          moves.push({ from: { put: true, t: pieceType }, to: { r, c } });
        }
      }
    }
    
    // === ★ 王が死ぬ手を除外 ===
    const safeMoves = moves.filter(move => {
        const { newBoard, newKomadai } = makeMoveSim(koma, board, move, p);
        return !isKingInCheck(newBoard, p); // 自分の王が攻撃されていないなら合法
    });
    return {moves: safeMoves, change};
}
function backTo(n, target) {
  if (0 > n || n >= count) return;
  const e = boardHistory[n];
  komadai.black = JSON.parse(JSON.stringify(e.komadai.black));
  komadai.white = JSON.parse(JSON.stringify(e.komadai.white));
  boardState = e.boardState.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
  last = [...e.last];
  currentPlayer = e.currentPlayer;
  count = e.count;
  let next = target.nextElementSibling;

  while (next) {
    const toRemove = next;
    next = next.nextElementSibling;
    toRemove.remove();
  }

  renderBoard();
  renderKomadai();
  updateTurnUI();
}
function onKomadaiClick(e) {
    const sq = e.currentTarget;
    const p = sq.dataset.p;
    const t = Number(sq.dataset.t);
    if (p == currentPlayer) {
        clearHighlights();
        if (put && put == t) {
            put = null;
            return;
        }
        selected = null;
        sq.classList.add("selected");
        put = t;
        possibleMoves = nowMoves.filter(e => e.from.put === true && e.from.t === t);
        possibleMoves.forEach(move => {
          document.querySelector(`.square[data-r='${move.to.r}'][data-c='${move.to.c}']`).classList.add("highlight");
        })
    }
}
function clearHighlights() {
  document.querySelectorAll(".square, .cap").forEach((s) => {
    s.classList.remove("highlight");
    s.classList.remove("selected");
  });
}
function rangeCheck(n) {
    return 0 <= n && n <= 8 ? true : false;
}
function askPromotion() {
  return new Promise((resolve) => {
    modal.style.display = 'block';
    // 成るボタン
    document.getElementById('promote-yes').onclick = () => {
      modal.style.display = 'none';
      resolve(true);
    };
    // 成らないボタン
    document.getElementById('promote-no').onclick = () => {
      modal.style.display = 'none';
      resolve(false);
    };
  });
}
async function makeMove(from, to) {
  let moveStr = "";
  if (from.put) {
    boardState[to.r][to.c] = {t:from.t,p:currentPlayer};
    komadai[currentPlayer][from.t]--;
    if (komadai[currentPlayer][from.t] == 0) delete komadai[currentPlayer][from.t];
    moveStr = `${posToSfen(to)}${mapping[from.t].display}打`;
  } else {
    const piece = boardState[from.r][from.c];
    const dest = boardState[to.r][to.c];
    if (!piece) return;
    let promoted = to.promoted;
    count++;
    if (dest) {
      const captured = { ...dest };
      const base = demote(captured.t);
      const owner = piece.p;
      if (!komadai[owner][base]) komadai[owner][base] = 0;
      komadai[owner][base]++;
    }
    boardState[to.r][to.c] = { ...piece };
    moveStr = `${posToSfen(to)}${mapping[boardState[to.r][to.c].t].display}${promoted === null ? "" : promoted ? "成" : "不成"}`;
    if (promoted) boardState[to.r][to.c].t = promote[boardState[to.r][to.c].t];
    boardState[from.r][from.c] = null;
  }
  currentPlayer = currentPlayer === "black" ? "white" : "black";

  const newKomadai = cloneKomadai(komadai);
  const newBoardState = cloneBoard(boardState)
  boardHistory.push({komadai: newKomadai, boardState: newBoardState, last: [...last], currentPlayer, count});
  renderBoard();
  renderKomadai();
  updateTurnUI();

  await new Promise(resolve => setTimeout(resolve, 1));

  // 詰み判定
  // --- 合法手の生成 ---
  nowMoves = getLegalMoves(komadai, boardState, currentPlayer).moves;

  // --- 合法手がない場合（詰み or 引き分け） ---
  if (nowMoves.length === 0) {
      const checked = isKingInCheck(boardState, currentPlayer);
      if (checked) {
        alert(`${currentPlayer == "black" ? "先手" : "後手"} の勝ちです。`);
      } else {
          // ステイルメイト（千日手など）→引き分け扱い
        alert("引き分けです。");
      }
  }
  
}
function getAttackSquares(board, player) {
    const attackSquares = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const e = board[r][c];
            if (!e || e.p !== player) continue;
            // friendFire = true にして「味方を無視した攻撃範囲」を取る
            const moves = getMoveList(board, r, c, true);
            attackSquares.push(...moves.map(([tr, tc]) => [tr, tc]));
        }
    }
    return attackSquares;
}

function isKingInCheck(board, player) {
    const enemy = player === "black" ? "white" : "black";
    // 王の位置を探す
    let kingPos = null;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const e = board[r][c];
            if (e && e.p === player && (e.t === 14 || e.t === 15)) {
                kingPos = [r, c];
                break;
            }
        }
    }
    if (!kingPos) return true; // 王がいない（詰み）
    const [kr, kc] = kingPos;

    // 敵の攻撃範囲を取得
    const enemyAttacks = getAttackSquares(board, enemy);
    return enemyAttacks.some(([r, c]) => r === kr && c === kc);
}
function makeMoveSim(koma, board, move, p) {
    const newBoard = cloneBoard(board);
    const newKomadai = cloneKomadai(koma);
    if (move.from.put) {//
    if (newKomadai[p][move.from.t] || newKomadai[p][move.from.t] > 0) {
        newBoard[move.to.r][move.to.c] = {t:move.from.t, p: p};
        newKomadai[p][move.from.t]--;
        if (newKomadai[p][move.from.t] === 0) delete newKomadai[p][move.from.t]; // 0なら削除
    }
    } else {
      const dest = newBoard[move.to.r][move.to.c];
      const piece = newBoard[move.from.r][move.from.c];
      newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
      if (move.to.promoted) {
        newBoard[move.to.r][move.to.c].t = promote[piece.t];
      }
      if (dest) {
        const captured = { ...dest };
        const base = demote(captured.t);
        const owner = piece.p;
        if (!newKomadai[owner][base]) {
          newKomadai[owner][base] = 0;
        }
        newKomadai[owner][base]++;
      }
      newBoard[move.from.r][move.from.c] = null;
    }
    return {newBoard, newKomadai};
}

function demote(t) {
    const s = promote.indexOf(t);
    return s == -1 ? t : s;
}
function posToSfen(pos) {
  const file = 9 - pos.c;
  const rank = pos.r + 1;
  if (last[0] == file && last[1] == rank) return '同';
  last = [file, rank];
  return `${toJa[file][0]}${toJa[rank][1]}`;
}
function renderKomadai() {
  komadaiBlackEl.innerHTML = "";
  komadaiWhiteEl.innerHTML = "";
  for (const [ownerEl, ownerKey] of [
    [komadaiBlackEl, "black"],
    [komadaiWhiteEl, "white"],
  ]) {
    const map = komadai[ownerKey];
    Object.keys(map).forEach((k) => {
      const span = document.createElement("div");
      span.className = "cap";
      span.textContent = `${mapping[k].display} x${map[k]}`;
      span.dataset.t = k;
      span.dataset.p = ownerKey;
      span.addEventListener('click', onKomadaiClick);
      ownerEl.appendChild(span);
    });
  }
}
function updateTurnUI() {
  turnEl.textContent = currentPlayer === "black" ? "後手 (△)" : "先手 (▲)";
}
function reverse(r,p) {
    return p === "black" ? r : 8 - r;
}
document.getElementById("btn-reset").addEventListener("click", () => {
  if(confirm("本当に初期化しますか？")) init();
});
init();
window.getBoardState = () => boardState;
window.getCurrentPlayer = () => currentPlayer;
window.doMove = (from, to) => {
  makeMove(from, to);
};
window.getKomadai = () => komadai;
console.log(
  "将棋GUIロード完了。window.getBoardState(), window.doMove({r,c},{r,c}) などを使えます。"
);