'use strict'
const SUPABASE_URL = "https://fveqlysrpudyomvskryk.supabase.co"; // ← ここ書き換える
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZXFseXNycHVkeW9tdnNrcnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjA5NjcsImV4cCI6MjA3Nzg5Njk2N30.zfmndX_YMeaq0eDgxG9ecjBpJS5KRDkmBaBFO7Iz9Yk";

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
        .insert([{ board_state: initialBoard }])
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