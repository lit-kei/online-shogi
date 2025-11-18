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

const promote = [false,8,9,10,11,false,12,13,false,false,false,false,false,false,false,false];
const toJa = {1:["１","一"],2:["２","二"],3:["３","三"],4:["４","四"],5:["５","五"],6:["６","六"],7:["７","七"],8:["８","八"],9:["９","九"]};


let onlyKings = false;
let allKoma = false;
let boardState = [];
let last = [-1,-1];
let lastMove = null;
let currentPlayer = "white";
let selected = null;
let count = 0;
let put = null;
let nowMoves = [];
let history = [];
let possibleMoves = [];
const komadai = { black: {}, white: {} };
const boardEl = document.getElementById("board");
const turnEl = document.getElementById("turn");
const historyEl = document.getElementById('history');
const komadaiBlackEl = document.getElementById("komadai-black");
const komadaiWhiteEl = document.getElementById("komadai-white");
const modal = document.getElementById('modal');
const message = document.getElementById('message');
const statusEl = document.getElementById('status');
const anaBtn = document.getElementById('ana-btn');
const resignBtn = document.getElementById("resign-button");

const myUid = localStorage.getItem('shogi-uid') || "";

const SUPABASE_URL = "https://fveqlysrpudyomvskryk.supabase.co"; // ← ここ書き換える
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZXFseXNycHVkeW9tdnNrcnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjA5NjcsImV4cCI6MjA3Nzg5Njk2N30.zfmndX_YMeaq0eDgxG9ecjBpJS5KRDkmBaBFO7Iz9Yk";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');
const roles = {"player1":1,"player2":2,"audience":0};
let role = -1;
let isHost = null;
let interval = null;
let state = null;
let playerNames = [];
let analysis = false;
let historyMoves = [];

async function load() {
  const { data, error } = await supabase
    .from('rooms')  // テーブル名
    .select('*')
    .eq('id', roomId);
  if (error || data.length === 0) {
    message.textContent = "部屋が見つかりませんでした。";
    return;
  }
  if (data[0].player1_uid === data[0].player2_uid) {
    message.textContent = "不正な部屋です。";
    return;
  }
  if (data[0].status == 'PLAYING') {
    message.textContent = `${data[0].player1_name}(青) vs ${data[0].player2_name}(赤)`;
    document.getElementById('p1-koma').textContent = `${data[0].player1_name}(青)`;
    document.getElementById('p2-koma').textContent = `${data[0].player2_name}(赤)`;
  } else if (data[0].status == 'FINISHED') {
    message.textContent = `${data[0].player1_name}(青) vs ${data[0].player2_name}(赤)`;
    document.getElementById('p1-koma').textContent = `${data[0].player1_name}(青)`;
    document.getElementById('p2-koma').textContent = `${data[0].player2_name}(赤)`;
  }
  playerNames = [data[0].player1_name, data[0].player2_name];
  anaBtn.style.display = 'block';
  resignBtn.style.display = 'block';
  if (data[0].player1_uid === myUid) {
    role = roles.player1;
    isHost = true;

  } else if (data[0].player2_uid === myUid) {
    role = roles.player2;
    isHost = false;
  } else {
    role = roles.audience;
    analysis = true;
    anaBtn.style.display = 'none';
    resignBtn.style.display = 'none';
  }
  boardState = cloneBoard(data[0].info.board);
  last = data[0].info.last || [-1, -1];
  currentPlayer = data[0].info.currentPlayer;
  selected = null;
  count = data[0].info.count;
  put = null;
  history = data[0].info.history;
  historyMoves = data[0].info.historyMoves;
  lastMove = data[0].info.lastMove;
  komadai.black = data[0].info.komadai.black;
  komadai.white = data[0].info.komadai.white;
  if ((role == 1 && currentPlayer == "black") || (role == 2 && currentPlayer == "white")) nowMoves = getLegalMoves(komadai, boardState, currentPlayer).moves;
  possibleMoves = [];
  state = data[0].info.state;
  renderState();
  renderBoard();
  renderKomadai();
  updateTurnUI();
  renderHistory();
  renderNumber();
  if ((role === roles.player1 || role === roles.player2) && interval == null) {
    interval = setInterval(async () => {
      const now = new Date().toISOString();

      // 自分がplayer1かplayer2かを区別
      const playerCol = isHost ? 'player1_heartbeat' : 'player2_heartbeat';

      await supabase
        .from('rooms')
        .update({ [playerCol]: now })
        .eq('id', roomId);
    }, 5000);
  }
}

