
const mapping = {
    0: {name: "", image:"", move: [], value: 0},
    1: {name: "", image: "P", move: [{pos:[-1, 0],inf:false}]},
    2: {name: "R", image: "R", move: [{pos:[-1,0],inf:true},{pos:[0,-1],inf:true},{pos:[0,1],inf:true},{pos:[1,0],inf:true}]},
    3: {name: "N", image: "N", move: [{pos:[-2,-1],inf:false},{pos:[-2,1],inf:false},{pos:[-1,2],inf:false},{pos:[1,2],inf:false},{pos:[2,1],inf:false},{pos:[2,-1],inf:false},{pos:[1,-2],inf:false},{pos:[-1,-2],inf:false}]},
    4: {name: "B", image: "B", move: [{pos:[-1,-1],inf:true},{pos:[-1,1],inf:true},{pos:[1,-1],inf:true},{pos:[1,1],inf:true}]},
    5: {name: "Q", image: "Q", move: [{pos:[-1,0],inf:true},{pos:[0,-1],inf:true},{pos:[0,1],inf:true},{pos:[1,0],inf:true},{pos:[-1,-1],inf:true},{pos:[-1,1],inf:true},{pos:[1,-1],inf:true},{pos:[1,1],inf:true}]},
    6: {name: "K", image: "K", move: [{pos:[-1,-1],inf:false},{pos:[-1,0],inf:false},{pos:[-1,1],inf:false},{pos:[0,-1],inf:false},{pos:[0,1],inf:false},{pos:[1,-1],inf:false},{pos:[1,0],inf:false},{pos:[1,1],inf:false}]}
}
const players = {white: 1, black: -1};
const initialSetup = [
[ {t:2,p:'black',moved:false},{t:3,p:'black',moved:false},{t:4,p:'black',moved:false},{t:5,p:'black',moved:false},{t:6,p:'black',moved:false},{t:4,p:'black',moved:false},{t:3,p:'black',moved:false},{t:2,p:'black',moved:false} ],
[ {t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false} ],
[ null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null ],
[ {t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false} ],
[ {t:2,p:'white',moved:false},{t:3,p:'white',moved:false},{t:4,p:'white',moved:false},{t:5,p:'white',moved:false},{t:6,p:'white',moved:false},{t:4,p:'white',moved:false},{t:3,p:'white',moved:false},{t:2,p:'white',moved:false} ]
];


let boardHistory = [];
let boardState = [];
let last = [-1,-1];
let currentPlayer = "white";
let selected = null;
let count = 0;
let history = [];
let lastMove = null;
let finish = true;
let enPassantTarget = null;
let nowMoves = [];
let possibleMoves = [];
const alphabet = "abcdefgh";


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

