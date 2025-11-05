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

const gamesEl = document.getElementById('games');

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
                if (room.player1_uid === myUid || room.player2_uid === myUid) {
                    alert('あなたはこの試合に参加しています。');
                    return;
                }
                if (room.player2_uid === null) {
                    
                    const { data, error } = await supabase
                        .from("rooms")
                        .update({
                        player2_name: playerName,
                        player2_uid: myUid,
                        player2_heartbeat: new Date().toISOString(),
                        status: "PLAYING"
                        })
                        .eq('id', room.id);

                    if (error) {
                        console.error("部屋入室エラー:", error);
                        alert("部屋に入れませんでした");
                        return;
                    }

                    window.location.href = `./game.html?room=${room.id}`;

                } else {
                    window.location.href = `./game.html?room=${room.id}`;

                }
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
            if (payload.new.player2_uid === null) {
                    
                const { data, error } = await supabase
                    .from("rooms")
                    .update({
                    player2_name: playerName,
                    player2_uid: myUid,
                    player2_heartbeat: new Date().toISOString(),
                    status: "PLAYING"
                    })
                    .eq('id', payload.new.id);

                if (error) {
                    console.error("部屋入室エラー:", error);
                    alert("部屋に入れませんでした");
                    return;
                }

                window.location.href = `./game.html?room=${payload.new.id}`;

            }
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
    const { data, error } = await supabase
        .from("rooms")
        .insert([{
        info: {
            board: initialSetup,
            komadai: { white: {}, black: {} },
            count: 0,
            currentPlayer : "white",
            history: [],
            lastMove: null
        },
        player1_name: playerName,
        player1_uid: myUid,
        player1_heartbeat: new Date().toISOString(),
        status: "WAITING"
        }])
        .select("id")
        .single();

    if (error) {
        console.error("部屋作成エラー:", error);
        alert("部屋を作れませんでした");
        return;
    }

    const roomId = data.id;

    // 作成した部屋に遷移
    window.location.href = `./game.html?room=${roomId}`;
    
});

async function joinRoom(roomId) {
  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (!room) {
    alert("部屋が存在しません");
    return;
  }

  const myUid = localStorage.getItem("shogi-uid");

  // ✅ 自分がすでに先手または後手として登録されている場合 → 再接続扱い
  if (room.player1_uid === myUid || room.player2_uid === myUid) {
    alert("再接続しました");
    window.location.href = `./game.html?room=${roomId}`;
    return;
  }

  // ✅ player2 が空いていれば入室
  if (!room.player2_uid) {
    await supabase
      .from("rooms")
      .update({
        player2_name: localStorage.getItem("shogi-name"),
        player2_uid: myUid,
        player2_heartbeat: new Date().toISOString(),
        status: "PLAYING"
      })
      .eq("id", roomId)
      .is("player2_uid", null); // 不正上書き防止
    window.location.href = `./game.html?room=${roomId}`;
    return;
  }

  // ❌ player1, player2 がどちらも埋まっていて、自分でもない
  alert("この部屋は満員です");
}