let animating = false;
function renderState() {
  switch (state) {
    case "P1W":
      if (role === 1 && !animating) createConfetti();

      const message1 = role == 0 ? "対局終了" : role == 1 ? "勝利" : "敗北";
      if (!animating) showEndEffect(message1);
      resignBtn.style.display = 'none';
      statusEl.textContent = '対局終了　' + playerNames[0] + '(青) の勝利！';
      break;
    case "P2W":
      if (role === 2 && !animating) createConfetti();
      const message2 = role == 0 ? "対局終了" : role == 2 ? "勝利" : "敗北";
      if (!animating) showEndEffect(message2);
      resignBtn.style.display = 'none';
      statusEl.textContent = '対局終了　' + playerNames[1] + '(赤) の勝利！';
      break;
  
    default:
      statusEl.textContent = "";
      break;
  }
}

function renderNumber() {
  const yoko = document.getElementById('yoko');
  yoko.innerHTML = '';
  const tate = document.getElementById('tate');
  tate.innerHTML = '';
  for (let i = 1; i < 10; i++) {
    const yokoN = document.createElement('span');
    yokoN.className = 'num';
    yokoN.textContent = toJa[isHost === false ? i : 10 - i][0];
    yoko.appendChild(yokoN);
    const tateN = document.createElement('span');
    tateN.className = 'num';
    tateN.textContent = toJa[isHost === false ? 10 - i : i][1];
    tate.appendChild(tateN);
  }
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (const child of Array.from(arrowLayer.children)) {
  if (child.tagName !== "defs") arrowLayer.removeChild(child);
}  // 配列もリセット
  arrows.length = 0;

  // （必要なら現在の描画中要素もリセット）
  currentArrow = null;
  currentCircle = null;
  startSquare = null;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const sq = document.createElement("div");
      sq.className = "square";
      sq.dataset.r = isHost === false ? reverse(r, "white") : r;
      sq.dataset.c = isHost === false ? reverse(c, "white") : c;
      const piece = boardState[isHost === false ? reverse(r, "white") : r][isHost === false ? reverse(c, "white") : c];
      if (piece) {
        const p = document.createElement("div");
        p.className = "piece";
        p.textContent = mapping[piece.t].display;
        p.draggable = false;
        p.dataset.player = piece.p;
        p.dataset.rotate = isHost === false ? piece.p === 'black' : piece.p === 'white';
        p.dataset.r = isHost === false ? reverse(r, "white") : r;
        p.dataset.c = isHost === false ? reverse(c, "white") : c;
        if (role == 1 && piece.p == "black") {
          sq.style.cursor = 'pointer';
        } else if (role == 2 && piece.p == "white") {
          sq.style.cursor = 'pointer';
        }
        sq.appendChild(p);
      }
      if (lastMove !== null && !lastMove.from.put) {
        if (lastMove.from.r == (isHost === false ? reverse(r, "white") : r) && lastMove.from.c == (isHost === false ? reverse(c, "white") : c)) {
          sq.classList.add('last-from');
        }
      }
      if (
        lastMove?.to &&
        (isHost === false ? reverse(r, "white") : r) === lastMove.to.r &&
        lastMove.to.c === (isHost === false ? reverse(c, "white") : c)
      ) {
        sq.classList.add('last-to');
      }
      if ((role == 1 && currentPlayer == "black") || (role == 2 && currentPlayer == "white")) sq.addEventListener("click", onSquareClick);
      boardEl.appendChild(sq);
    }
  }
}
function renderHistory() {
  historyEl.innerHTML = '';
  for (let index = 0; index < history.length; index++) {
    const element = history[index];
    makeHistory(element, index + 1);
  }
}
async function onSquareClick(e) {
  if (analysis === true) return;
  for (const child of Array.from(arrowLayer.children)) {
  if (child.tagName !== "defs") arrowLayer.removeChild(child);
}  // 配列もリセット
  arrows.length = 0;

  // （必要なら現在の描画中要素もリセット）
  currentArrow = null;
  currentCircle = null;
  startSquare = null;
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
function onKomadaiClick(e) {
  if (analysis === true) return;
  for (const child of Array.from(arrowLayer.children)) {
  if (child.tagName !== "defs") arrowLayer.removeChild(child);
}  // 配列もリセット
  arrows.length = 0;

  // （必要なら現在の描画中要素もリセット）
  currentArrow = null;
  currentCircle = null;
  startSquare = null;
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
    moveStr = `${posToSfen(to)}${mapping[piece.t].display}${promoted === null ? "" : promoted ? "成" : "不成"}(${9 - from.c}${1 + from.r})`;
    if (promoted) boardState[to.r][to.c].t = promote[boardState[to.r][to.c].t];
    boardState[from.r][from.c] = null;
  }
  currentPlayer = currentPlayer === "black" ? "white" : "black";

  lastMove = {from, to};
  
  // 詰み判定
  // --- 合法手の生成 ---
  nowMoves = getLegalMoves(komadai, boardState, currentPlayer).moves;

  // --- 合法手がない場合（詰み or 引き分け） ---
  if (nowMoves.length === 0) {
    if (isHost === false) {
      state = 'P2W';
    } else {
      state = 'P1W';
    }
  }

  history.push(moveStr);
  historyMoves.push({from, to, t: mapping[boardState[to.r][to.c].t].display});
  renderState();
  renderBoard();
  renderKomadai();
  updateTurnUI();
  renderHistory();

  const {error} = await supabase
      .from("rooms")
      .update({
        status: "FINISHED",
        info: {
          board: boardState,
          komadai: komadai,
          currentPlayer: currentPlayer,
          last: last,
          count: count,
          history: history,
          historyMoves: historyMoves,
          lastMove: lastMove,
          state: state
        }
      })
      .eq("id", roomId)
  if (error) {
    console.error(error);
  }

  
}
function makeHistory(txt, n) {
    const historyDiv = document.createElement('div');
    historyDiv.className = "history";
    const countSpan = document.createElement('span');
    countSpan.textContent = n + ".";
    countSpan.className = "count";
    const kifuSpan = document.createElement('span');
    kifuSpan.textContent = txt;
    kifuSpan.className = "kifu";
    historyDiv.appendChild(countSpan);
    historyDiv.appendChild(kifuSpan);
    historyEl.appendChild(historyDiv);
    historyEl.scrollTop = historyEl.scrollHeight;
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
      if (role == 1 && ownerKey == "black") {
        span.style.cursor = 'pointer';
      } else if (role == 2 && ownerKey == "white") {
        span.style.cursor = 'pointer';
      }
      if ((role == 1 && currentPlayer == "black") || (role == 2 && currentPlayer == "white")) span.addEventListener('click', onKomadaiClick);
      ownerEl.appendChild(span);
    });
  }
}
function updateTurnUI() {
  turnEl.textContent = currentPlayer === "black" ? `${playerNames[0] ?? "先手"}(青)` : `${playerNames[1] ?? "後手"}(赤)`;
}
function reverse(r,p) {
    return p === "black" ? r : 8 - r;
}