const boardEl = document.getElementById("board");
const turnEl = document.getElementById("turn");
const historyEl = document.getElementById('history');
const modal = document.getElementById('modal');
const message = document.getElementById('message');
const statusEl = document.getElementById('status');
const anaBtn = document.getElementById('ana-btn');
const resignBtn = document.getElementById("resign-button");


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
    message.textContent = `${data[0].player1_name}(白) vs ${data[0].player2_name}(黒)`;
  } else if (data[0].status == 'FINISHED') {
    message.textContent = `${data[0].player1_name}(白) vs ${data[0].player2_name}(黒)`;
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
  currentPlayer = data[0].info.currentPlayer;
  selected = null;
  count = data[0].info.count;
  history = data[0].info.history;
  enPassantTarget = data[0].info.enPassantTarget;
  historyMoves = data[0].info.historyMoves;
  lastMove = data[0].info.lastMove;
  if (((role == 1 && currentPlayer == "white") || (role == 2 && currentPlayer == "black")) && data[0].status == "PLAYING") nowMoves = getLegalMoves(boardState, currentPlayer, enPassantTarget);
  possibleMoves = [];
  state = data[0].info.state;
  renderState();
  renderBoard();
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
      statusEl.textContent = '対局終了　' + playerNames[0] + '(白) の勝利！';
      break;
    case "P2W":
      if (role === 2 && !animating) createConfetti();
      const message2 = role == 0 ? "対局終了" : role == 2 ? "勝利" : "敗北";
      if (!animating) showEndEffect(message2);
      resignBtn.style.display = 'none';
      statusEl.textContent = '対局終了　' + playerNames[1] + '(黒) の勝利！';
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
  for (let i = 1; i < 9; i++) {
    const yokoN = document.createElement('span');
    yokoN.className = 'num';
    yokoN.textContent = alphabet[isHost === false ? 8 - i : i - 1];
    yoko.appendChild(yokoN);
    const tateN = document.createElement('span');
    tateN.className = 'num';
    tateN.textContent = isHost === false ? i : 9 - i;
    tate.appendChild(tateN);
  }
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (const child of Array.from(arrowLayer.children)) {
  if (child.tagName !== "defs") arrowLayer.removeChild(child);
}  // 配列もリセット
  arrows.length = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement("div");
      sq.className = "square";
      sq.dataset.r = isHost === false ? reverse(r, "black") : r;
      sq.dataset.c = isHost === false ? reverse(c, "black") : c;
      const piece = boardState[isHost === false ? reverse(r, "black") : r][isHost === false ? reverse(c, "black") : c];
      if (piece) {
        const p = document.createElement("img");
        p.className = "piece";
        p.src = "assets/" + (piece.p == "white" ? "w" : "b") + mapping[piece.t].image + ".svg";
        p.draggable = false;
        p.dataset.player = piece.p;
        p.dataset.r = isHost === false ? reverse(r, "black") : r;
        p.dataset.c = isHost === false ? reverse(c, "black") : c;
        
        if (role == 1 && piece.p == "white") {
          sq.style.cursor = 'pointer';
        } else if (role == 2 && piece.p == "black") {
          sq.style.cursor = 'pointer';
        }
        sq.appendChild(p);
      }
      if (lastMove != null && lastMove.from.r == (isHost === false ? reverse(r, "black") : r) && lastMove.from.c == (isHost === false ? reverse(c, "black") : c)) {
          sq.classList.add('last-from');
        }
      if (
        lastMove?.to &&
        (isHost === false ? reverse(r, "black") : r) === lastMove.to.r &&
        lastMove.to.c === (isHost === false ? reverse(c, "black") : c)
      ) {
        sq.classList.add('last-to');
      }
      if ((role == 1 && currentPlayer == "white") || (role == 2 && currentPlayer == "black")) sq.addEventListener("click", onSquareClick);
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
    sq.classList.add("selected");
    possibleMoves = nowMoves.filter(e => e.from.r == r && e.from.c == c);
    possibleMoves.forEach(e => {
      document.querySelector(`.square[data-r='${e.to.r}'][data-c='${e.to.c}']`).classList.add("highlight");
    });
    return;
  }
  const move = possibleMoves.filter(e => e.to.r === r && e.to.c === c);
  if (selected && move.length != 0) {
    const from = { ...selected };
    const to = { r, c , enPassant: move[0].to.enPassant, castle: move[0].castle ?? null};
    let promoted = null;
    const piece = boardState[selected.r][selected.c];
    // promotion
    if (piece.t == 1 && to.r == reverse(0, piece.p)) {
        promoted = await askPromotionUI(piece.p);
    }

    to.promoted = promoted;
    makeMove(from, to);
    selected = null;
    clearHighlights();
  }
}
function reverse(r, p) {
    return p == "white" ? r : 7 - r;
}
function canCastle(board, player, side) {
  const row = player === "white" ? 7 : 0;
  const kingCol = 4;

  const rookCol = side === "king" ? 7 : 0;
  const passCols = side === "king" ? [5,6] : [1,2,3];
  const kingPass = side === "king" ? [4,5,6] : [4,3,2];

  const king = board[row][kingCol];
  const rook = board[row][rookCol];

  if (!king || king.t !== 6 || king.moved) return false;
  if (!rook || rook.t !== 2 || rook.moved) return false;

  // 間に駒がない
  for (const c of passCols) {
    if (board[row][c]) return false;
  }

  // 王がチェック中・通過マスが攻撃されている
  const enemy = player === "white" ? "black" : "white";
  const attacks = getAttackSquares(board, enemy);

  return !kingPass.some(c =>
    attacks.some(([r, col]) => r === row && col === c)
  );
}

