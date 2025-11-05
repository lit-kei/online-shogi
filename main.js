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

let playerName = localStorage.getItem('shogi-name');
if (!playerName) {
    playerName = prompt("名前を入力してください：");
    while (!playerName) {
        playerName = prompt("名前を入力してください：");
    }
    localStorage.setItem('shogi-name', playerName);
}

document.getElementById('createRoom').addEventListener('click', async () => {
    const { data, error } = await supabase
        .from("rooms")
        .insert([{ boardState: initialSetup, nowPlayer: true }])
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