load();

// subscribe 部分をこのように置き換えます
const channel = supabase
  .channel(`rooms:${roomId}`) // 任意の名前
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'rooms',
      filter: `id=eq.${roomId}`
    },
    payload => {
      const oldData = payload.old;
      const newData = payload.new;
      // ✅ 新しくplayer2が参加したときの処理
      if (oldData.player2_uid == null && newData.player2_uid) {
        load();
        return;
      }

      // ✅ player1_heartbeat / player2_heartbeat のみ変更なら無視
      const onlyHeartbeatChanged =
        (oldData.player1_heartbeat !== newData.player1_heartbeat &&
        oldData.player2_heartbeat === newData.player2_heartbeat) ||
        (oldData.player2_heartbeat !== newData.player2_heartbeat &&
        oldData.player1_heartbeat === newData.player1_heartbeat);

      if (onlyHeartbeatChanged) {
        return;
      }
      // payload.new に更新後の row オブジェクトが入るはず
      const row = payload?.new;
      if (!row || !row.info) return;

      // info の中身だけ差分反映する（破壊的に上書きせず、安全に）
      try {
        // 既存の boardState 等を上書きする前に null/未定義チェック
        if (row.info.board) {
          boardState = cloneBoard(row.info.board);
        }
        last = row.info.last || [-1, -1];
        lastMove = row.info.lastMove ?? null;
        currentPlayer = row.info.currentPlayer ?? currentPlayer;
        count = row.info.count ?? count;
        komadai.black = row.info.komadai?.black ? {...row.info.komadai.black} : komadai.black;
        komadai.white = row.info.komadai?.white ? {...row.info.komadai.white} : komadai.white;
        history = row.info.history ?? history;
        historyMoves = row.info.historyMoves ?? historyMoves;
        state = row.info.state ?? state;

        // nowMoves を再計算（自分の手番なら）
        if ((role == 1 && currentPlayer == "black") || (role == 2 && currentPlayer == "white")) {
          nowMoves = getLegalMoves(komadai, boardState, currentPlayer).moves;
        } else {
          nowMoves = [];
        }

        // UI 更新（安全なレンダリング）
        renderState()
        renderBoard();
        renderKomadai();
        updateTurnUI();
        renderHistory();

      } catch (err) {
        console.error('Realtime apply error:', err);
        // 最終手段で load() を呼ぶ（例外時のみ）
        load();
      }
    }
  )
  .subscribe();

