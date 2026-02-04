const SUPABASE_URL = "https://fveqlysrpudyomvskryk.supabase.co"; // ← ここ書き換える
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZXFseXNycHVkeW9tdnNrcnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjA5NjcsImV4cCI6MjA3Nzg5Njk2N30.zfmndX_YMeaq0eDgxG9ecjBpJS5KRDkmBaBFO7Iz9Yk";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const chessInitialSetup = [
[ {t:2,p:'black',moved:false},{t:3,p:'black',moved:false},{t:4,p:'black',moved:false},{t:5,p:'black',moved:false},{t:6,p:'black',moved:false},{t:4,p:'black',moved:false},{t:3,p:'black',moved:false},{t:2,p:'black',moved:false} ],
[ {t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false},{t:1,p:'black',moved:false} ],
[ null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null ],
[ null,null,null,null,null,null,null,null ],
[ {t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false},{t:1,p:'white',moved:false} ],
[ {t:2,p:'white',moved:false},{t:3,p:'white',moved:false},{t:4,p:'white',moved:false},{t:5,p:'white',moved:false},{t:6,p:'white',moved:false},{t:4,p:'white',moved:false},{t:3,p:'white',moved:false},{t:2,p:'white',moved:false} ]
];

const gamesEl = document.getElementById('games');
const toggle = document.getElementById('toggle')

let playerName = localStorage.getItem('shogi-name');
if (!playerName) {
    playerName = prompt("名前を入力してください：");
    while (!playerName) {
        playerName = prompt("名前を入力してください：");
    }
    localStorage.setItem('shogi-name', playerName);
}
if (!localStorage.getItem('shogi-uid')) {
  localStorage.setItem('shogi-uid', crypto.randomUUID());
}
const myUid = localStorage.getItem('shogi-uid');
async function tryJoinRoom(roomId) {
  // ① 部屋情報取得
  const { data: room, error } = await supabase
    .from("rooms")
    .select("player1_uid, player2_uid, game_type")
    .eq("id", roomId)
    .single();

  if (error || !room) {
    alert("部屋が存在しません");
    return;
  }

  // ② 遷移先を決定
  const targetPage =
    room.game_type === "chess" ? "chess.html" : "game.html";

  // ③ 再接続
  if (room.player1_uid === myUid || room.player2_uid === myUid) {
    window.location.href = `./${targetPage}?room=${roomId}`;
    return;
  }

  // ④ 入室試行（RPC）
  const { data, error: joinError } = await supabase.rpc("join_room", {
    room_id: Number(roomId),
    uid: myUid,
    name: playerName
  });

  if (joinError) {
    alert("入室に失敗しました");
    return;
  }

  if (!data) {
    alert("この部屋はすでに満員です");
    return;
  }

  // ⑤ 成功
  window.location.href = `./${targetPage}?room=${roomId}`;
}

async function loadRooms() {
    const { data: roomData, error } = await supabase.from("rooms").select("*");
    if (error) {
        console.error("Error fetching rooms:", error);
        return;
    }
    const now = new Date();
    roomData.forEach(room => {
        if (room.player1_heartbeat && (now - new Date(room.player1_heartbeat) < 10000) && 
            (!room.player2_uid || room.player2_heartbeat && (now - new Date(room.player2_heartbeat) < 10000))) {
            const gameDiv = document.createElement('div');
            gameDiv.className = 'game';
            gameDiv.addEventListener('click', async () => {
            await tryJoinRoom(room.id);
            });


            const p1Span = document.createElement('span');
            p1Span.className = 'p1';
            p1Span.textContent = room.player1_name;
            const vsSpan = document.createElement('span');
            vsSpan.textContent = 'vs';
            const p2Span = document.createElement('span');
            p2Span.className = 'p2';
            p2Span.textContent = room.player2_name ? room.player2_name : "";
            gameDiv.appendChild(p1Span);
            gameDiv.appendChild(vsSpan);
            gameDiv.appendChild(p2Span);
            gamesEl.appendChild(gameDiv);
        }
    });

}
loadRooms();
const channel = supabase
  .channel('rooms-insert-only') // チャンネル名は任意
  .on(
    'postgres_changes',
    {
      event: 'INSERT',     // ← これ！INSERT のみ
      schema: 'public',    // 通常は public
      table: 'rooms'       // 対象テーブル
    },
    payload => {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game';
        gameDiv.addEventListener('click', async () => {
        await tryJoinRoom(payload.new.id);
        });
        const p1Span = document.createElement('span');
        p1Span.className = 'p1';
        p1Span.textContent = payload.new.player1_name;
        const vsSpan = document.createElement('span');
        vsSpan.textContent = 'vs';
        const p2Span = document.createElement('span');
        p2Span.className = 'p2';
        p2Span.textContent = payload.new.player2_name ? payload.new.player2_name : "募集中";
        gameDiv.appendChild(p1Span);
        gameDiv.appendChild(vsSpan);
        gameDiv.appendChild(p2Span);
        gamesEl.appendChild(gameDiv);
    }
  )
  .subscribe();

  document.getElementById('createRoom').addEventListener('click', async () => {
  const gameType = getSelectedGameType();

  const info =
    gameType === "shogi"
      ? {
          board: initialSetup,
          komadai: { white: {}, black: {} },
          count: 0,
          currentPlayer: "black",
          history: [],
          historyMoves: [],
          lastMove: null
        }
      : {
          board: chessInitialSetup,
          currentPlayer: "white",
          count: 0,
          historyMoves: [],
          history: [],
          lastMove: null,
          enPassantTarget: null
        };

  const { data, error } = await supabase
    .from("rooms")
    .insert([{
      game_type: gameType,
      info,
      player1_name: playerName,
      player1_uid: myUid,
      player1_heartbeat: new Date().toISOString(),
      status: "WAITING"
    }])
    .select("id")
    .single();

  if (error) {
    alert("部屋を作れませんでした");
    return;
  }
const targetPage = gameType === "chess" ? "chess.html" : "game.html";

window.location.href = `./${targetPage}?room=${data.id}`;
});

async function joinRoom(roomId) {
      await tryJoinRoom(roomId);
}
function getSelectedGameType() {
  return toggle.checked ? "chess" : "shogi";
}

document.getElementById('shogi').addEventListener('click', () => {
    if (toggle.checked) {
        toggle.checked = false;
    }
});
document.getElementById('chess').addEventListener('click', () => {
    if (!toggle.checked) {
        toggle.checked = true;
    }
});