const screens = {
  emotion: document.getElementById("screen-emotion"),
  structure: document.getElementById("screen-structure"),
  intervention: document.getElementById("screen-intervention")
};

const interventionText = document.getElementById("intervention-text");
const questionText = document.getElementById("question");
const closeBtn = document.getElementById("closeBtn");

let state = {
  emotion: null,
  structure: null
};

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
  }
};

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

document.querySelectorAll("[data-emotion]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.emotion = btn.dataset.emotion;
    showScreen("structure");
  });
});

document.querySelectorAll("[data-structure]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.structure = btn.dataset.structure;
    showIntervention();
  });
});

function showIntervention() {
  showScreen("intervention");

  const lines = INTERVENTIONS[state.emotion]?.[state.structure] || ["いまは一度、止まってみてください。", "感情は事実ではありません。"];
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

function saveHistory() {
  const history = JSON.parse(localStorage.getItem("pauseHistory") || "[]");
  history.unshift({
    timestamp: new Date().toISOString(),
    emotion: state.emotion,
    structure: state.structure
  });
  localStorage.setItem("pauseHistory", JSON.stringify(history.slice(0, 30)));
}

closeBtn.addEventListener("click", () => {
  showScreen("emotion");
});