anaBtn.addEventListener('click', () => {
    anaBtn.classList.toggle('on');
    analysis = !analysis;
      selected = null;
      put = null;
      clearHighlights();
});
document.getElementById('delete').addEventListener('click', () => {
  for (const child of Array.from(arrowLayer.children)) {
    if (child.tagName !== "defs") arrowLayer.removeChild(child);
  }  // 配列もリセット
  arrows.length = 0;

  // （必要なら現在の描画中要素もリセット）
  currentArrow = null;
  currentCircle = null;
  startSquare = null;
});
window.addEventListener('keydown', (e) => {
    if (e.code == 'Enter') {
    if(role != roles.audience) {
      anaBtn.classList.toggle('on');
      analysis = !analysis;
      selected = null;
      put = null;
      clearHighlights();
    } else {
        for (const child of Array.from(arrowLayer.children)) {
          if (child.tagName !== "defs") arrowLayer.removeChild(child);
        }  // 配列もリセット
        arrows.length = 0;

        // （必要なら現在の描画中要素もリセット）
        currentArrow = null;
        currentCircle = null;
        startSquare = null;
    }
    }
});

// ブラウザを閉じる・離れるときに購読解除
window.addEventListener('beforeunload', async () => {
  try {
    await supabase.removeChannel(channel);
  } catch (e) {
    // 互換性により channel.unsubscribe() を使う実装もある
    try { channel.unsubscribe(); } catch (_) {}
  }
});
function getSquareFromMouse(e) {
  const rect = boardEl.getBoundingClientRect();
  const boardX = e.clientX - boardEl.offsetLeft - 30;
  const boardY = e.clientY - boardEl.offsetTop - 70;

  const squareSize = boardEl.clientWidth / 9; // ボーダー除外のサイズ
  function check (n) {
    if (n > 8) return 8;
    if (n < 0) return 0;
    return n;
  }
  const c = check(Math.floor(boardX / squareSize));
  const r = check(Math.floor(boardY / squareSize));
  return {
    r: r + 1,
    c: c + 1,
    centerX: (c) * squareSize + squareSize / 2 + 54,
    centerY: (r) * squareSize + squareSize / 2 + 54
  };
}

const arrows = [];
// === SVGレイヤー ===
const arrowLayer = document.getElementById("arrow-layer");

// 矢印マーカー
const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
marker.setAttribute("id", "arrowhead");
marker.setAttribute("markerWidth", "10");
marker.setAttribute("markerHeight", "10");
marker.setAttribute("refX", "10");
marker.setAttribute("refY", "5");
marker.setAttribute("orient", "auto");
marker.setAttribute("markerUnits", "strokeWidth");

const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
polygon.setAttribute("points", "0 0, 10 5, 0 10");
polygon.setAttribute("fill", "limegreen");

marker.appendChild(polygon);
defs.appendChild(marker);
arrowLayer.appendChild(defs);

let currentArrow = null;
let currentCircle = null;
let startSquare = null;