function getMoveList(board, r, c, enPassant, friendFire = false) {
    const e = board[r][c];
    if (!e) return [];
    const s = players[e.p];
    const moves = mapping[e.t].move;
    const list = [];
    moves.forEach(move => {
        if (move.inf == false) {
            if (e.t == 1) {
                if (r == reverse(6, e.p)) {

                    const cell = board[reverse(5, e.p)][c];
                    if (!cell) {
                        list.push([reverse(5, e.p), c, false]);

                        const newCell = board[reverse(4, e.p)][c];
                        if (!newCell) list.push([reverse(4, e.p), c, false]);
                    }
                } else {
                    const newR = move.pos[0] * s + r;
                    const newC = move.pos[1] + c;
                    if (rangeCheck(newR, newC)) {
                        const cell = board[newR][newC];
                        if (!cell) list.push([newR, newC, false]);
                    }
                }
                const Lr = r + s * (-1);
                const Lc = c - 1;
                const Rr = r + s * (-1);
                const Rc = c + 1;
                if (rangeCheck(Lr, Lc) && board[Lr][Lc] && (board[Lr][Lc].p !== e.p || friendFire)) list.push([Lr, Lc, false]);
                if (rangeCheck(Rr, Rc) && board[Rr][Rc] && (board[Rr][Rc].p !== e.p || friendFire)) list.push([Rr, Rc, false]); 
                // === アンパッサン ===
                if (enPassant && enPassant.p !== e.p) {
                // 左側
                if (enPassant.r === r && enPassant.c === c - 1) {
                    list.push([r + s * (-1), c - 1, true]);
                }
                // 右側
                if (enPassant.r === r && enPassant.c === c + 1) {
                    list.push([r + s * (-1), c + 1, true]);
                }
                }

            } else {
                const newR = move.pos[0] * s + r;
                const newC = move.pos[1] + c;
                if (rangeCheck(newR, newC)) {
                    const cell = board[newR][newC];
                    if (!cell || cell.p !== e.p || friendFire) list.push([newR, newC, false]);
                }
            }
        } else {
            let newR = move.pos[0] * s + r;
            let newC = move.pos[1] + c;
            while (rangeCheck(newR, newC) && (!board[newR][newC] || (board[newR][newC].p !== e.p || friendFire))) {
                const cell = board[newR][newC];
                list.push([newR, newC, false]);
                if (cell) break;
                newR += move.pos[0] * s;
                newC += move.pos[1];
            }
        }
    });
    return list;
}
function getLegalMoves(board,p,enPassant) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
                
              if (piece && piece.p == p) {
                if (piece.t === 6) {
                if (canCastle(board, p, "king")) {
                    moves.push({
                    from: { r, c },
                    to: { r, c: 6 },
                    castle: "king"
                    });
                }
                if (canCastle(board, p, "queen")) {
                    moves.push({
                    from: { r, c },
                    to: { r, c: 2 },
                    castle: "queen"
                    });
                }
                }

                getMoveList(board, r, c, enPassant).forEach(([tr, tc, flag]) => {
                  if (piece.t == 1 && (tr == 0 || tr == 7)) {
                        moves.push({from: {r, c}, to: {r: tr, c: tc, promoted: true, enPassant: flag}});
                  } else {
                    moves.push({from: {r, c}, to: {r: tr, c: tc, promoted: null, enPassant: flag}});
                  }
                });
              }
        
        }
    }
    // === ★ 王が死ぬ手を除外 ===
    const safeMoves = moves.filter(move => {
        const newBoard = makeMoveSim(board, move);
        return !isKingInCheck(newBoard, p); // 自分の王が攻撃されていないなら合法
    });
    return safeMoves;
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
function clearHighlights() {
  document.querySelectorAll(".square, .cap").forEach((s) => {
    s.classList.remove("highlight");
    s.classList.remove("selected");
  });
}
function rangeCheck(...args) {
  return args.every(e => 0 <= e && e <= 7);
}
function askPromotionUI(player) {
  return new Promise(resolve => {
    const overlay = document.getElementById("promotionOverlay");
    overlay.classList.remove("hidden");

    const imgs = overlay.querySelectorAll("img");

    imgs.forEach(img => {
        const pieceType = Number(img.dataset.piece);
        img.src = "assets/" + (player == "white" ? "w" : "b") + mapping[pieceType].image + ".svg";
    
      img.onclick = () => {
        overlay.classList.add("hidden");

        resolve(pieceType);

        // 二重クリック防止
        imgs.forEach(i => (i.onclick = null));
      };
    });
  });
}


