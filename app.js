// ----------------------
// 画面取得
// ----------------------

const screens = {
  emotion: document.getElementById("screen-emotion"),
  structure: document.getElementById("screen-structure"),
  intervention: document.getElementById("screen-intervention"),
  history: document.getElementById("screen-history")
};

const interventionText = document.getElementById("intervention-text");
const questionText = document.getElementById("question");
const closeBtn = document.getElementById("closeBtn");

const historyBtn = document.getElementById("historyBtn");
const backBtn = document.getElementById("backBtn");
const historyList = document.getElementById("historyList");

let state = {
  emotion: null,
  structure: null
};

// ----------------------
// 介入データ（30パターン）
// ----------------------

const INTERVENTIONS = {

  anger: {
    eval: ["いまは一度、間を取ってみてください。", "どう見られるかはあなたの領域ではありません。"],
    expect: ["期待を少し緩めてみてください。", "思い通りは保証されません。"],
    compare: ["比較から離れてみてください。", "他人の基準はあなたの基準ではありません。"],
    control: ["影響できる範囲に戻ってみてください。", "全体を動かすことはできません。"],
    uncertain: ["事実だけを確認してみてください。", "想像は怒りを増幅します。"]
  },

  anxiety: {
    eval: ["評価から距離を取ってみてください。", "他人の考えは確定していません。"],
    expect: ["期待を一度緩めてみてください。", "未来は計画通りには進みません。"],
    compare: ["他者の状況を横に置いてみてください。", "比較は不安を広げます。"],
    control: ["影響できる部分だけ見てみてください。", "すべてを管理することはできません。"],
    uncertain: ["いま確定している事実を見てみてください。", "未来はまだ決まっていません。"]
  },

  haste: {
    eval: ["他人の評価を外してみてください。", "急ぐ理由はそこにありません。"],
    expect: ["結果へのこだわりを緩めてみてください。", "速度は保証されません。"],
    compare: ["他人のペースを見ないでみてください。", "基準は一つではありません。"],
    control: ["一つの行動だけに絞ってみてください。", "全体を同時に動かせません。"],
    uncertain: ["不足している情報を一つ探してみてください。", "不明点が焦りを作ります。"]
  },

  sadness: {
    eval: ["他人の評価を手放してみてください。", "感じ方はあなたのものです。"],
    expect: ["理想像を少し緩めてみてください。", "現実は一致しません。"],
    compare: ["他人との比較を止めてみてください。", "基準は人それぞれです。"],
    control: ["変えられない部分を受け入れてみてください。", "すべては動かせません。"],
    uncertain: ["いま確かなものを探してみてください。", "未来はまだ開いています。"]
  },

  confusion: {
    eval: ["他人の視線を外してみてください。", "考えは整理できます。"],
    expect: ["前提を一つ疑ってみてください。", "思い込みが絡まっています。"],
    compare: ["他者の状況を切り離してみてください。", "情報が混ざっています。"],
    control: ["影響できる範囲を書き出してみてください。", "全体は把握できません。"],
    uncertain: ["確定している情報だけ見てみてください。", "推測が増えています。"]
  },

  disgust: {
    eval: ["評価を止めてみてください。", "相手の内面は見えません。"],
    expect: ["理想像を外してみてください。", "現実は一致しません。"],
    compare: ["基準を一度下ろしてみてください。", "優劣は固定ではありません。"],
    control: ["距離を取ってみてください。", "相手は変えられません。"],
    uncertain: ["事実と解釈を分けてみてください。", "想像が反応を強めます。"]
  }

};

// ----------------------
// 画面切替
// ----------------------

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.remove("active");
  });
  screens[name].classList.add("active");
}

// ----------------------
// 感情選択
// ----------------------

document.querySelectorAll("[data-emotion]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.emotion = btn.dataset.emotion;
    showScreen("structure");
  });
});

// ----------------------
// 構造選択
// ----------------------

document.querySelectorAll("[data-structure]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.structure = btn.dataset.structure;
    showIntervention();
  });
});

// ----------------------
// 介入表示
// ----------------------

function showIntervention() {
  showScreen("intervention");

  const lines = INTERVENTIONS[state.emotion]?.[state.structure] 
    || ["いまは一度、止まってみてください。", "感情は事実ではありません。"];

  interventionText.innerHTML = lines.join("<br>");

  saveHistory();

  typeQuestion("整いましたか？");
}

function typeQuestion(text) {
  questionText.innerHTML = "";
  let i = 0;
  const interval = setInterval(() => {
    questionText.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 90);
}

// ----------------------
// 履歴保存
// ----------------------

function saveHistory() {
  const history = JSON.parse(localStorage.getItem("pauseHistory") || "[]");

  history.unshift({
    timestamp: new Date().toISOString(),
    emotion: state.emotion,
    structure: state.structure
  });

  localStorage.setItem("pauseHistory", JSON.stringify(history.slice(0, 30)));
}

// ----------------------
// 履歴画面
// ----------------------

historyBtn.addEventListener("click", () => {
  renderHistory();
  showScreen("history");
});

backBtn.addEventListener("click", () => {
  showScreen("emotion");
});

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("pauseHistory") || "[]");

  if (history.length === 0) {
    historyList.innerHTML = "<p>履歴はまだありません。</p>";
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div style="margin:10px 0; padding:10px; border:1px solid #ffffff; border-radius:10px;">
      ${translateEmotion(item.emotion)} → ${translateStructure(item.structure)}
    </div>
  `).join("");
}

function translateEmotion(key) {
  const map = {
    anger: "怒り",
    anxiety: "不安",
    haste: "焦り",
    sadness: "悲しみ",
    confusion: "混乱",
    disgust: "嫌悪"
  };
  return map[key] || key;
}

function translateStructure(key) {
  const map = {
    eval: "どう見られるか",
    expect: "思い通りかどうか",
    compare: "他の人と比べて",
    control: "自分で動かせるか",
    uncertain: "先がわからない"
  };
  return map[key] || key;
}

// ----------------------
// 閉じる
// ----------------------

closeBtn.addEventListener("click", () => {
  showScreen("emotion");
});