if (boardEl.offsetHeight > 500) {

  boardEl.addEventListener("mousedown", (e) => {
    if (!analysis) return;
    startSquare = getSquareFromMouse(e);

    // circle（常に追加しておく。表示は後で切り替える）
    currentCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    currentCircle.setAttribute("cx", startSquare.centerX);
    currentCircle.setAttribute("cy", startSquare.centerY);
    currentCircle.setAttribute("r", 30);
    currentCircle.setAttribute("stroke", "limegreen");
    currentCircle.setAttribute("stroke-width", 4);
    currentCircle.setAttribute("fill", "none");
    currentCircle.style.display = 'block'; // 最初は表示しておく（有れば円表示）
    arrowLayer.appendChild(currentCircle);

    // line（矢印）
    currentArrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    currentArrow.setAttribute("x1", startSquare.centerX);
    currentArrow.setAttribute("y1", startSquare.centerY);
    currentArrow.setAttribute("x2", startSquare.centerX);
    currentArrow.setAttribute("y2", startSquare.centerY);
    currentArrow.setAttribute("stroke", "limegreen");
    currentArrow.setAttribute("stroke-width", "3");
    currentArrow.setAttribute("stroke-linecap", "round");
    currentArrow.setAttribute("marker-end", "url(#arrowhead)");
    currentArrow.style.display = 'none'; // 最初は非表示
    arrowLayer.appendChild(currentArrow);
  });

  boardEl.addEventListener("mousemove", (e) => {
    if (!currentArrow || !currentCircle) return;
    const sq = getSquareFromMouse(e);
    currentArrow.setAttribute("x2", sq.centerX);
    currentArrow.setAttribute("y2", sq.centerY);

    // 始点と終点が同じマスなら円表示、違えば矢印表示
    const x1 = parseFloat(currentArrow.getAttribute("x1"));
    const y1 = parseFloat(currentArrow.getAttribute("y1"));
    const x2 = parseFloat(currentArrow.getAttribute("x2"));
    const y2 = parseFloat(currentArrow.getAttribute("y2"));

    if (x1 === x2 && y1 === y2) {
      currentArrow.style.display = 'none';
      currentCircle.style.display = 'block';
    } else {
      currentArrow.style.display = 'block';
      currentCircle.style.display = 'none';
    }
  });

  // 確定／重複削除処理を厳密に行う
  window.addEventListener("mouseup", (e) => {
    if (!currentArrow || !currentCircle) return;

    // 最終座標を取得（マスにスナップ済みの getSquareFromMouse を使う）
    const sq = getSquareFromMouse(e);
    currentArrow.setAttribute("x2", sq.centerX);
    currentArrow.setAttribute("y2", sq.centerY);
    currentCircle.setAttribute("cx", parseFloat(currentArrow.getAttribute("x1")));
    currentCircle.setAttribute("cy", parseFloat(currentArrow.getAttribute("y1")));

    const x1 = parseFloat(currentArrow.getAttribute("x1"));
    const y1 = parseFloat(currentArrow.getAttribute("y1"));
    const x2 = parseFloat(currentArrow.getAttribute("x2"));
    const y2 = parseFloat(currentArrow.getAttribute("y2"));

    if (x1 === x2 && y1 === y2) {
      // === 円の確定 or 削除 ===
      const existingCircleIndex = arrows.findIndex(a =>
        a.type === "circle" && a.cx === x1 && a.cy === y1
      );

      if (existingCircleIndex !== -1) {
        // 既存の円を削除（既存要素）
        const existing = arrows[existingCircleIndex];
        if (existing.el && existing.el.parentNode === arrowLayer) {
          arrowLayer.removeChild(existing.el);
        }
        arrows.splice(existingCircleIndex, 1);

        // そして描画中の currentCircle は DOM から削除（追加済みなので消す）
        if (currentCircle.parentNode === arrowLayer) arrowLayer.removeChild(currentCircle);
      } else {
        // 新規円として確定：表示はそのまま、配列に追加
        currentCircle.style.display = 'block';
        arrows.push({ type: "circle", cx: x1, cy: y1, el: currentCircle });
      }

      // 描画中の矢印要素は不要なので削除（存在するなら）
      if (currentArrow.parentNode === arrowLayer) arrowLayer.removeChild(currentArrow);

    } else {
      // === 矢印の確定 or 削除 ===
      const existingArrowIndex = arrows.findIndex(a =>
        a.type === "arrow" &&
        a.x1 === x1 && a.y1 === y1 && a.x2 === x2 && a.y2 === y2
      );

      if (existingArrowIndex !== -1) {
        // 既存の矢印を削除
        const existing = arrows[existingArrowIndex];
        if (existing.el && existing.el.parentNode === arrowLayer) {
          arrowLayer.removeChild(existing.el);
        }
        arrows.splice(existingArrowIndex, 1);

        // currentArrow（まだ追加済み）も削除して残さない
        if (currentArrow.parentNode === arrowLayer) arrowLayer.removeChild(currentArrow);
      } else {
        // 新規矢印として確定（currentArrow は既に arrowLayer に追加済み）
        currentArrow.style.display = 'block';
        arrows.push({ type: "arrow", x1, y1, x2, y2, el: currentArrow });
        // currentCircle（同座標でないので DOM にあっても非表示にして削除）
        if (currentCircle.parentNode === arrowLayer) arrowLayer.removeChild(currentCircle);
      }
    }

    // リセット
    currentArrow = null;
    currentCircle = null;
    startSquare = null;
  });
}
let resignClickedOnce = false;