async function makeMove(from, to) {
    let moveStr = "";
    let captured = false;
    count++;
    const piece = boardState[from.r][from.c];
    if (to.castle) {
        enPassantTarget = null;
        
        const row = piece.p === "white" ? 7 : 0;

        if (to.castle === "king") {
            // 王
            boardState[row][6] = { ...piece, moved: true };
            boardState[row][4] = null;

            // ルーク
            const rook = boardState[row][7];
            boardState[row][5] = { ...rook, moved: true };
            boardState[row][7] = null;
        } else {
            boardState[row][2] = { ...piece, moved: true };
            boardState[row][4] = null;

            const rook = boardState[row][0];
            boardState[row][3] = { ...rook, moved: true };
            boardState[row][0] = null;
        }

        moveStr = to.castle === "king" ? "O-O" : "O-O-O";
    } else {
        const dest = boardState[to.r][to.c];
        if (!piece) return;
        let promoted = to.promoted;
        if (dest) {
            captured = true;
        }
        // アンパッサンによる捕獲
        if (to.enPassant) {
        // 横のポーンを消す
        boardState[to.r - (piece.p === "white" ? -1 : 1)][to.c] = null;
        captured = true;
        }
        
        enPassantTarget = null;
        if (piece.t === 1 && Math.abs(from.r - to.r) === 2) {
        enPassantTarget = {
            r: to.r,
            c: to.c,
            p: piece.p
        };
        }

        boardState[to.r][to.c] = { ...piece , moved: true};
        moveStr = `${mapping[boardState[to.r][to.c].t].name}${captured ? "x" : ""}${posToS(to)}`;
        if (promoted) boardState[to.r][to.c].t = promoted;
        boardState[from.r][from.c] = null;
    }

  
  currentPlayer = currentPlayer === "black" ? "white" : "black";
  
  lastMove = {from, to};

  

  history.push(moveStr);
  historyMoves.push({from, to, t: mapping[boardState[to.r][to.c].t].display});
  renderState();
  renderBoard();
  updateTurnUI();
  renderHistory();

  await new Promise(resolve => setTimeout(resolve, 1));

  // 詰み判定
  // --- 合法手の生成 ---
  nowMoves = getLegalMoves(boardState, currentPlayer, enPassantTarget);

  // --- 合法手がない場合（詰み or 引き分け） ---
  if (nowMoves.length === 0) {
      const checked = isKingInCheck(boardState, currentPlayer);
      if (checked) {
          if (isHost === false) {
            state = 'P2W';
        } else {
            state = 'P1W';
        }
      } else {
          // ステイルメイト（千日手など）→引き分け扱い
          state = "STALEMATE";
      }
  }
    const {error} = await supabase
        .from("rooms")
        .update({
            status: "PLAYING",
            info: {
            board: boardState,
            currentPlayer: currentPlayer,
            last: last,
            count: count,
            history: history,
            historyMoves: historyMoves,
            lastMove: lastMove,
            enPassantTarget: enPassantTarget,
            state: state
            }
        })
        .eq("id", roomId)
    if (error) {
        console.error(error);
    }
  
}