resignBtn.addEventListener("click", async () => {
  if (role === roles.audience || state == 'P1W' || state == 'P2W') return;
  if (!resignClickedOnce) {
    // 1回目の押下：確認モードにする
    resignClickedOnce = true;
    resignBtn.classList.add('once');
    resignBtn.textContent = "もう一度押すと投了";
    resignBtn.style.backgroundColor = "#d35400"; // 少し濃いオレンジに変化

    // 一定時間でリセット（例：3秒）
    setTimeout(() => {
      resignClickedOnce = false;
      resignBtn.textContent = "投了";
      resignBtn.classList.remove('once');
    }, 3000);
  } else {
    // 2回目の押下：投了確定
    resignClickedOnce = false;
    resignBtn.textContent = "投了";
    resignBtn.classList.remove('once');
    if (isHost === false) {
      state = 'P1W';
    } else {
      state = 'P2W';
    }
    renderState();

  const {error} = await supabase
      .from("rooms")
      .update({
        status: "FINISHED",
        info: {
          board: boardState,
          komadai: komadai,
          currentPlayer: currentPlayer,
          last: last,
          count: count,
          history: history,
          historyMoves: historyMoves,
          lastMove: lastMove,
          state: state
        }
      })
      .eq("id", roomId)
    if (error) {
      console.error(error);
    }
  }
});







function showEndEffect(message) {
  animating = true;
  const effect = document.getElementById("end-effect");

  effect.textContent = message;
  effect.classList.remove("hidden");

  requestAnimationFrame(() => effect.classList.add("show"));

  setTimeout(() => {
    effect.classList.remove("show");
    setTimeout(() => {
      effect.classList.add("hidden");
      animating = false;
    }, 1000);
  }, 5000);
}
function createConfetti(count = 400) {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  const confettis = [];

  class Confetti {
    constructor() {
      this.el = document.createElement("div");
      this.el.className = "confetti";

      const colors = ["#ff4d4d", "#ffd633", "#66ccff", "#66ff99", "#ff99ff", "#ffffff"];
      this.el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      this.el.style.width = 8 + Math.random() * 8 + "px";
      this.el.style.height = 10 + Math.random() * 12 + "px";

      // 初期位置（画面下から）
      this.x = boardEl.offsetWidth * 0.5 + (Math.random() - 0.5) * boardEl.offsetWidth;
      this.y = 250 + (Math.random() *100);
      this.el.style.left = this.x + "px";
      this.el.style.top = this.y + "px";
      this.threshold = Math.random() * 1 + 2;

      // 初速度
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = - (6 + Math.random() * 1);
      this.gravity = 0.02 + Math.random() * 0.05;
      this.angle = Math.random() * 360;
      this.vr = (Math.random() - 0.5) * 10;

      
      container.appendChild(this.el);
    }

    update() {
      //this.vy += this.gravity;
      if (this.vy < this.threshold) this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.vr;
      this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;
    }

    isOut() {
      return this.y > 500;
    }

    remove() {
      this.el.remove();
    }
  }

  for (let i = 0; i < count; i++) {
    confettis.push(new Confetti());
  }

  function animate() {
    for (let i = confettis.length - 1; i >= 0; i--) {
      const c = confettis[i];
      c.update();
      if (c.isOut()) {
        c.remove();
        confettis.splice(i, 1);
      }
    }
    if (confettis.length > 0) requestAnimationFrame(animate);
  }

  animate();
}
function getKifu() {
  let txt = "";
  for (let i = 0; i < historyMoves.length; i++) {
    const e = historyMoves[i];
    if (Number.isInteger(e.t)) {
      e.t = mapping[e.t].display;
    }
    txt += String(i + 1);
    if (e.from.put) {
      txt += ` ${newPosToSfen(e.to)}${e.t}打`;
    } else {
      txt += ` ${newPosToSfen(e.to)}${e.t}${e.to.promoted === null ? "" : e.to.promoted ? "成" : "不成"}(${e.from.c + 1}${9 - e.from.r})`;
    }
    txt += "\n";
  }
  console.log(txt);
}
window.getKifu = getKifu;
function newPosToSfen(pos) {

  const file = pos.c + 1;
  const rank = 8 - pos.r + 1;
  return `${toJa[file][0]}${toJa[rank][1]}`;

}