function posToS(pos) {
  const file = pos.c + 1;
  const rank = 8 - pos.r;
  last = [file, rank];
  return `${alphabet[file - 1]}${rank}`;
}

function getAttackSquares(board, player) {
    const attackSquares = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
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
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const e = board[r][c];
            if (e && e.p === player && e.t == 6) {
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

/* -------------------- 盤面コピー関数 -------------------- */
function cloneBoard(board) {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

/* -------------------- moveシミュレーション -------------------- */
function makeMoveSim(board, move) {
    const newBoard = cloneBoard(board);

    if (move.to.castle) {
        const piece = newBoard[move.from.r][move.from.c];
        const row = piece.p === "white" ? 7 : 0;

        if (move.to.castle === "king") {
            newBoard[row][6] = { ...piece, moved: true };
            newBoard[row][4] = null;
            const rook = newBoard[row][7];
            newBoard[row][5] = { ...rook, moved: true };
            newBoard[row][7] = null;
        } else {
            newBoard[row][2] = { ...piece, moved: true };
            newBoard[row][4] = null;
            const rook = newBoard[row][0];
            newBoard[row][3] = { ...rook, moved: true };
            newBoard[row][0] = null;
        }
        return newBoard;
    } else {
        const dest = newBoard[move.to.r][move.to.c];
        const piece = newBoard[move.from.r][move.from.c];
        newBoard[move.to.r][move.to.c] = { ...piece, moved: true };
        if (Number.isInteger(move.to.promoted)) newBoard[move.to.r][move.to.c].t = move.to.promoted;
        if (dest) {
        }
        
        if (move.to.enPassant) {
        // 横のポーンを消す
        newBoard[move.to.r - (piece.p === "white" ? -1 : 1)][move.to.c] = null;
        }
        newBoard[move.from.r][move.from.c] = null;
    
        return newBoard;
    }
}

function updateTurnUI() {
  turnEl.textContent = currentPlayer === "black" ? "後手 (△)" : "先手 (▲)";
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
        history = row.info.history ?? history;
        historyMoves = row.info.historyMoves ?? historyMoves;
        state = row.info.state ?? state;
        enPassantTarget = row.info.enPassantTarget ?? enPassantTarget;

        // nowMoves を再計算（自分の手番なら）
        if ((role == 1 && currentPlayer == "white") || (role == 2 && currentPlayer == "black")) {
          nowMoves = getLegalMoves(boardState, currentPlayer, enPassantTarget);
        } else {
          nowMoves = [];
        }

        // UI 更新（安全なレンダリング）
        renderState()
        renderBoard();
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

anaBtn.addEventListener('click', () => {
    anaBtn.classList.toggle('on');
    analysis = !analysis;
      selected = null;
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
  const boardY = e.clientY - boardEl.offsetTop - 50;

  const squareSize = boardEl.clientWidth / 8; // ボーダー除外のサイズ
  function check (n) {
    if (n > 7) return 7;
    if (n < 0) return 0;
    return n;
  }
  const c = check(Math.floor(boardX / squareSize));
  const r = check(Math.floor(boardY / squareSize));
  return {
    r: r + 1,
    c: c + 1,
    centerX: (c) * squareSize + squareSize / 2 + 54,
    centerY: (r) * squareSize + squareSize / 2 + 24
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
    currentCircle.setAttribute("r", 33.75);
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


function boardToFEN() {
  const pieceMap = {
    1: "p",
    2: "r",
    3: "n",
    4: "b",
    5: "q",
    6: "k"
  };

  return boardState.map(rank => {
    let fenRank = "";
    let empty = 0;

    for (const cell of rank) {
      if (cell === null) {
        empty++;
      } else {
        if (empty > 0) {
          fenRank += empty;
          empty = 0;
        }

        let piece = pieceMap[cell.t];
        if (cell.p === "white") {
          piece = piece.toUpperCase();
        }
        fenRank += piece;
      }
    }

    if (empty > 0) {
      fenRank += empty;
    }

    return fenRank;
  }).join("/");
}

window.boardToFEN = boardToFEN