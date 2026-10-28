const mazeElement = document.querySelector('#maze');
const lesson = document.querySelector('.lesson');
const chapterMapItems = [...document.querySelectorAll('.chapter-map [data-chapter]')];
const chapterMapButtons = [...document.querySelectorAll('[data-chapter-target]')];
const introStage = document.querySelector('#intro-stage');
const introStartButton = document.querySelector('#intro-start');
const summaryStage = document.querySelector('#summary-stage');
const summaryRestartButton = document.querySelector('#summary-restart');
const summaryScore = document.querySelector('#summary-score');
const summaryTasks = [...document.querySelectorAll('[data-summary-task]')];
const summaryChoiceButtons = [...document.querySelectorAll('[data-summary-choice]')];
const startDemoButton = document.querySelector('#start-demo');
const demoPlaybackControls = document.querySelector('#demo-playback-controls');
const demoPauseButton = document.querySelector('#demo-pause');
const playbackStepButton = document.querySelector('#playback-step');
const playbackReplayButton = document.querySelector('#playback-replay');
const demoSpeedButtons = [...document.querySelectorAll('[data-demo-speed]')];
const startPracticeButton = document.querySelector('#start-practice');
const startTreeButton = document.querySelector('#start-tree');
const replayTreeButton = document.querySelector('#replay-tree');
const nextStepButton = document.querySelector('#next-step');
const restartButton = document.querySelector('#restart');
const narrationText = document.querySelector('#narration-text');
const narrationLabel = document.querySelector('#narration-label');
const journeyFill = document.querySelector('#journey-fill');
const stepNumber = document.querySelector('#step-number');
const phaseLabel = document.querySelector('#phase-label');
const progressLabel = document.querySelector('#progress-label');
const stageKicker = document.querySelector('#stage-kicker');
const lessonTitle = document.querySelector('#lesson-title');
const stageDescription = document.querySelector('#stage-description');
const searchOrderCard = document.querySelector('#search-order-card');
const demoRuleCardHtml = searchOrderCard.innerHTML;
const thinkingPrompt = document.querySelector('#thinking-prompt');
const thinkingText = document.querySelector('#thinking-text');
const thinkingToggle = document.querySelector('#thinking-toggle');
const thinkingAnswer = document.querySelector('#thinking-answer');
const thinkingAnswerText = document.querySelector('#thinking-answer-text');
const algorithmSwitch = document.querySelector('#algorithm-switch');
const algorithmButtons = [...document.querySelectorAll('[data-algorithm]')];
const chapterNumber = document.querySelector('#chapter-number');
const chapterLabel = document.querySelector('#chapter-label');
const stage = document.querySelector('.stage');
const legend = document.querySelector('.legend');
const treeShell = document.querySelector('#tree-shell');
let treeSvg = document.querySelector('#exploration-tree');
const treeMatchNote = document.querySelector('#tree-match-note');
const treeTitle = document.querySelector('#tree-title');
const treeKeyOption = document.querySelector('#tree-key-option');
const treeKeyVisited = document.querySelector('#tree-key-visited');
const treeKeySolution = document.querySelector('#tree-key-solution');
const viewSwitch = document.querySelector('#view-switch');
const viewButtons = [...document.querySelectorAll('[data-view]')];
const challengeStage = document.querySelector('#challenge-stage');
const challengeMaze = document.querySelector('#challenge-maze');
const challengeChoices = document.querySelector('#challenge-choices');
const challengeAlgorithmButtons = [...document.querySelectorAll('[data-challenge-algorithm]')];
const challengeStartButton = document.querySelector('#challenge-start');
const challengeGuide = document.querySelector('#challenge-guide');
const challengeResults = document.querySelector('#challenge-results');
const challengeResultTitle = document.querySelector('#challenge-result-title');
const resultMetrics = document.querySelector('#result-metrics');
const challengeFeedback = document.querySelector('#challenge-feedback');
const challengeCompareButton = document.querySelector('#challenge-compare');
const challengeContinueButton = document.querySelector('#challenge-continue');
const missionNumber = document.querySelector('#mission-number');
const missionTitle = document.querySelector('#mission-title');
const missionCopy = document.querySelector('#mission-copy');
const missionRule = document.querySelector('#mission-rule');

const demoOpenCells = new Set([
  '0-0', '0-1', '0-2',
  '1-0', '1-5',
  '2-0', '2-1', '2-3', '2-5',
  '3-0', '3-3', '3-4', '3-5',
  '4-0', '4-1', '4-2', '4-3', '4-5',
  '5-0', '5-2', '5-5'
]);

const practiceOpenCells = new Set([
  '0-0', '0-1', '0-2', '0-3', '0-4', '0-5',
  '1-1', '1-3', '1-4',
  '2-0', '2-1', '2-2', '2-3', '2-5',
  '3-1', '3-3', '3-5',
  '4-0', '4-1', '4-3', '4-4', '4-5',
  '5-2', '5-3', '5-5'
]);

// These cells branch in the maze logic. They are intentionally not marked in the UI.
const demoBranchCells = new Set(['2-0', '4-0', '4-2', '3-3', '3-5']);
const practiceBranchCells = new Set(['0-1', '2-1', '2-3', '4-3', '4-5']);
const MAIN_START = [0, 0];
const MAIN_GOAL = [5, 5];
const MAIN_START_KEY = key(...MAIN_START);
const MAIN_GOAL_KEY = key(...MAIN_GOAL);
const CAT_LOOK_DURATION = 1250;

// 演示始终按同一方向优先级检查相邻格子，确保学生能复现每一步。
const DFS_DEMO_DIRECTION_ORDER = [
  { offset: [0, 1], label: '右' },
  { offset: [-1, 0], label: '上' },
  { offset: [0, -1], label: '左' },
  { offset: [1, 0], label: '下' }
];
const DFS_DEMO_ORDER_TEXT = DFS_DEMO_DIRECTION_ORDER.map(directionItem => directionItem.label).join(' → ');

function createDfsJourney(mazeOpenCells) {
  const start = [...MAIN_START];
  const visited = new Set([key(...start)]);
  const events = [{ at: start, kind: 'start' }];

  function explore(position) {
    const currentKey = key(...position);
    if (currentKey === MAIN_GOAL_KEY) return true;

    let triedNewPath = false;
    for (const { offset } of DFS_DEMO_DIRECTION_ORDER) {
      const next = [position[0] + offset[0], position[1] + offset[1]];
      const nextKey = key(...next);
      if (!mazeOpenCells.has(nextKey) || visited.has(nextKey)) continue;

      triedNewPath = true;
      visited.add(nextKey);
      events.push({ at: next, kind: nextKey === MAIN_GOAL_KEY ? 'found' : 'forward' });
      if (explore(next)) return true;
      events.push({ at: position, kind: 'back' });
    }

    // 没有任何未访问出口时，当前试探点就是本轮的“碰壁”。
    if (!triedNewPath && events.length > 1) events.at(-1).kind = 'dead';
    return false;
  }

  explore(start);
  return events;
}

const journey = createDfsJourney(demoOpenCells);
const practiceFixtureJourney = createDfsJourney(practiceOpenCells);

const solutionPath = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2],
  [4, 3], [3, 3], [3, 4], [3, 5], [4, 5], [5, 5]
];

const practiceSolutionPath = [
  [0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [2, 3],
  [3, 3], [4, 3], [4, 4], [4, 5], [5, 5]
];

let runId = 0;
let previousPosition = [...MAIN_START];
let mode = 'ready';
let practiceIndex = 0;
let practiceBusy = false;
let practiceExplored = new Set();
let practicePath = [];
let explorationMoves = [];
let explorationParents = new Map();
let explorationOrder = [];
let practiceStarted = false;
let dfsReplayRecord = null;
let renderedTreeTopology = { parents: new Map(), order: [] };
let treePositionNumbers = new Map();
let treeMatchedKey = null;
let treeReplayId = 0;
let treeReplayIndex = 0;
let treeStepBusy = false;
let treeAutoPlaying = false;
let treeAlgorithm = 'dfs';
let bfsReplayIndex = 0;
let bfsOrder = [];
let bfsParents = new Map();
let motionEpoch = 0;
let stepTimeline;
let settleMotion;
let reactionTimeline;
let idleTimeline;
let reunionTimeline;
let messageTimer;
const cells = new Map();
const challengeCells = new Map();
let challengeAlgorithm = null;
let challengeBusy = false;
let challengeRunId = 0;
let challengeResultsByAlgorithm = {};
let challengePreviousPosition = [5, 0];
let challengeCatIdleTimeline;
let challengeCatMotionTimeline;
let challengeCatReactionTimeline;
let settleChallengeMotion = null;
const practiceFeedbackTimers = new Set();
let demoPaused = false;
let demoSpeed = 1;
let playbackContext = 'none';
let treeReplayRunToken = 0;
let lastRoutedHash = '';
const CHAPTER_PROGRESS_STORAGE_KEY = 'cat-maze-completed-chapters-v1';
const completedChapters = new Set(loadCompletedChapters());
const demoPauseWaiters = new Set();

function loadCompletedChapters() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CHAPTER_PROGRESS_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(chapter => Number.isInteger(chapter) && chapter >= 0 && chapter <= 5) : [];
  } catch {
    return [];
  }
}

function saveCompletedChapters() {
  try {
    window.localStorage.setItem(CHAPTER_PROGRESS_STORAGE_KEY, JSON.stringify([...completedChapters].sort((a, b) => a - b)));
  } catch {
    // The lesson still works when storage is unavailable; progress then lasts for this page only.
  }
}

const challengeOpenCells = new Set([
  '5-0', '5-1', '5-2', '5-3',
  '4-1', '4-3', '4-4', '4-5',
  '3-1', '3-2', '3-3', '3-5',
  '2-0', '2-1', '2-3', '2-4', '2-5',
  '1-0', '1-3', '1-5',
  '0-0', '0-1', '0-2', '0-3', '0-4', '0-5'
]);

const cat = document.createElement('span');
cat.className = 'cat-sprite';
cat.setAttribute('role', 'img');
cat.setAttribute('aria-label', '低多边形小猫');
cat.innerHTML = '<span class="cat-pose" aria-hidden="true"><span class="cat-frame"></span></span>';
const catPose = cat.querySelector('.cat-pose');
const catFrame = cat.querySelector('.cat-frame');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function pinDesktopViewport() {
  if (!document.body.classList.contains('answer-open') && window.matchMedia('(min-width: 761px)').matches && (window.scrollX || window.scrollY)) {
    window.scrollTo(0, 0);
  }
}

function setCatFrame(index = 0) {
  const column = index % 4;
  const row = Math.floor(index / 4);
  catFrame.style.backgroundPosition = `${(column / 3) * 100}% ${row * 100}%`;
}

function resetMotion() {
  motionEpoch += 1;
  practiceFeedbackTimers.forEach(timer => clearTimeout(timer));
  practiceFeedbackTimers.clear();
  practiceBusy = false;
  treeStepBusy = false;
  challengeBusy = false;
  document.querySelectorAll('.bfs-pulse').forEach(pulse => pulse.remove());
  stopChallengeCatMotion();
  demoPaused = false;
  demoPauseWaiters.forEach(resolve => resolve());
  demoPauseWaiters.clear();
  stepTimeline?.kill();
  reactionTimeline?.kill();
  idleTimeline?.kill();
  reunionTimeline?.kill();
  settleMotion?.(false);
  settleMotion = null;
  clearTimeout(messageTimer);
  cells.forEach(cell => cell.classList.remove('is-reunion'));
  narrationText.style.opacity = '1';
  if (window.gsap) gsap.set([cat, catPose], { clearProps: 'transform' });
  setCatFrame(0);
  cat.dataset.action = 'idle';
}

function startCatIdle() {
  idleTimeline?.kill();
  if (!window.gsap || reducedMotion() || document.hidden || !cat.isConnected) return;
  cat.dataset.action = 'idle';
  setCatFrame(0);
  gsap.set(catPose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
  idleTimeline = gsap.timeline({ repeat: -1, repeatDelay: .18 })
    .to(catPose, { y: -2, rotation: .8, scaleX: 1.015, scaleY: .985, duration: .9, ease: 'sine.inOut' })
    .to(catPose, { y: 0, rotation: -.5, scaleX: 1, scaleY: 1, duration: .9, ease: 'sine.inOut' })
    .call(() => setCatFrame(1), [], 1.48)
    .call(() => setCatFrame(0), [], 1.68)
    .to(catPose, { rotation: 0, duration: .28, ease: 'sine.out' });
}

function reactCat(action) {
  cat.dataset.action = action;
  if (!window.gsap || reducedMotion()) {
    if (action === 'found') playCatFishGreeting();
    return;
  }
  idleTimeline?.kill();
  reactionTimeline?.kill();
  gsap.set(catPose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
  reactionTimeline = gsap.timeline({
    onComplete: () => {
      if (action === 'found') playCatFishGreeting();
      else startCatIdle();
    }
  });
  if (mode === 'demo' || mode === 'tree') reactionTimeline.timeScale(demoSpeed);
  if (action === 'found') {
    setCatFrame(7);
    reactionTimeline.to(catPose, { y: 3, scaleY: .82, scaleX: 1.1, duration: .13, ease: 'power2.in' })
      .to(catPose, { y: -17, rotation: -5, scaleY: 1.08, scaleX: .94, duration: .24, ease: 'power3.out' })
      .to(catPose, { y: 0, rotation: 3, scaleX: 1.04, scaleY: .92, duration: .24, ease: 'power2.in' })
      .to(catPose, { y: -9, rotation: 5, scaleX: .98, scaleY: 1.03, duration: .18, ease: 'power2.out' })
      .to(catPose, { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .3, ease: 'bounce.out' });
  } else if (action === 'look') {
    setCatFrame(4);
    reactionTimeline.to(catPose, { x: -3, rotation: -7, duration: .35, ease: 'power2.out' })
      .call(() => setCatFrame(5))
      .to(catPose, { x: 3, rotation: 7, duration: .55, ease: 'sine.inOut' })
      .call(() => setCatFrame(0))
      .to(catPose, { x: 0, rotation: 0, duration: .35, ease: 'power2.out' });
  } else {
    setCatFrame(6);
    reactionTimeline.to(catPose, { x: -7, y: 3, rotation: -8, scaleX: .94, scaleY: .9, duration: .16, ease: 'power2.out' })
      .to(catPose, { x: 3, rotation: 7, duration: .13 })
      .to(catPose, { x: -3, rotation: -6, duration: .13 })
      .to(catPose, { x: 2, rotation: 4, duration: .12 })
      .to(catPose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .22, ease: 'back.out(2)' });
  }
}

function playCatFishGreeting() {
  const goalCell = cat.closest('.cell');
  const fish = goalCell?.querySelector('.fish-sprite');
  if (!goalCell || !fish) return;
  reunionTimeline?.kill();
  goalCell.classList.add('is-reunion');
  cat.dataset.action = 'reunion';
  setCatFrame(5);

  if (!window.gsap || reducedMotion()) return;
  gsap.set(catPose, { x: -8, y: 3, rotation: -2, scaleX: .94, scaleY: .94 });
  gsap.set(fish, { x: 8, y: 7, rotation: 8, scale: .72, opacity: 1, transformOrigin: '50% 50%' });
  reunionTimeline = gsap.timeline({
    onComplete: () => {
      cat.dataset.action = 'friends';
      setCatFrame(5);
    }
  })
    .to(fish, { x: -5, y: -8, rotation: -12, scale: .95, duration: .34, ease: 'back.out(2)' }, 0)
    .to(fish, { x: -8, y: 0, rotation: 7, duration: .25, ease: 'bounce.out' }, .34)
    .call(() => setCatFrame(3), [], .62)
    .to(catPose, { x: -2, y: 1, rotation: 4, scaleX: .96, scaleY: .96, duration: .2, ease: 'power2.out' }, .62)
    .to(fish, { x: 1, y: -5, rotation: -8, duration: .2, ease: 'power2.out' }, .62)
    .call(() => setCatFrame(1), [], .9)
    .to(fish, { x: -5, y: -2, rotation: 4, duration: .25, ease: 'sine.inOut' }, .88)
    .call(() => setCatFrame(5), [], 1.12)
    .to(catPose, { x: -7, y: 3, rotation: 0, scaleX: .94, scaleY: .94, duration: .25, ease: 'power2.out' }, 1.1)
    .to(fish, { x: -2, y: 0, rotation: 0, scale: 1, duration: .38, ease: 'elastic.out(1, .5)' }, 1.08);
  if (mode === 'demo' || mode === 'tree') reunionTimeline.timeScale(demoSpeed);
}

function key(row, column) { return `${row}-${column}`; }
function usesPracticeMaze() {
  return ['practice', 'complete', 'tree', 'tree-complete'].includes(mode);
}
function activeOpenCells() {
  return usesPracticeMaze() ? practiceOpenCells : demoOpenCells;
}
function activeBranchCells() {
  return usesPracticeMaze() ? practiceBranchCells : demoBranchCells;
}
function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function playbackWait(ms, tokenCheck = () => true) {
  let remaining = ms;
  while (remaining > 0 && tokenCheck()) {
    if (!await waitForDemoResume(runId)) return false;
    const slice = Math.min(50, remaining / demoSpeed);
    const startedAt = performance.now();
    await wait(slice);
    if (!demoPaused) remaining -= (performance.now() - startedAt) * demoSpeed;
  }
  return tokenCheck();
}

function pathToMainGoal(parents, mazeOpenCells = practiceOpenCells) {
  // Only accept a real, acyclic parent chain connected to this maze's start.
  const path = [];
  const seen = new Set();
  let current = MAIN_GOAL_KEY;
  while (current && !seen.has(current)) {
    seen.add(current);
    const position = current.split('-').map(Number);
    if (!mazeOpenCells.has(current)) return [];
    if (path.length && !isAdjacent(position, path[0])) return [];
    path.unshift(position);
    if (current === MAIN_START_KEY) return path;
    current = parents.get(current);
  }
  return [];
}

function ensureExplorationFixture() {
  if (practiceStarted) {
    // Keep the learner's record intact, including a zero-step / unfinished record.
    const parents = new Map(explorationParents);
    const moves = explorationMoves.map(move => ({ ...move, from: [...move.from], to: [...move.to] }));
    const lastPosition = moves.at(-1)?.to || MAIN_START;
    const path = pathToMainGoal(parents);
    dfsReplayRecord = {
      source: 'personal', parents, order: [...explorationOrder], moves,
      found: positionsMatch(lastPosition, MAIN_GOAL) && path.length > 0,
      path
    };
    return;
  }

  const parents = new Map();
  const order = [MAIN_START_KEY];
  const seen = new Set(order);
  const moves = [];
  for (let index = 1; index < practiceFixtureJourney.length; index += 1) {
    const from = practiceFixtureJourney[index - 1].at;
    const to = practiceFixtureJourney[index].at;
    const kind = practiceFixtureJourney[index].kind === 'back' ? 'back' : 'forward';
    const toKey = key(...to);
    const discovered = !seen.has(toKey);
    if (discovered) {
      seen.add(toKey);
      order.push(toKey);
      parents.set(toKey, key(...from));
    }
    moves.push({ from: [...from], to: [...to], kind, discovered });
  }
  const path = pathToMainGoal(parents);
  dfsReplayRecord = {
    source: 'example', parents, order, moves,
    found: positionsMatch(moves.at(-1)?.to || MAIN_START, MAIN_GOAL) && path.length > 0,
    path
  };
}

function showMainStage() {
  lesson.classList.remove('is-intro', 'is-summary');
  introStage.hidden = true;
  summaryStage.hidden = true;
  challengeStage.hidden = true;
  stage.hidden = false;
}

const chapterHashes = ['intro', 'observe', 'practice', 'tree', 'challenge', 'summary'];

function chapterFromHash() {
  const value = window.location.hash.replace('#', '');
  const index = chapterHashes.indexOf(value);
  return index >= 0 ? index : 0;
}

function routeToChapter(chapter, { updateHash = true, resumePractice = false } = {}) {
  const target = Math.max(0, Math.min(5, Number(chapter) || 0));
  const targetHash = `#${chapterHashes[target]}`;
  if (!updateHash && lastRoutedHash === targetHash) return;
  lastRoutedHash = targetHash;
  runId += 1;
  treeReplayId += 1;
  treeReplayRunToken += 1;
  challengeRunId += 1;
  resetMotion();
  hidePlaybackControls();
  setThinkingAnswer(false);
  window.scrollTo(0, 0);

  if (target === 0) showIntro();
  else if (target === 1) {
    showMainStage();
    prepareDemo();
  } else if (target === 2) {
    showMainStage();
    startPractice({ resume: resumePractice });
  } else if (target === 3) {
    ensureExplorationFixture();
    showMainStage();
    startTreeLesson();
  } else if (target === 4) startChallenge();
  else showSummary();

  if (updateHash) {
    if (window.location.hash !== targetHash) history.pushState({ chapter: target }, '', targetHash);
  }
}

function markChapterComplete(chapter) {
  completedChapters.add(chapter);
  saveCompletedChapters();
  updateChapterMap(chapterFromHash());
}

function resetChapterProgress() {
  completedChapters.clear();
  saveCompletedChapters();
  updateChapterMap(chapterFromHash());
}

function updateChapterMap(chapter) {
  chapterMapItems.forEach(item => {
    const index = Number(item.dataset.chapter);
    item.classList.toggle('is-complete', completedChapters.has(index));
    if (index === chapter) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  chapterMapButtons.forEach(button => {
    const active = Number(button.dataset.chapterTarget) === chapter;
    button.setAttribute('aria-pressed', String(active));
  });
}

function demoScaleDuration(value) {
  return value / demoSpeed;
}

function pauseDemoMotion() {
  [stepTimeline, reactionTimeline, idleTimeline, reunionTimeline, challengeCatIdleTimeline, challengeCatMotionTimeline, challengeCatReactionTimeline].forEach(timeline => timeline?.pause());
}

function resumeDemoMotion() {
  [stepTimeline, reactionTimeline, reunionTimeline, challengeCatMotionTimeline, challengeCatReactionTimeline].forEach(timeline => timeline?.resume());
  if (cat.dataset.action === 'idle') startCatIdle();
  if (document.querySelector('#challenge-cat')?.dataset.action === 'idle') startChallengeCatIdle();
}

function setDemoPaused(paused) {
  const controllable = ['demo', 'tree', 'challenge'].includes(playbackContext);
  demoPaused = Boolean(paused && controllable);
  demoPauseButton.setAttribute('aria-pressed', String(demoPaused));
  demoPauseButton.setAttribute('aria-label', demoPaused ? '继续播放' : '暂停播放');
  demoPauseButton.querySelector('span').textContent = demoPaused ? '继续' : '暂停';
  if (demoPaused) pauseDemoMotion();
  else {
    resumeDemoMotion();
    demoPauseWaiters.forEach(resolve => resolve());
    demoPauseWaiters.clear();
  }
  if (playbackContext === 'tree') {
    playbackStepButton.disabled = treeStepBusy || (treeAutoPlaying && !demoPaused);
  }
}

async function waitForDemoResume(runToken = runId) {
  while (demoPaused && runToken === runId) {
    await new Promise(resolve => demoPauseWaiters.add(resolve));
  }
  return runToken === runId;
}

async function demoWait(ms, runToken) {
  let remaining = ms;
  while (remaining > 0 && runToken === runId) {
    if (!await waitForDemoResume(runToken)) return false;
    const slice = Math.min(50, remaining / demoSpeed);
    const startedAt = performance.now();
    await wait(slice);
    if (!demoPaused) remaining -= (performance.now() - startedAt) * demoSpeed;
  }
  return runToken === runId;
}

function setDemoSpeed(speed) {
  demoSpeed = speed;
  demoSpeedButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.demoSpeed) === speed)));
  [stepTimeline, reactionTimeline, reunionTimeline, challengeCatMotionTimeline, challengeCatReactionTimeline].forEach(timeline => timeline?.timeScale(speed));
  if ((playbackContext === 'tree' && treeAlgorithm === 'bfs') || (playbackContext === 'challenge' && challengeAlgorithm === 'bfs')) return;
  if (playbackContext !== 'none') {
    narrationLabel.textContent = speed < 1 ? '慢速观察中' : speed > 1 ? '快速演示中' : playbackContext === 'challenge' ? '正在执行你选择的策略' : '正在发生什么？';
  }
}

function showPlaybackControls(context, { step = false, running = false, replay = true } = {}) {
  playbackContext = context;
  demoPlaybackControls.hidden = false;
  playbackStepButton.hidden = !step;
  playbackStepButton.disabled = running;
  playbackReplayButton.hidden = !replay;
  demoPauseButton.disabled = false;
  setDemoPaused(false);
  demoPauseButton.hidden = mode === 'tree-incomplete' || (!running && replay);
  demoPauseButton.setAttribute('aria-pressed', String(!running));
  demoPauseButton.setAttribute('aria-label', running ? '暂停播放' : '开始自动播放');
  demoPauseButton.querySelector('span').textContent = running ? '暂停' : '播放';
  lesson.classList.toggle('is-demo-running', window.matchMedia('(max-width: 760px)').matches);
}

function hidePlaybackControls() {
  playbackContext = 'none';
  setDemoPaused(false);
  lesson.classList.remove('is-demo-running');
  demoPlaybackControls.hidden = true;
  playbackStepButton.hidden = true;
  playbackReplayButton.hidden = false;
  demoPauseButton.hidden = false;
  demoPauseButton.disabled = false;
}

function resetDemoControls() {
  hidePlaybackControls();
}

function positionsMatch(first, second) {
  return first[0] === second[0] && first[1] === second[1];
}

function buildMaze() {
  resetMotion();
  treeMatchedKey = null;
  treePositionNumbers = new Map();
  mazeElement.innerHTML = '';
  cells.clear();
  const fogMode = mode === 'ready' || mode === 'demo' || mode === 'practice';
  const mazeOpenCells = activeOpenCells();
  mazeElement.classList.toggle('is-fog-mode', fogMode);
  mazeElement.classList.remove('is-map-complete');
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      const cell = document.createElement('button');
      const cellKey = key(row, column);
      cell.type = 'button';
      cell.className = `cell ${mazeOpenCells.has(cellKey) ? 'path' : 'wall'}`;
      if (fogMode && cellKey !== MAIN_START_KEY) cell.classList.add('is-unknown');
      if (cellKey === MAIN_START_KEY) cell.classList.add('is-start');
      if (cellKey === MAIN_GOAL_KEY) cell.classList.add('is-goal');
      cell.dataset.cell = cellKey;
      const terrain = mazeOpenCells.has(cellKey) ? '可通行' : '障碍物';
      cell.setAttribute('aria-label', fogMode && cellKey !== MAIN_START_KEY
        ? cellKey === MAIN_GOAL_KEY ? '目标小鱼，周围地形未知' : `第 ${row + 1} 行第 ${column + 1} 列，未知区域`
        : `第 ${row + 1} 行第 ${column + 1} 列，${terrain}`);
      cell.disabled = mode !== 'practice';
      cell.addEventListener('click', () => {
        if (isTreeCorrespondenceMode()) inspectTreePosition(cellKey);
        else handleCellChoice(row, column);
      });
      if (cellKey === MAIN_GOAL_KEY) {
        const fish = document.createElement('img');
        fish.className = 'fish-sprite';
        fish.src = './assets/fish-maze-low-poly.png';
        fish.alt = '金色低多边形小鱼';
        cell.append(fish);
      }
      mazeElement.append(cell);
      cells.set(cellKey, cell);
    }
  }
}

function revealFogCell(row, column, revealIndex = 0) {
  const cell = cells.get(key(row, column));
  if (!cell?.classList.contains('is-unknown')) return false;
  cell.style.setProperty('--reveal-delay', `${revealIndex * 55}ms`);
  cell.classList.remove('is-unknown');
  cell.classList.add('is-revealed');
  const terrain = activeOpenCells().has(key(row, column)) ? '可通行' : '障碍物';
  cell.setAttribute('aria-label', `第 ${row + 1} 行第 ${column + 1} 列，${terrain}`);
  return true;
}

function revealAround(position) {
  if (!mazeElement.classList.contains('is-fog-mode')) return;
  const [row, column] = position;
  const scanOrder = [[row, column], [row, column + 1], [row - 1, column], [row, column - 1], [row + 1, column]];
  let revealIndex = 0;
  scanOrder.forEach(([nextRow, nextColumn]) => {
    if (nextRow < 0 || nextRow > 5 || nextColumn < 0 || nextColumn > 5) return;
    if (revealFogCell(nextRow, nextColumn, revealIndex)) revealIndex += 1;
  });
}

function revealFullMaze() {
  mazeElement.classList.add('is-map-complete');
  let revealIndex = 0;
  cells.forEach((cell, cellKey) => {
    if (!cell.classList.contains('is-unknown')) return;
    const [row, column] = cellKey.split('-').map(Number);
    revealFogCell(row, column, revealIndex);
    revealIndex += 1;
  });
}

async function moveCat(row, column, kind, treeMove = null) {
  const epoch = motionEpoch;
  idleTimeline?.kill();
  reactionTimeline?.kill();
  if (window.gsap) gsap.set(catPose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
  setCatFrame(kind === 'back' ? 3 : 2);
  const target = cells.get(key(row, column));
  const oldRect = cat.isConnected ? cat.getBoundingClientRect() : null;
  target.append(cat);
  const newRect = cat.getBoundingClientRect();
  const movingLeft = column < previousPosition[1];
  cat.style.setProperty('--facing', movingLeft ? -1 : 1);

  cat.dataset.action = kind === 'back' ? 'back' : 'forward';
  if (oldRect && window.gsap && !reducedMotion()) {
    const dx = oldRect.left - newRect.left;
    const dy = oldRect.top - newRect.top;
    const duration = kind === 'back' ? .46 : kind === 'solution' ? .3 : .64;
    const liftDuration = kind === 'solution' ? .12 : .26;
    await new Promise(resolve => {
      settleMotion = resolve;
      stepTimeline = gsap.timeline({ onComplete: () => { settleMotion = null; resolve(true); } });
      stepTimeline.fromTo(cat, { x: dx, y: dy }, { x: 0, y: 0, duration, ease: kind === 'back' ? 'power2.in' : 'power2.inOut' }, 0);
      if (kind === 'back') {
        stepTimeline.to(catPose, { x: -5, y: -3, rotation: -8, scaleX: .96, scaleY: .94, duration: .17, ease: 'power2.out' }, 0)
          .to(catPose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .29, ease: 'power2.in' }, .17);
      } else {
        stepTimeline.to(catPose, { x: 4, y: kind === 'solution' ? -6 : -10, rotation: 6, scaleX: 1.05, scaleY: .9, duration: liftDuration, ease: 'power2.out' }, 0)
          .to(catPose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: duration - liftDuration, ease: 'bounce.out' }, liftDuration);
      }
      stepTimeline.call(() => setCatFrame(kind === 'back' ? 2 : 3), [], duration * .44)
        .call(() => setCatFrame(0), [], Math.max(0, duration - .03));
      if (treeMove) animateTreeStep(stepTimeline, treeMove, duration);
      if (mode === 'demo' || mode === 'tree') stepTimeline.timeScale(demoSpeed);
      stepTimeline.call(() => target.classList.add('current'), [], Math.max(0, duration - .05));
    });
  }
  if (epoch !== motionEpoch) return false;
  previousPosition = [row, column];
  cat.dataset.action = 'idle';
  if (kind === 'dead') reactCat('dead');
  else if (kind === 'forward' && activeBranchCells().has(key(row, column))) {
    reactCat('look');
    if (mode === 'demo') {
      if (!await demoWait(CAT_LOOK_DURATION, runId)) return false;
    } else {
      await wait(CAT_LOOK_DURATION);
    }
    if (epoch !== motionEpoch) return false;
  }
  else startCatIdle();
  return true;
}

function animateTreeStep(timeline, move, duration) {
  const from = key(...move.from);
  const to = key(...move.to);
  const back = move.kind === 'back';
  const edge = treeSvg.querySelector(`[data-edge="${back ? to : from}|${back ? from : to}"]`);
  const node = treeSvg.querySelector(`[data-node="${to}"]`);
  if (!edge || !node) return;
  const length = edge.getTotalLength();
  const cursor = createSvgElement('circle', { r: 6, fill: '#2f6f91', stroke: '#fffaf0', 'stroke-width': 2, 'aria-hidden': 'true' });
  treeSvg.append(cursor);
  const travel = { progress: back ? 1 : 0 };
  const place = () => { const p = edge.getPointAtLength(travel.progress * length); cursor.setAttribute('cx', p.x); cursor.setAttribute('cy', p.y); };
  place();
  if (!back) {
    revealTreeEdge(from, to);
    timeline.fromTo(edge, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: Math.max(.38, duration - .06), clearProps: 'strokeDasharray,strokeDashoffset' }, 0);
  }
  timeline.to(travel, { progress: back ? 0 : 1, duration, ease: 'power2.inOut', onUpdate: place }, 0);
  timeline.call(() => {
    cursor.remove();
    revealTreeNode(to);
    activateTreeNode(to);
    if (back) {
      treeSvg.querySelector(`[data-node="${from}"]`)?.classList.add('is-returned');
      edge.classList.add('is-rejected');
    }
  }, [], duration);
}

function setNarration(kind) {
  const messages = {
    start: `先规定检查顺序：${DFS_DEMO_ORDER_TEXT}。小猫每到一个位置，都按这个顺序选择第一条没走过的路。`,
    forward: '试探：这条路还能继续，小猫沿当前分支向前探索。',
    dead: '碰壁：这里没有新的出口，标记为死路，准备沿原路回退。',
    back: '回退：小猫退回上一个位置，直到找到仍有其他选择的岔路口。',
    found: '找到目标：这次搜索完整经历了“试探—碰壁—回退—换路”。'
  };
  const nextMessage = messages[kind];
  if (narrationText.textContent === nextMessage) return;

  setMessage(nextMessage);
}

function markDeadEnd(cell) {
  if (cell.querySelector('.dead-mark')) return;
  const mark = document.createElement('span');
  mark.className = 'dead-mark';
  mark.textContent = '×';
  mark.setAttribute('aria-label', '死路');
  cell.append(mark);
}

function direction(from, to) {
  const [fromRow, fromColumn] = from;
  const [toRow, toColumn] = to;
  if (toColumn < fromColumn) return 'left';
  if (toColumn > fromColumn) return 'right';
  if (toRow < fromRow) return 'up';
  return 'down';
}

function isAdjacent(from, to) {
  return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]) === 1;
}

function setMessage(message, useHtml = false) {
  const comparison = document.createElement('span');
  if (useHtml) comparison.innerHTML = message;
  else comparison.textContent = message;
  clearTimeout(messageTimer);
  if (narrationText.textContent === comparison.textContent) {
    narrationText.style.opacity = '1';
    return;
  }
  narrationText.style.opacity = '.25';
  messageTimer = window.setTimeout(() => {
    if (useHtml) narrationText.innerHTML = message;
    else narrationText.textContent = message;
    narrationText.style.opacity = '1';
  }, 150);
}

function showSolutionPath(path = solutionPath) {
  path.forEach((position, index) => {
    const cell = cells.get(key(...position));
    const marker = document.createElement('span');
    marker.className = 'solution-mark';
    marker.style.animationDelay = `${index * 70}ms`;
    marker.setAttribute('aria-hidden', 'true');

    const center = document.createElement('b');
    marker.append(center);
    [path[index - 1], path[index + 1]].filter(Boolean).forEach(neighbor => {
      const line = document.createElement('i');
      line.className = `to-${direction(position, neighbor)}`;
      marker.append(line);
    });
    cell.append(marker);
  });
}

function clearChoices() {
  cells.forEach(cell => cell.classList.remove('choice', 'choice--unknown', 'choice--back', 'choice--visited', 'choice-error'));
}

function setTreeView(view) {
  stage.dataset.view = view;
  window.requestAnimationFrame(fitExplorationTree);
  viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
}

function setThinkingAnswer(open) {
  document.body.classList.toggle('answer-open', open);
  thinkingToggle.setAttribute('aria-expanded', String(open));
  thinkingToggle.setAttribute('aria-label', open ? '收起思考题答案' : '查看思考题答案');
  thinkingAnswer.hidden = !open;
  if (!open) window.requestAnimationFrame(pinDesktopViewport);
}

function updateAlgorithmCopy() {
  const isBfs = treeAlgorithm === 'bfs';
  const dfsButton = algorithmButtons.find(button => button.dataset.algorithm === 'dfs');
  dfsButton.querySelector('strong').textContent = 'DFS';
  dfsButton.querySelector('span').textContent = '深度优先';
  dfsButton.setAttribute('aria-label', '查看 DFS 深度优先探索树');
  stage.classList.toggle('stage--bfs', isBfs);
  algorithmButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.algorithm === treeAlgorithm));
  });

  if (isBfs) {
    stageKicker.textContent = '由近到远，一层层探索';
    lessonTitle.innerHTML = '一圈一圈<br>向外探索';
    stageDescription.textContent = 'BFS 会先检查离起点最近的位置，再把搜索范围一层层向外扩大。';
    thinkingText.textContent = '如果每次都先检查离起点最近的位置，BFS 第一次找到小鱼时，为什么会得到步数最少的路线？';
    thinkingAnswerText.textContent = 'BFS 按离起点由近到远逐层搜索，最先发现目标时，对应的路径就是最少步数的路线。';
    treeTitle.textContent = '搜索怎样一层层展开';
    treeKeyOption.textContent = '未探索';
    treeKeyVisited.textContent = '已经检查';
    treeKeySolution.textContent = '最短路线';
    progressLabel.textContent = '按距离逐层探索';
  } else {
    stageKicker.textContent = '从迷宫看见探索树';
    lessonTitle.innerHTML = '看见每一次<br>深入与退回';
    stageDescription.textContent = '按 DFS 规则先深入，再回溯；迷宫与搜索树同步展示。';
    thinkingText.textContent = '小猫到达岔路口时，DFS 会先探索哪一条支路？当遇到死胡同，小猫要回到哪里，才能尝试别的路？';
    thinkingAnswerText.textContent = 'DFS 按右→上→左→下选择第一条未走过的新路，沿分支深入；没有新路时，沿原路逐步回溯。';
    treeTitle.textContent = '探索怎样长成一棵树';
    treeKeyOption.textContent = '未探索';
    treeKeyVisited.textContent = '探索过';
    treeKeySolution.textContent = '最终路线';
    progressLabel.textContent = '逐步回看你的探索';
  }
  setThinkingAnswer(false);
}

function setTreeAlgorithm(algorithm) {
  if (!['dfs', 'bfs'].includes(algorithm) || algorithm === treeAlgorithm) return;
  treeReplayId += 1;
  treeReplayRunToken += 1;
  treeAutoPlaying = false;
  treeStepBusy = false;
  resetMotion();
  hidePlaybackControls();
  treeAlgorithm = algorithm;
  updateAlgorithmCopy();
  prepareTreeReplay();
  if (mode === 'tree-incomplete') {
    showPlaybackControls('tree', { step: false, running: false });
    demoPauseButton.disabled = true;
  } else {
    showPlaybackControls('tree', { step: true, running: false, replay: false });
    playbackStepButton.disabled = false;
  }
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attributes).forEach(([attribute, value]) => element.setAttribute(attribute, value));
  return element;
}

function mazeTopology() {
  const parents = new Map();
  const order = [MAIN_START_KEY];
  const queue = [[...MAIN_START]];
  const visited = new Set(order);

  while (queue.length) {
    const [row, column] = queue.shift();
    [[row, column - 1], [row + 1, column], [row, column + 1], [row - 1, column]].forEach(position => {
      const childKey = key(...position);
      if (!practiceOpenCells.has(childKey) || visited.has(childKey)) return;
      visited.add(childKey);
      parents.set(childKey, key(row, column));
      order.push(childKey);
      queue.push(position);
    });
  }
  return { parents, order };
}

function treeChildren(parents, order) {
  const children = new Map(order.map(cellKey => [cellKey, []]));
  parents.forEach((parent, child) => children.get(parent)?.push(child));
  children.forEach(items => items.sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  return children;
}

function treeLayout(topology) {
  const children = treeChildren(topology.parents, topology.order);
  const positions = new Map();
  const leafGap = topology.referenceParents?.size ? 136 : 120;
  let leafIndex = 0;
  let maxDepth = 0;

  function place(cellKey, depth) {
    maxDepth = Math.max(maxDepth, depth);
    const descendants = children.get(cellKey) || [];
    let x;
    if (descendants.length === 0) {
      x = leafIndex * leafGap + 50;
      leafIndex += 1;
    } else {
      const childXs = descendants.map(child => place(child, depth + 1));
      x = childXs.reduce((sum, value) => sum + value, 0) / childXs.length;
    }
    positions.set(cellKey, { x, y: depth * 64 + 32 });
    return x;
  }

  place(MAIN_START_KEY, 0);
  return {
    children,
    topology,
    positions,
    width: Math.max(170, (leafIndex - 1) * leafGap + 100),
    height: Math.max(120, maxDepth * 64 + 64)
  };
}

function isTreeCorrespondenceMode() {
  return mode === 'tree' || mode === 'tree-complete' || mode === 'tree-incomplete';
}

function clearTreeMatch() {
  treeMatchedKey = null;
  cells.forEach(cell => {
    cell.classList.remove('is-tree-match', 'is-tree-parent');
    cell.querySelector('.tree-match-link')?.remove();
  });
  treeSvg.querySelectorAll('.is-tree-match').forEach(item => item.classList.remove('is-tree-match'));
}

function syncTreePositionMarkers() {
  if (!isTreeCorrespondenceMode()) return;
  cells.forEach((cell, cellKey) => {
    const node = treeSvg.querySelector(`[data-node="${cellKey}"]`);
    const visible = node && !node.classList.contains('is-hidden');
    let badge = cell.querySelector('.tree-position-badge');
    cell.disabled = !visible;
    if (!visible) {
      badge?.remove();
      if (node) node.setAttribute('tabindex', '-1');
      return;
    }
    const number = treePositionNumbers.get(cellKey);
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tree-position-badge';
      badge.setAttribute('aria-hidden', 'true');
      cell.append(badge);
    }
    badge.textContent = String(number);
    node.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', `迷宫位置 ${number}${node.classList.contains('is-unsearched') ? '，未探索参照' : ''}${cellKey === MAIN_START_KEY ? '，起点' : cellKey === MAIN_GOAL_KEY ? '，目标小鱼' : ''}，点击查看树中对应节点`);
  });
}

function showTreeMatchLink(parentKey, childKey) {
  const parentPosition = parentKey.split('-').map(Number);
  const childPosition = childKey.split('-').map(Number);
  if (!isAdjacent(parentPosition, childPosition)) return;
  [[parentKey, parentPosition, childPosition], [childKey, childPosition, parentPosition]].forEach(([cellKey, from, to]) => {
    const marker = document.createElement('span');
    marker.className = 'tree-match-link';
    marker.setAttribute('aria-hidden', 'true');
    const line = document.createElement('i');
    line.className = `to-${direction(from, to)}`;
    marker.append(line);
    cells.get(cellKey)?.append(marker);
  });
}

function fitExplorationTree() {
  if (!isTreeCorrespondenceMode()) return;
  const canvas = treeSvg.parentElement;
  if (!canvas || canvas.clientWidth <= 0 || canvas.clientHeight <= 0) return;
  const naturalWidth = Number(treeSvg.getAttribute('width'));
  const naturalHeight = Number(treeSvg.getAttribute('height'));
  if (!naturalWidth || !naturalHeight) return;
  const scale = Math.min(1, Math.max(1, canvas.clientWidth - 8) / naturalWidth, Math.max(1, canvas.clientHeight - 8) / naturalHeight);
  treeSvg.style.width = `${naturalWidth * scale}px`;
  treeSvg.style.height = `${naturalHeight * scale}px`;
}
let treeViewportObserver = null;
if (typeof ResizeObserver !== 'undefined') {
  treeViewportObserver = new ResizeObserver(fitExplorationTree);
  if (treeSvg.parentElement) treeViewportObserver.observe(treeSvg.parentElement);
}

function highlightTreePosition(cellKey, { inspect = false } = {}) {
  if (!isTreeCorrespondenceMode()) return false;
  const node = treeSvg.querySelector(`[data-node="${cellKey}"]`);
  const cell = cells.get(cellKey);
  if (!node || node.classList.contains('is-hidden') || !cell) return false;
  clearTreeMatch();
  treeMatchedKey = cellKey;
  cell.classList.add('is-tree-match');
  node.classList.add('is-tree-match');
  const parentKey = renderedTreeTopology.parents.get(cellKey);
  const edge = parentKey ? treeSvg.querySelector(`[data-edge="${parentKey}|${cellKey}"]`) : null;
  let relation = '起点是树的根节点。同号对应同一位置，编号不是搜索顺序。';
  if (edge && !edge.classList.contains('is-hidden')) {
    edge.classList.add('is-tree-match');
    cells.get(parentKey)?.classList.add('is-tree-parent');
    showTreeMatchLink(parentKey, cellKey);
    relation = node.classList.contains('is-unsearched')
      ? `未探索。虚线仅表示与 ${treePositionNumbers.get(parentKey)} 相邻，不是已执行的搜索树枝。`
      : `由 ${treePositionNumbers.get(parentKey)} 首次发现 ${treePositionNumbers.get(cellKey)}；树枝对应这两个相邻位置的连接。`;
  } else if (parentKey) {
    relation = '该位置已发现、待探索；连接尚未检查。';
  }
  if (treeMatchNote) {
    const status = inspect ? '查看对应' : treeAlgorithm === 'bfs' && mode === 'tree' ? '当前检查' : '当前位置';
    treeMatchNote.textContent = !inspect && treeAlgorithm === 'bfs' && mode === 'tree'
      ? '同号对应同一位置；蓝色是搜索检查，小猫暂不行走。'
      : `${status} ${treePositionNumbers.get(cellKey)}。${relation}`;
  }
  return true;
}

function inspectTreePosition(cellKey) {
  if (treeStepBusy || (treeAutoPlaying && !demoPaused)) return;
  highlightTreePosition(cellKey, { inspect: true });
}

function treeDisplayTopology(topology) {
  // Reserve reference-only branches without changing actual search records.
  const parents = new Map(topology.parents);
  const order = [...topology.order];
  const referenceParents = new Map();
  const seen = new Set(order);
  const queue = [...order];
  for (let i = 0; i < queue.length; i += 1) {
    const parent = queue[i];
    const [r, c] = parent.split('-').map(Number);
    [[r, c - 1], [r + 1, c], [r, c + 1], [r - 1, c]].forEach(position => {
      const child = key(...position);
      if (!practiceOpenCells.has(child) || seen.has(child)) return;
      seen.add(child);
      parents.set(child, parent);
      referenceParents.set(child, parent);
      order.push(child);
      queue.push(child);
    });
  }
  return { parents, order, referenceParents };
}

function revealUnsearchedTree(checkedKeys) {
  treeSvg.querySelectorAll('.tree-node').forEach(node => {
    if (checkedKeys.has(node.dataset.node)) return;
    node.classList.remove('is-hidden', 'is-option', 'is-active', 'is-returned', 'is-solution', 'is-bfs-visited');
    node.classList.add('is-unsearched');
    node.setAttribute('aria-label', `位置 ${treePositionNumbers.get(node.dataset.node)}，未探索，结束后补充的参照节点`);
  });
  treeSvg.querySelectorAll('.tree-edge').forEach(edge => {
    const [, child] = edge.dataset.edge.split('|');
    if (checkedKeys.has(child)) return;
    edge.classList.remove('is-hidden', 'is-option', 'is-solution', 'is-bfs-visited');
    edge.classList.add('is-unsearched');
    edge.setAttribute('aria-label', '未探索位置的相邻连接，仅作参照，不表示已搜索');
  });
  syncTreePositionMarkers();
}

function renderExplorationTree(topology, moves = []) {
  clearTreeMatch();
  treeSvg.innerHTML = '';
  renderedTreeTopology = topology;
  // Position IDs are independent of search order and remain identical across DFS/BFS.
  treePositionNumbers = new Map([...practiceOpenCells].sort((a, b) => {
    const [ar, ac] = a.split('-').map(Number);
    const [br, bc] = b.split('-').map(Number);
    return ar - br || ac - bc;
  }).map((cellKey, index) => [cellKey, index + 1]));
  const { positions, width, height } = treeLayout(topology);
  // A fresh viewport avoids retaining a sparse tree's old intrinsic SVG size.
  const oldSvg = treeSvg;
  treeSvg = oldSvg.cloneNode(false);
  treeViewportObserver?.unobserve(oldSvg);
  treeSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  treeSvg.setAttribute('width', String(width));
  treeSvg.setAttribute('height', String(height));
  // Sparse personal records must not be magnified to fill the entire panel.
  treeSvg.style.width = `${width}px`;
  treeSvg.style.height = `${height}px`;
  treeSvg.style.maxWidth = '100%';
  treeSvg.style.maxHeight = '100%';
  treeSvg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
  oldSvg.replaceWith(treeSvg);
  fitExplorationTree();
  window.requestAnimationFrame(fitExplorationTree);

  topology.parents.forEach((parent, child) => {
    const from = positions.get(parent);
    const to = positions.get(child);
    const edge = createSvgElement('path', {
      d: `M ${from.x} ${from.y + 23} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${(from.y + to.y) / 2}, ${to.x} ${to.y - 23}`,
      class: 'tree-edge is-hidden',
      'data-edge': `${parent}|${child}`
    });
    treeSvg.append(edge);
  });

  // Revisited connections are graph links, not newly invented parent/child branches.
  const edgeKeys = new Set([...topology.parents].map(([child, parent]) => `${parent}|${child}`));
  moves.forEach(move => {
    const fromKey = key(...move.from);
    const toKey = key(...move.to);
    const edgeKey = move.kind === 'back' ? `${toKey}|${fromKey}` : `${fromKey}|${toKey}`;
    if (edgeKeys.has(edgeKey)) return;
    const [parent, child] = edgeKey.split('|');
    const from = positions.get(parent);
    const to = positions.get(child);
    if (!from || !to) return;
    const bend = Math.min(width - 12, Math.max(from.x, to.x) + 28);
    treeSvg.append(createSvgElement('path', {
      d: `M ${from.x} ${from.y} C ${bend} ${from.y}, ${bend} ${to.y}, ${to.x} ${to.y}`,
      class: 'tree-edge is-hidden is-cross-link', 'stroke-dasharray': '4 5',
      'data-edge': edgeKey, 'aria-label': '再次经过的连接，不是首次发现树枝'
    }));
    edgeKeys.add(edgeKey);
  });

  topology.order.forEach(cellKey => {
    const position = positions.get(cellKey);
    const positionNumber = treePositionNumbers.get(cellKey);
    const node = createSvgElement('g', {
      class: `tree-node is-hidden${cellKey === MAIN_GOAL_KEY ? ' is-goal' : ''}`,
      transform: `translate(${position.x} ${position.y})`,
      'data-node': cellKey,
      role: 'button',
      tabindex: '-1',
      'aria-label': `位置 ${positionNumber}${cellKey === MAIN_START_KEY ? '，起点' : cellKey === MAIN_GOAL_KEY ? '，目标小鱼' : ''}，查看迷宫中的对应位置`
    });
    node.append(createSvgElement('rect', { class: 'tree-node-hit', x: -24, y: -24, width: 48, height: 48, rx: 24 }));
    node.append(createSvgElement('circle', { r: 22 }));
    const label = createSvgElement('text', { x: 0, y: '.5' });
    label.textContent = String(positionNumber);
    node.append(label);
    node.addEventListener('click', () => inspectTreePosition(cellKey));
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        inspectTreePosition(cellKey);
      }
    });
    treeSvg.append(node);
  });
  syncTreePositionMarkers();
}

function revealTreeNode(cellKey) {
  treeSvg.querySelector(`[data-node="${cellKey}"]`)?.classList.remove('is-hidden', 'is-option');
  syncTreePositionMarkers();
}

function revealTreeEdge(from, to) {
  treeSvg.querySelector(`[data-edge="${from}|${to}"]`)?.classList.remove('is-hidden', 'is-option');
}

function revealTreeOptions(parentKey) {
  const { parents } = renderedTreeTopology;
  parents.forEach((parent, child) => {
    if (parent !== parentKey || renderedTreeTopology.referenceParents?.has(child)) return;
    const node = treeSvg.querySelector(`[data-node="${child}"]`);
    const edge = treeSvg.querySelector(`[data-edge="${parent}|${child}"]`);
    if (node?.classList.contains('is-hidden')) node.classList.add('is-option');
    if (edge?.classList.contains('is-hidden')) edge.classList.add('is-option');
    node?.classList.remove('is-hidden');
    edge?.classList.remove('is-hidden');
  });
  syncTreePositionMarkers();
}

function activateTreeNode(cellKey) {
  treeSvg.querySelectorAll('.tree-node.is-active').forEach(node => node.classList.remove('is-active'));
  const node = treeSvg.querySelector(`[data-node="${cellKey}"]`);
  node?.classList.remove('is-hidden');
  node?.classList.add('is-active');
  syncTreePositionMarkers();
  highlightTreePosition(cellKey);
}

function finishIncompleteTreeReplay(message = '当前探索记录已回放完，但小猫还没有找到小鱼。点击“继续练习”，从刚才的位置接着探索。') {
  treeAutoPlaying = false;
  treeStepBusy = false;
  mode = 'tree-incomplete';
  cat.dataset.action = 'idle';
  phaseLabel.textContent = '未完成';
  progressLabel.textContent = '记录回放结束，尚未找到目标';
  narrationLabel.textContent = '回放结束，不等于探索成功';
  setMessage(message);
  showPlaybackControls('tree', { step: false, running: false });
  demoPauseButton.disabled = true;
  nextStepButton.hidden = false;
  nextStepButton.disabled = false;
  nextStepButton.querySelector('span').textContent = '继续练习';
  replayTreeButton.disabled = false;
}

function finishDfsReplay() {
  if (!dfsReplayRecord?.found || !positionsMatch(previousPosition, MAIN_GOAL)) {
    finishIncompleteTreeReplay();
    return;
  }
  revealUnsearchedTree(new Set(dfsReplayRecord.order));
  reactCat('found');
  const finalPath = dfsReplayRecord.path;
  const finalKeys = new Set(finalPath.map(position => key(...position)));
  const finalEdges = new Set(finalPath.slice(1).map((position, index) => `${key(...finalPath[index])}|${key(...position)}`));
  const exploredKeys = new Set(dfsReplayRecord.order);
  treeSvg.querySelectorAll('.tree-node').forEach(node => {
    node.classList.remove('is-active');
    if (finalKeys.has(node.dataset.node)) node.classList.add('is-solution');
    else if (exploredKeys.has(node.dataset.node)) node.classList.add('is-returned');
    else if (!node.classList.contains('is-hidden')) node.classList.add('is-option');
  });
  treeSvg.querySelectorAll('.tree-edge').forEach(edge => {
    const [, child] = edge.dataset.edge.split('|');
    if (finalEdges.has(edge.dataset.edge)) edge.classList.add('is-solution');
    else if (exploredKeys.has(child)) edge.classList.add('is-rejected');
    else if (!edge.classList.contains('is-hidden')) edge.classList.add('is-option');
  });
  showSolutionPath(finalPath);
  journeyFill.style.width = '100%';
  stepNumber.textContent = '03';
  phaseLabel.textContent = '发现';
  progressLabel.textContent = dfsReplayRecord.source === 'personal' ? '个人记录回放完成' : '规律被发现了';
  narrationLabel.textContent = '这就是深度优先搜索';
  setMessage('小猫按顺序选一条未走过的新路不断<strong>深入</strong>，没有新路时沿原路<strong>回溯</strong>，再尝试其他分支。这就是<strong>深度优先搜索（DFS）</strong>；找到的路线不保证最短。', true);
  treeAutoPlaying = false;
  treeStepBusy = false;
  mode = 'tree-complete';
  highlightTreePosition(MAIN_GOAL_KEY);
  if (treeMatchNote && treeSvg.querySelector('.tree-node.is-unsearched')) treeMatchNote.textContent = '找到小鱼后停止；灰色虚线是未探索参照，不代表已搜索。';
  showPlaybackControls('tree', { step: false, running: false });
  demoPauseButton.disabled = true;
  nextStepButton.hidden = false;
  nextStepButton.disabled = false;
  nextStepButton.querySelector('span').textContent = '进入挑战';
  replayTreeButton.disabled = false;
  markChapterComplete(3);
}

function prepareDfsReplay() {
  if (!dfsReplayRecord) ensureExplorationFixture();
  updateAlgorithmCopy();
  const thisReplay = ++treeReplayId;
  treeReplayIndex = 0;
  treeStepBusy = false;
  treeAutoPlaying = false;
  mode = 'tree';
  previousPosition = [...MAIN_START];
  buildMaze();
  cells.get(MAIN_START_KEY).append(cat);
  cells.get(MAIN_START_KEY).classList.add('current');
  startCatIdle();
  renderExplorationTree(dfsReplayRecord.source === 'example' || dfsReplayRecord.found ? treeDisplayTopology(dfsReplayRecord) : dfsReplayRecord, dfsReplayRecord.moves);
  document.querySelector('#tree-record-label').textContent = dfsReplayRecord.source === 'example' ? 'DFS 示例探索树' : '你的 DFS 探索树';
  treeSvg.setAttribute('aria-label', dfsReplayRecord.source === 'example' ? '按 DFS 规则生成的示例探索树' : '根据你的实际探索记录生成的树；虚线表示重复经过的连接');
  revealTreeNode(MAIN_START_KEY);
  activateTreeNode(MAIN_START_KEY);
  revealTreeOptions(MAIN_START_KEY);
  nextStepButton.hidden = true;
  nextStepButton.disabled = false;
  nextStepButton.querySelector('span').textContent = '下一步';
  replayTreeButton.disabled = false;
  journeyFill.style.width = '0%';
  stepNumber.textContent = '01';
  phaseLabel.textContent = '对照';
  narrationLabel.textContent = '迷宫正在变成探索树';
  setMessage(dfsReplayRecord.source === 'example'
    ? '还没有个人探索记录，当前播放的是 DFS 示例。点击“下一步”，观察小猫与探索树同步变化。'
    : '当前回放你按 DFS 规则完成的探索。实线记录首次发现的父子关系，回退沿原路发生。');
  if (!dfsReplayRecord.moves.length) finishIncompleteTreeReplay();
  return thisReplay;
}

async function advanceDfsStep(thisReplay = treeReplayId, automatic = false) {
  if (thisReplay !== treeReplayId || treeStepBusy || treeReplayIndex >= dfsReplayRecord.moves.length) return false;
  treeStepBusy = true;
  nextStepButton.disabled = true;
  const index = treeReplayIndex;
  const move = dfsReplayRecord.moves[index];
    const fromKey = key(...move.from);
    const toKey = key(...move.to);
    const oldCell = cells.get(fromKey);
    const nextCell = cells.get(toKey);
    oldCell?.classList.remove('current');
    oldCell?.classList.add('explored');
    revealTreeNode(toKey);
    highlightTreePosition(toKey);
    const moved = await moveCat(...move.to, move.kind, move);
    if (thisReplay !== treeReplayId) {
      return false;
    }
    if (!moved) return false;
    nextCell?.classList.add('current');
    revealTreeEdge(move.kind === 'forward' ? fromKey : toKey, move.kind === 'forward' ? toKey : fromKey);
    revealTreeNode(toKey);
    activateTreeNode(toKey);
    revealTreeOptions(toKey);

    if (move.kind === 'back') {
      treeSvg.querySelector(`[data-node="${fromKey}"]`)?.classList.add('is-returned');
      treeSvg.querySelector(`[data-edge="${toKey}|${fromKey}"]`)?.classList.add('is-rejected');
      const returnsAgain = dfsReplayRecord.moves[index + 1]?.kind === 'back';
      setMessage(returnsAgain
        ? '这里没有未走过的新路，小猫沿原路退一格；下一步继续检查是否还有新路。'
        : '小猫沿原路退回上一个位置；接下来按右→上→左→下检查剩余的新路。');
    } else {
      const [row, column] = move.to;
      const reachesDeadEnd = dfsReplayRecord.moves[index + 1]?.kind === 'back' &&
        [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]]
          .filter(position => practiceOpenCells.has(key(...position))).length === 1;
      if (reachesDeadEnd) reactCat('dead');
      setMessage(reachesDeadEnd
        ? '小猫走到了死胡同。树上的当前节点保持高亮，再点一次“下一步”开始后退。'
        : move.discovered
          ? '小猫前进一格，迷宫路径被点亮，树上同步长出并高亮了一个新节点。'
          : '小猫再次进入走过的分支，树状图同步高亮原来的节点。');
    }
    treeReplayIndex += 1;
    journeyFill.style.width = `${((index + 1) / dfsReplayRecord.moves.length) * 100}%`;
    stepNumber.textContent = String(Math.min(index + 2, 99)).padStart(2, '0');
    treeStepBusy = false;

    if (treeReplayIndex >= dfsReplayRecord.moves.length) {
      finishDfsReplay();
      return true;
    }
    if (!automatic) nextStepButton.disabled = false;
    return true;
}

async function runDfsReplay({ restart = false } = {}) {
  const thisReplay = restart ? prepareDfsReplay() : treeReplayId;
  if (!dfsReplayRecord?.moves.length || mode === 'tree-incomplete') return;
  const runToken = ++treeReplayRunToken;
  treeAutoPlaying = true;
  showPlaybackControls('tree', { step: true, running: true });
  playbackStepButton.disabled = true;
  replayTreeButton.disabled = true;
  nextStepButton.disabled = true;
  setMessage('正在自动演示完整探索过程；小猫与树状图会保持同步。');
  if (!await playbackWait(520, () => thisReplay === treeReplayId && runToken === treeReplayRunToken)) return;
  while (thisReplay === treeReplayId && runToken === treeReplayRunToken && treeReplayIndex < dfsReplayRecord.moves.length) {
    if (!await waitForDemoResume(runId)) return;
    await advanceDfsStep(thisReplay, true);
    if (thisReplay !== treeReplayId || runToken !== treeReplayRunToken) return;
    if (!await playbackWait(dfsReplayRecord.moves[treeReplayIndex - 1]?.kind === 'back' ? 430 : 360, () => thisReplay === treeReplayId && runToken === treeReplayRunToken)) return;
  }
}

function topologyDepth(cellKey, parents = bfsParents) {
  let depth = 0;
  let current = cellKey;
  while (parents.has(current)) {
    depth += 1;
    current = parents.get(current);
  }
  return depth;
}

function revealBfsFrontier(parentKey) {
  revealTreeOptions(parentKey);
  bfsParents.forEach((parent, child) => {
    if (parent !== parentKey || bfsOrder.indexOf(child) <= bfsReplayIndex) return;
    cells.get(child)?.classList.add('bfs-frontier');
  });
}

function setBfsMessage(message) {
  // Step explanations stay fully visible; do not fade to an old sentence.
  clearTimeout(messageTimer);
  narrationText.textContent = message;
  narrationText.style.opacity = '1';
}

function bfsReadingHold(index = bfsReplayIndex) {
  const cellKey = bfsOrder[index];
  const nextKey = bfsOrder[index + 1];
  return nextKey && topologyDepth(nextKey) > topologyDepth(cellKey) ? 3000 : 2100;
}

function showBfsStepCopy(cellKey, index) {
  const number = treePositionNumbers.get(cellKey);
  const parentNumber = treePositionNumbers.get(bfsParents.get(cellKey));
  const depth = topologyDepth(cellKey);
  const nextKey = bfsOrder[index + 1];
  const nextDepth = nextKey ? topologyDepth(nextKey) : depth;
  narrationLabel.textContent = `第 ${depth} 层 · 检查 ${number}`;
  const next = cellKey === MAIN_GOAL_KEY ? '找到小鱼，搜索停止。'
    : nextDepth > depth ? `这是本层最后一个位置；下一步进入第 ${nextDepth} 层。`
    : nextKey ? `下一步仍检查同层的 ${treePositionNumbers.get(nextKey)}。` : '';
  setBfsMessage(`由 ${parentNumber} 首次发现 ${number}。${next}`);
}

function prepareBfsReplay() {
  const thisReplay = ++treeReplayId;
  const topology = mazeTopology();
  bfsReplayIndex = 0;
  bfsOrder = topology.order;
  bfsParents = topology.parents;
  treeStepBusy = false;
  treeAutoPlaying = false;
  mode = 'tree';
  previousPosition = [...MAIN_START];
  buildMaze();
  cells.get(MAIN_START_KEY).append(cat);
  cells.get(MAIN_START_KEY).classList.add('current', 'bfs-current', 'bfs-visited');
  startCatIdle();
  renderExplorationTree(topology);
  document.querySelector('#tree-record-label').textContent = 'BFS 搜索树';
  treeSvg.setAttribute('aria-label', '根据当前练习迷宫的 BFS 搜索生成的树状图');
  revealTreeNode(MAIN_START_KEY);
  activateTreeNode(MAIN_START_KEY);
  treeSvg.querySelector(`[data-node="${MAIN_START_KEY}"]`)?.classList.add('is-bfs-visited');
  revealBfsFrontier(MAIN_START_KEY);
  nextStepButton.hidden = true;
  nextStepButton.disabled = false;
  nextStepButton.querySelector('span').textContent = '下一步';
  replayTreeButton.disabled = false;
  journeyFill.style.width = '0%';
  stepNumber.textContent = '01';
  phaseLabel.textContent = '逐层搜索';
  narrationLabel.textContent = '从第 0 层开始';
  setBfsMessage('先检查离起点近的位置；蓝色高亮是搜索，小猫暂不行走。');
  return thisReplay;
}

async function animateBfsVisit(parentKey, cellKey) {
  const epoch = motionEpoch;
  const cell = cells.get(cellKey);
  const edge = treeSvg.querySelector(`[data-edge="${parentKey}|${cellKey}"]`);
  const node = treeSvg.querySelector(`[data-node="${cellKey}"]`);
  cell?.classList.remove('bfs-frontier');
  cell?.classList.add('bfs-current', 'bfs-visited');
  revealTreeEdge(parentKey, cellKey);
  revealTreeNode(cellKey);

  highlightTreePosition(cellKey);
  showBfsStepCopy(cellKey, bfsReplayIndex + 1);
  const pulse = document.createElement('span');
  pulse.className = 'bfs-pulse';
  pulse.setAttribute('aria-hidden', 'true');
  cell?.append(pulse);

  if (!window.gsap || reducedMotion() || !edge || !node) {
    pulse.remove();
    return epoch === motionEpoch;
  }

  const length = edge.getTotalLength();
  const circle = node.querySelector('circle');
  return new Promise(resolve => {
    settleMotion = resolve;
    stepTimeline = gsap.timeline({
      onComplete: () => {
        pulse.remove();
        settleMotion = null;
        resolve(epoch === motionEpoch);
      }
    });
    stepTimeline.fromTo(edge,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: .52, clearProps: 'strokeDasharray,strokeDashoffset', ease: 'power2.out' }, 0);
    stepTimeline.fromTo(pulse, { scale: .35, opacity: .9 }, { scale: 1.8, opacity: 0, duration: .55, ease: 'power2.out' }, 0);
    stepTimeline.fromTo(circle, { scale: .72, transformOrigin: 'center' }, { scale: 1, duration: .42, ease: 'back.out(2)' }, .12);
    stepTimeline.timeScale(demoSpeed);
  });
}

async function finishBfsReplay(thisReplay) {
  if (thisReplay !== treeReplayId) return;
  const finalPath = pathToMainGoal(bfsParents);
  if (!finalPath.length) {
    finishIncompleteTreeReplay('本轮 BFS 没有找到连接起点与目标的路线。可以返回练习，或重新播放搜索过程。');
    return;
  }
  treeStepBusy = true;
  nextStepButton.disabled = true;
  nextStepButton.querySelector('span').textContent = '找到最短路线';
  narrationLabel.textContent = `第 ${topologyDepth(MAIN_GOAL_KEY)} 层找到小鱼`;
  setBfsMessage(`找到 ${treePositionNumbers.get(MAIN_GOAL_KEY)}：每步代价相同，最短路线共 ${finalPath.length - 1} 步。接下来小猫沿路线行走。`);
  if (!await playbackWait(2400, () => thisReplay === treeReplayId)) return;

  const finalKeys = new Set(finalPath.map(position => key(...position)));
  const finalEdges = new Set(finalPath.slice(1).map((position, index) => `${key(...finalPath[index])}|${key(...position)}`));
  treeSvg.querySelectorAll('.tree-node').forEach(node => {
    node.classList.remove('is-active');
    if (finalKeys.has(node.dataset.node)) node.classList.add('is-solution');
    else if (node.classList.contains('is-bfs-visited')) node.classList.add('is-returned');
  });
  treeSvg.querySelectorAll('.tree-edge').forEach(edge => {
    if (finalEdges.has(edge.dataset.edge)) edge.classList.add('is-solution');
  });
  showSolutionPath(finalPath);
  journeyFill.style.width = '100%';

  for (const position of finalPath.slice(1)) {
    if (thisReplay !== treeReplayId) return;
    document.querySelectorAll('.cell.current').forEach(cell => {
      cell.classList.remove('current');
      cell.classList.add('explored');
    });
    if (!await moveCat(...position, 'solution') || thisReplay !== treeReplayId) return;
    cells.get(key(...position))?.classList.add('current');
    highlightTreePosition(key(...position));
    if (treeMatchNote) treeMatchNote.textContent = `沿最短路线行走 · 当前位置 ${treePositionNumbers.get(key(...position))}。`;
    if (!await playbackWait(70, () => thisReplay === treeReplayId)) return;
  }

  if (thisReplay !== treeReplayId) return;
  revealUnsearchedTree(new Set(bfsOrder.slice(0, bfsReplayIndex + 1)));
  reactCat('found');
  stepNumber.textContent = '03';
  phaseLabel.textContent = '发现';
  progressLabel.textContent = '最短路线被找到了';
  narrationLabel.textContent = '搜索完成 · 最短路线';
  setBfsMessage(`每步代价相同，BFS 按距离逐层检查，找到 ${treePositionNumbers.get(MAIN_GOAL_KEY)} 时确定 ${finalPath.length - 1} 步最短路线。灰色虚线节点未探索。`);
  treeAutoPlaying = false;
  treeStepBusy = false;
  mode = 'tree-complete';
  highlightTreePosition(MAIN_GOAL_KEY);
  if (treeMatchNote && treeSvg.querySelector('.tree-node.is-unsearched')) treeMatchNote.textContent = '找到小鱼后停止；灰色虚线是未探索参照，不代表已搜索。';
  showPlaybackControls('tree', { step: false, running: false });
  demoPauseButton.disabled = true;
  nextStepButton.hidden = false;
  nextStepButton.disabled = false;
  nextStepButton.querySelector('span').textContent = '进入挑战';
  replayTreeButton.disabled = false;
  markChapterComplete(3);
}

async function advanceBfsStep(thisReplay = treeReplayId, automatic = false) {
  if (thisReplay !== treeReplayId || treeStepBusy || bfsReplayIndex >= bfsOrder.length - 1) return false;
  treeStepBusy = true;
  nextStepButton.disabled = true;
  const nextIndex = bfsReplayIndex + 1;
  const cellKey = bfsOrder[nextIndex];
  const parentKey = bfsParents.get(cellKey);
  cells.forEach(cell => cell.classList.remove('bfs-current'));
  const moved = await animateBfsVisit(parentKey, cellKey);
  if (!moved || thisReplay !== treeReplayId) return false;

  bfsReplayIndex = nextIndex;
  activateTreeNode(cellKey);
  treeSvg.querySelector(`[data-node="${cellKey}"]`)?.classList.add('is-bfs-visited');
  treeSvg.querySelector(`[data-edge="${parentKey}|${cellKey}"]`)?.classList.add('is-bfs-visited');
  revealBfsFrontier(cellKey);
  journeyFill.style.width = `${(bfsReplayIndex / (bfsOrder.length - 1)) * 100}%`;
  stepNumber.textContent = String(Math.min(bfsReplayIndex + 1, 99)).padStart(2, '0');

  if (cellKey === MAIN_GOAL_KEY) {
    await finishBfsReplay(thisReplay);
    return true;
  }

  if (bfsReplayIndex >= bfsOrder.length - 1) {
    finishIncompleteTreeReplay('本轮 BFS 已检查完所有可到达的位置，但没有找到目标路线。');
    return true;
  }
  treeStepBusy = false;
  if (!automatic) nextStepButton.disabled = false;
  return true;
}

async function runBfsReplay({ restart = false } = {}) {
  const thisReplay = restart ? prepareBfsReplay() : treeReplayId;
  const runToken = ++treeReplayRunToken;
  treeAutoPlaying = true;
  showPlaybackControls('tree', { step: true, running: true });
  playbackStepButton.disabled = true;
  replayTreeButton.disabled = true;
  nextStepButton.disabled = true;
  if (bfsReplayIndex === 0) {
    narrationLabel.textContent = '按距离逐层检查';
    setBfsMessage('先检查第 1 层，再检查第 2 层；当前层检查完才进入下一层。');
  }
  if (!await playbackWait(2100, () => thisReplay === treeReplayId && runToken === treeReplayRunToken)) return;
  while (thisReplay === treeReplayId && runToken === treeReplayRunToken && bfsReplayIndex < bfsOrder.length - 1) {
    if (!await waitForDemoResume(runId)) return;
    await advanceBfsStep(thisReplay, true);
    if (thisReplay !== treeReplayId || runToken !== treeReplayRunToken || bfsOrder[bfsReplayIndex] === MAIN_GOAL_KEY) return;
    if (!await playbackWait(bfsReadingHold(), () => thisReplay === treeReplayId && runToken === treeReplayRunToken)) return;
  }
}

function prepareTreeReplay() {
  return treeAlgorithm === 'bfs' ? prepareBfsReplay() : prepareDfsReplay();
}

function advanceTreeStep(thisReplay = treeReplayId, automatic = false) {
  return treeAlgorithm === 'bfs'
    ? advanceBfsStep(thisReplay, automatic)
    : advanceDfsStep(thisReplay, automatic);
}

function runTreeReplay(options = {}) {
  return treeAlgorithm === 'bfs' ? runBfsReplay(options) : runDfsReplay(options);
}

function startTreeLesson() {
  resetDemoControls();
  updateChapterMap(3);
  startDemoButton.hidden = true;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  replayTreeButton.hidden = true;
  restartButton.hidden = true;
  nextStepButton.hidden = true;
  treeShell.hidden = false;
  legend.hidden = true;
  viewSwitch.hidden = false;
  algorithmSwitch.hidden = false;
  thinkingPrompt.hidden = false;
  searchOrderCard.hidden = true;
  stage.classList.add('stage--tree');
  setTreeView('compare');
  treeAlgorithm = 'dfs';
  chapterNumber.textContent = '03';
  chapterLabel.textContent = '看见探索树';
  updateAlgorithmCopy();
  prepareTreeReplay();
  if (mode === 'tree-incomplete') {
    showPlaybackControls('tree', { step: false, running: false });
    demoPauseButton.disabled = true;
  } else {
    showPlaybackControls('tree', { step: true, running: false, replay: false });
    playbackStepButton.disabled = false;
  }
  window.requestAnimationFrame(pinDesktopViewport);
}

function nextDfsPracticeAction() {
  const current = practicePath.at(-1);
  if (!current || key(...current) === MAIN_GOAL_KEY) return null;
  for (const { offset, label } of DFS_DEMO_DIRECTION_ORDER) {
    const position = [current[0] + offset[0], current[1] + offset[1]];
    if (practiceOpenCells.has(key(...position)) && !practiceExplored.has(key(...position))) {
      return { position, kind: 'forward', label };
    }
  }
  const previous = practicePath.at(-2);
  return previous ? { position: [...previous], kind: 'back' } : null;
}

function updatePracticePrompt() {
  clearChoices();
  const currentPosition = practicePath.at(-1);
  const action = nextDfsPracticeAction();
  journeyFill.style.width = `${(practiceExplored.size / practiceOpenCells.size) * 100}%`;
  stepNumber.textContent = String(practiceIndex + 1).padStart(2, '0');
  narrationLabel.textContent = '按 DFS 规则探索';
  if (action) {
    cells.get(key(...action.position))?.classList.add('choice', action.kind === 'back' ? 'choice--back' : 'choice--unknown');
  }
  if (action?.kind === 'back') {
    markDeadEnd(cells.get(key(...currentPosition)));
    setMessage('这里没有未走过的新路。沿原路退回上一步，再按顺序检查。');
  } else if (action) {
    setMessage('按右→上→左→下检查；选择第一条能走、且没有走过的新路。');
  } else {
    setMessage('所有可到达的位置已探索完，当前没有找到小鱼。');
  }
}

function finishPractice() {
  mode = 'complete';
  practiceBusy = false;
  clearChoices();
  revealFullMaze();
  showSolutionPath(practicePath);
  journeyFill.style.width = '100%';
  phaseLabel.textContent = '完成';
  chapterNumber.textContent = '02';
  chapterLabel.textContent = '我的探索';
  progressLabel.textContent = '探索完成';
  narrationLabel.textContent = '你发现了什么？';
  setMessage('完成了！你按 DFS 规则优先走新路，没有新路时沿原路回退，帮助小猫找到了小鱼。');
  lessonTitle.innerHTML = '你带小猫<br>找到了小鱼';
  stageDescription.textContent = '蓝色格子记录了 DFS 探索过程，金色是最终通向小鱼的路线。DFS 能找到目标，但不保证路线最短。';
  startTreeButton.hidden = false;
  restartButton.hidden = true;
  markChapterComplete(2);
  reactCat('found');
}

async function moveInPractice(target, kind) {
  practiceBusy = true;
  clearChoices();
  const currentCell = cells.get(key(...previousPosition));
  currentCell.classList.remove('current');
  currentCell.classList.add('explored');

  const token = runId;
  const epoch = motionEpoch;
  if (!await moveCat(...target, kind) || token !== runId || epoch !== motionEpoch || mode !== 'practice') return;
  const targetCell = cells.get(key(...target));
  targetCell.classList.add('current');
  revealAround(target);
  practiceIndex += 1;

  if (key(...target) === MAIN_GOAL_KEY) {
    finishPractice();
    return;
  }

  practiceBusy = false;
  updatePracticePrompt();
}

function schedulePracticeFeedback(callback, ms) {
  const token = runId;
  const epoch = motionEpoch;
  const timer = window.setTimeout(() => {
    practiceFeedbackTimers.delete(timer);
    if (token !== runId || epoch !== motionEpoch || mode !== 'practice') return;
    callback();
  }, ms);
  practiceFeedbackTimers.add(timer);
}

function handleCellChoice(row, column) {
  if (mode !== 'practice' || practiceBusy) return;
  const chosen = [row, column];
  const current = practicePath.at(-1);
  const previous = practicePath.at(-2);
  const chosenCell = cells.get(key(row, column));
  if (!chosenCell) return;

  if (!isAdjacent(current, chosen)) {
    chosenCell.classList.add('choice-error');
    reactCat('dead');
    setMessage('只能检查小猫身边的格子。请从相邻的未知区域中选择。');
    schedulePracticeFeedback(() => chosenCell.classList.remove('choice-error'), 420);
    return;
  }

  if (!practiceOpenCells.has(key(row, column))) {
    practiceBusy = true;
    revealFogCell(row, column);
    chosenCell.classList.add('choice-error');
    reactCat('dead');
    setMessage('碰壁：迷雾散开后发现这里是障碍物，请换一个相邻方向继续检查。');
    schedulePracticeFeedback(() => {
      chosenCell.classList.remove('choice-error');
      practiceBusy = false;
      updatePracticePrompt();
    }, 520);
    return;
  }

  const expected = nextDfsPracticeAction();
  if (!expected || !positionsMatch(chosen, expected.position)) {
    chosenCell.classList.add('choice-error');
    narrationLabel.textContent = '再想想 DFS 的规则';
    const backChosen = previous && positionsMatch(chosen, previous);
    setBfsMessage(expected?.kind === 'forward'
      ? backChosen ? `还有未走过的新路，不能提前回退。按右→上→左→下，应先向${expected.label}走。`
        : practiceExplored.has(key(...chosen)) ? `这个位置已走过，不能再次绕入。应先向${expected.label}走未探索的新路。`
        : `这条路能走，但不是当前优先方向。按右→上→左→下，应先向${expected.label}走。`
      : expected?.kind === 'back' ? '这里没有新路，只能沿原路退回上一步，不能跳到其他已走过的位置。'
        : '当前没有可以继续探索的方向。');
    schedulePracticeFeedback(() => chosenCell.classList.remove('choice-error'), 520);
    return;
  }

  if (expected.kind === 'back') {
    practicePath.pop();
    explorationMoves.push({ from: [...current], to: [...chosen], kind: 'back', discovered: false });
    return moveInPractice(chosen, 'back');
  }

  const chosenKey = key(row, column);
  revealFogCell(row, column);
  explorationParents.set(chosenKey, key(...current));
  explorationOrder.push(chosenKey);
  practicePath.push(chosen);
  practiceExplored.add(chosenKey);
  explorationMoves.push({ from: [...current], to: [...chosen], kind: 'forward', discovered: true });
  return moveInPractice(chosen, 'forward');
}

function setSearchRuleCopy() {
  searchOrderCard.innerHTML = demoRuleCardHtml;
}

function startPractice({ resume = false } = {}) {
  const keepRecord = resume && practiceStarted && practicePath.length > 0 && !positionsMatch(practicePath.at(-1), MAIN_GOAL);
  runId += 1;
  resetDemoControls();
  updateChapterMap(2);
  mode = 'practice';
  practiceBusy = false;
  if (!keepRecord) {
    practiceIndex = 0;
    practiceExplored = new Set([MAIN_START_KEY]);
    practicePath = [[...MAIN_START]];
    explorationMoves = [];
    explorationParents = new Map();
    explorationOrder = [MAIN_START_KEY];
  }
  practiceStarted = true;
  dfsReplayRecord = null;
  treeReplayId += 1;
  previousPosition = [...practicePath.at(-1)];
  startDemoButton.hidden = true;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  replayTreeButton.hidden = true;
  nextStepButton.hidden = true;
  restartButton.hidden = false;
  treeShell.hidden = true;
  legend.hidden = false;
  viewSwitch.hidden = true;
  algorithmSwitch.hidden = true;
  thinkingPrompt.hidden = true;
  searchOrderCard.hidden = false;
  setSearchRuleCopy();
  stage.classList.remove('stage--tree', 'stage--bfs');
  delete stage.dataset.view;
  buildMaze();
  if (keepRecord) {
    practiceExplored.forEach(cellKey => {
      cells.get(cellKey)?.classList.add('explored');
      revealAround(cellKey.split('-').map(Number));
    });
  }
  cells.get(key(...previousPosition)).append(cat);
  cells.get(key(...previousPosition)).classList.add('current');
  cat.style.setProperty('--facing', 1);
  startCatIdle();
  stageKicker.textContent = keepRecord ? '继续刚才的探索' : '轮到你来探索';
  lessonTitle.innerHTML = '新的迷宫<br>由你来探索';
  stageDescription.textContent = '按右→上→左→下选择第一条未走过的新路；没有新路才沿原路回退。走错顺序会提醒，小猫留在原位。';
  chapterNumber.textContent = '02';
  chapterLabel.textContent = '自己探索迷宫';
  phaseLabel.textContent = '探索';
  narrationLabel.textContent = '先检查哪个方向？';
  progressLabel.textContent = '你的探索进度';
  updatePracticePrompt();
}

async function runDemo() {
  const thisRun = ++runId;
  mode = 'demo';
  showPlaybackControls('demo', { step: false, running: true });
  startDemoButton.hidden = true;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  replayTreeButton.hidden = true;
  nextStepButton.hidden = true;
  algorithmSwitch.hidden = true;
  thinkingPrompt.hidden = true;
  searchOrderCard.hidden = false;
  restartButton.hidden = true;
  stageKicker.textContent = '第一次找路';
  lessonTitle.innerHTML = '先看看小猫<br>会怎样选择';
  stageDescription.textContent = '目标在右下角，但路线未知。小猫每到一个新格子，才会看清周围并按优先级检查道路。';
  phaseLabel.textContent = '准备';
  narrationLabel.textContent = '正在发生什么？';
  progressLabel.textContent = `顺序：${DFS_DEMO_ORDER_TEXT}`;
  chapterNumber.textContent = '01';
  chapterLabel.textContent = '观察小猫找路';
  const explored = new Set();
  previousPosition = [...MAIN_START];
  buildMaze();
  stepNumber.textContent = '01';
  journeyFill.style.width = '4%';

  await demoWait(650, thisRun);
  for (let index = 0; index < journey.length; index += 1) {
    if (thisRun !== runId || !await waitForDemoResume(thisRun)) return;
    const step = journey[index];
    const [row, column] = step.at;
    const current = cells.get(key(row, column));
    revealAround(step.at);
    document.querySelectorAll('.cell.current').forEach(cell => {
      cell.classList.remove('current');
      cell.classList.add('explored');
    });

    if (!await moveCat(row, column, step.kind) || thisRun !== runId) return;
    current.classList.add('current');
    if (step.kind === 'back') current.classList.add('demo-returned');
    explored.add(key(row, column));
    journeyFill.style.width = `${Math.max(4, ((index + 1) / journey.length) * 100)}%`;
    stepNumber.textContent = String(index + 1).padStart(2, '0');
    phaseLabel.textContent = {
      start: '定序',
      forward: '试探',
      dead: '碰壁',
      back: '回退',
      found: '找到'
    }[step.kind];
    setNarration(step.kind);

    if (step.kind === 'dead') {
      markDeadEnd(current);
      if (!await demoWait(1050, thisRun)) return;
    } else if (step.kind === 'found') {
      if (!await demoWait(480, thisRun)) return;
      revealFullMaze();
      phaseLabel.textContent = '全图';
      narrationText.textContent = '探索完成，迷雾正在散去：现在可以把走过的分支、碰壁位置和整座迷宫放在一起观察。';
      if (!await demoWait(720, thisRun)) return;
      showSolutionPath();
      narrationText.textContent = '金色路线是最终通向小鱼的正确路径；带“×”的分支记录了试探失败，褐色格子则保留了沿原路回退的痕迹。';
      showPlaybackControls('demo', { step: false, running: false });
      demoPauseButton.disabled = true;
      startPracticeButton.hidden = false;
      markChapterComplete(1);
      reactCat('found');
      return;
    } else {
      if (!await demoWait(step.kind === 'start' ? 950 : 430, thisRun)) return;
    }
  }
}

function prepareDemo() {
  setSearchRuleCopy();
  runId += 1;
  resetDemoControls();
  updateChapterMap(1);
  mode = 'ready';
  previousPosition = [...MAIN_START];
  buildMaze();
  cells.get(MAIN_START_KEY).append(cat);
  cells.get(MAIN_START_KEY).classList.add('current');
  cat.style.setProperty('--facing', 1);
  startCatIdle();
  stepNumber.textContent = '01';
  phaseLabel.textContent = '准备';
  journeyFill.style.width = '0%';
  stageKicker.textContent = '第一次找路';
  lessonTitle.innerHTML = '先看看小猫<br>会怎样选择';
  stageDescription.textContent = '目标在右下角，但路线未知。小猫每到一个新格子，才会看清周围并按优先级检查道路。';
  searchOrderCard.hidden = false;
  narrationLabel.textContent = '演示规则';
  narrationText.textContent = `迷雾中只看得见起点和目标。每到一个新格子，都从“${DFS_DEMO_ORDER_TEXT}”重新检查周围；探索结束后再展开完整地图。`;
  progressLabel.textContent = `顺序：${DFS_DEMO_ORDER_TEXT}`;
  startDemoButton.hidden = false;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  replayTreeButton.hidden = true;
  nextStepButton.hidden = true;
  restartButton.hidden = true;
  treeShell.hidden = true;
  legend.hidden = false;
  viewSwitch.hidden = true;
  algorithmSwitch.hidden = true;
  thinkingPrompt.hidden = true;
  stage.classList.remove('stage--tree', 'stage--bfs');
  delete stage.dataset.view;
  chapterNumber.textContent = '01';
  chapterLabel.textContent = '观察小猫找路';
}

function showIntro() {
  runId += 1;
  resetDemoControls();
  updateChapterMap(0);
  treeReplayId += 1;
  challengeRunId += 1;
  resetMotion();
  mode = 'intro';
  lesson.classList.add('is-intro');
  lesson.classList.remove('is-summary');
  introStage.hidden = false;
  stage.hidden = true;
  challengeStage.hidden = true;
  summaryStage.hidden = true;
  startDemoButton.hidden = true;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  replayTreeButton.hidden = true;
  restartButton.hidden = true;
  nextStepButton.hidden = true;
  chapterNumber.textContent = '00';
  chapterLabel.textContent = '课程导入';
}

function enterLesson() {
  lesson.classList.remove('is-intro', 'is-summary');
  introStage.hidden = true;
  summaryStage.hidden = true;
  stage.hidden = false;
  challengeStage.hidden = true;
  prepareDemo();
}

function updateSummaryResult() {
  const correctCount = summaryTasks.filter(item => item.classList.contains('is-correct')).length;
  summaryScore.textContent = String(correctCount);
  const allCorrect = summaryTasks.length > 0 && correctCount === summaryTasks.length;
  if (allCorrect) markChapterComplete(5);
}

function resetSummaryTasks() {
  summaryTasks.forEach(task => {
    task.classList.remove('is-correct', 'is-wrong');
    task.querySelectorAll('[data-summary-choice]').forEach(button => {
      button.disabled = false;
      button.setAttribute('aria-pressed', 'false');
    });
    const feedback = task.querySelector('.task-feedback');
    if (task.dataset.summaryTask === 'warehouse') feedback.textContent = '选择一种方法，看看它是否满足任务要求。';
    else feedback.textContent = '“最少”是这道任务的重要线索。';
  });
  updateSummaryResult();
}

function answerSummaryTask(task, choice) {
  if (!task || !['dfs', 'bfs'].includes(choice)) return;
  const expectedAnswers = task.dataset.answer.split(',');
  const feedback = task.querySelector('.task-feedback');
  task.classList.remove('is-correct', 'is-wrong');
  task.querySelectorAll('[data-summary-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.summaryChoice === choice));
  });

  if (!expectedAnswers.includes(choice)) {
    void task.offsetWidth;
    task.classList.add('is-wrong');
    feedback.textContent = expectedAnswers.includes('bfs')
      ? '再找一找题目里的“最少”线索：从近到远逐层搜索更合适。'
      : '这次不比较长短，只要找到一种办法；可以先沿一条分支深入。';
    updateSummaryResult();
    return;
  }

  task.classList.add('is-correct');
  if (expectedAnswers.length > 1) {
    feedback.textContent = choice === 'dfs'
      ? '可以。DFS 会先沿一条分支深入，可能较早找到一个可用充电点；但题干不能保证它一定更快。'
      : '也可以。BFS 会从近到远逐层检查，同样能找到充电点；但“不要求最近”时，它的最短步数优势不是必要条件。';
  } else {
    feedback.textContent = expectedAnswers[0] === 'bfs'
      ? '选择正确：每走一段路都算一步，BFS 逐层检查，第一次找到目标时对应路线的总步数最少。'
      : '选择正确：只需一条可行路线时，可以考虑 DFS。';
  }
  updateSummaryResult();
}

function showSummary() {
  runId += 1;
  resetDemoControls();
  updateChapterMap(5);
  treeReplayId += 1;
  challengeRunId += 1;
  resetMotion();
  mode = 'summary';
  lesson.classList.remove('is-intro');
  lesson.classList.add('is-summary');
  introStage.hidden = true;
  stage.hidden = true;
  challengeStage.hidden = true;
  summaryStage.hidden = false;
  startDemoButton.hidden = true;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  replayTreeButton.hidden = true;
  restartButton.hidden = true;
  nextStepButton.hidden = true;
  chapterNumber.textContent = '05';
  chapterLabel.textContent = '学习总结';
  resetSummaryTasks();
  window.scrollTo(0, 0);
}

function challengeNeighbors(position, algorithm = 'bfs') {
  const [row, column] = position;
  const directions = algorithm === 'dfs'
    ? [[-1, 0], [0, -1], [0, 1], [1, 0]]
    : [[-1, 0], [0, 1], [0, -1], [1, 0]];
  return directions
    .map(([rowStep, columnStep]) => [row + rowStep, column + columnStep])
    .filter(next => challengeOpenCells.has(key(...next)));
}

function pathFromParents(parents, goalKey = '0-5') {
  const path = [];
  let current = goalKey;
  while (current) {
    path.unshift(current.split('-').map(Number));
    current = parents.get(current);
  }
  return path;
}

function createDfsChallengeSearch() {
  const visited = new Set();
  const parents = new Map();
  const order = [];
  const events = [];

  function explore(position) {
    const currentKey = key(...position);
    visited.add(currentKey);
    order.push(currentKey);
    if (currentKey === '0-5') return true;

    for (const next of challengeNeighbors(position, 'dfs')) {
      const nextKey = key(...next);
      if (visited.has(nextKey)) continue;
      parents.set(nextKey, currentKey);
      events.push({ type: 'forward', from: position, to: next });
      if (explore(next)) return true;
      events.push({ type: 'back', from: next, to: position });
    }
    return false;
  }

  explore([5, 0]);
  return { algorithm: 'dfs', order, events, path: pathFromParents(parents) };
}

function createBfsChallengeSearch() {
  const queue = [[5, 0]];
  const visited = new Set(['5-0']);
  const parents = new Map();
  const order = [];

  while (queue.length) {
    const current = queue.shift();
    const currentKey = key(...current);
    order.push(currentKey);
    if (currentKey === '0-5') break;
    challengeNeighbors(current, 'bfs').forEach(next => {
      const nextKey = key(...next);
      if (visited.has(nextKey)) return;
      visited.add(nextKey);
      parents.set(nextKey, currentKey);
      queue.push(next);
    });
  }
  return { algorithm: 'bfs', order, parents, path: pathFromParents(parents) };
}

function setChallengeCatFrame(index = 0) {
  const frame = document.querySelector('#challenge-cat .challenge-cat-frame');
  if (!frame) return;
  const column = index % 4;
  const row = Math.floor(index / 4);
  frame.style.backgroundPosition = `${(column / 3) * 100}% ${row * 100}%`;
}

function stopChallengeCatMotion() {
  const settle = settleChallengeMotion;
  settleChallengeMotion = null;
  challengeCatIdleTimeline?.kill();
  challengeCatMotionTimeline?.kill();
  challengeCatReactionTimeline?.kill();
  challengeCatIdleTimeline = null;
  challengeCatMotionTimeline = null;
  challengeCatReactionTimeline = null;
  settle?.(false);
}

function startChallengeCatIdle() {
  challengeCatIdleTimeline?.kill();
  const challengeCat = document.querySelector('#challenge-cat');
  const pose = challengeCat?.querySelector('.challenge-cat-pose');
  if (!challengeCat || !pose) return;
  challengeCat.dataset.action = 'idle';
  setChallengeCatFrame(0);
  if (!window.gsap || reducedMotion() || document.hidden) return;
  gsap.set(pose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
  challengeCatIdleTimeline = gsap.timeline({ repeat: -1, repeatDelay: .2 })
    .to(pose, { y: -2, rotation: .7, scaleX: 1.015, scaleY: .985, duration: .85, ease: 'sine.inOut' })
    .to(pose, { y: 0, rotation: -.4, scaleX: 1, scaleY: 1, duration: .85, ease: 'sine.inOut' })
    .call(() => setChallengeCatFrame(1), [], 1.38)
    .call(() => setChallengeCatFrame(0), [], 1.58)
    .to(pose, { rotation: 0, duration: .25, ease: 'sine.out' });
}

function celebrateChallengeCat() {
  challengeCatIdleTimeline?.kill();
  challengeCatReactionTimeline?.kill();
  const challengeCat = document.querySelector('#challenge-cat');
  const pose = challengeCat?.querySelector('.challenge-cat-pose');
  if (!challengeCat || !pose) return;
  challengeCat.dataset.action = 'found';
  setChallengeCatFrame(7);
  if (!window.gsap || reducedMotion()) return;
  challengeCatReactionTimeline = gsap.timeline({ onComplete: () => {
    challengeCat.dataset.action = 'friends';
    setChallengeCatFrame(5);
  }});
  challengeCatReactionTimeline.timeScale(demoSpeed);
  challengeCatReactionTimeline
    .to(pose, { y: 3, scaleY: .82, scaleX: 1.1, duration: .12, ease: 'power2.in' })
    .to(pose, { y: -16, rotation: -5, scaleY: 1.08, scaleX: .94, duration: .23, ease: 'power3.out' })
    .to(pose, { y: 0, rotation: 3, scaleX: 1.04, scaleY: .92, duration: .23, ease: 'power2.in' })
    .to(pose, { y: -8, rotation: 5, scaleX: .98, scaleY: 1.03, duration: .17, ease: 'power2.out' })
    .to(pose, { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .28, ease: 'bounce.out' });
}

function buildChallengeMaze() {
  stopChallengeCatMotion();
  challengeMaze.innerHTML = '';
  challengeCells.clear();
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      const cellKey = key(row, column);
      const cell = document.createElement('div');
      cell.className = `cell ${challengeOpenCells.has(cellKey) ? 'path' : 'wall'}`;
      cell.dataset.cell = cellKey;
      if (cellKey === '0-5') {
        const fish = document.createElement('img');
        fish.className = 'fish-sprite';
        fish.src = './assets/fish-maze-low-poly.png';
        fish.alt = '目标小鱼';
        cell.append(fish);
      }
      challengeMaze.append(cell);
      challengeCells.set(cellKey, cell);
    }
  }

  const challengeCat = document.createElement('span');
  challengeCat.id = 'challenge-cat';
  challengeCat.className = 'challenge-cat';
  challengeCat.setAttribute('role', 'img');
  challengeCat.setAttribute('aria-label', '正在挑战新迷宫的低多边形小猫');
  challengeCat.dataset.action = 'idle';
  challengeCat.innerHTML = '<span class="challenge-cat-pose" aria-hidden="true"><span class="challenge-cat-frame"></span></span>';
  challengeCat.style.setProperty('--challenge-facing', 1);
  challengeCells.get('5-0').append(challengeCat);
  challengeCells.get('5-0').classList.add('challenge-current');
  challengePreviousPosition = [5, 0];
  setChallengeCatFrame(0);
  startChallengeCatIdle();
}

async function moveChallengeCat(position, runToken, fast = false, action = 'forward') {
  if (runToken !== challengeRunId) return false;
  challengeCatIdleTimeline?.kill();
  challengeCatReactionTimeline?.kill();
  const challengeCat = document.querySelector('#challenge-cat');
  const pose = challengeCat?.querySelector('.challenge-cat-pose');
  const target = challengeCells.get(key(...position));
  const oldRect = challengeCat?.getBoundingClientRect();
  target?.append(challengeCat);
  if (!challengeCat || !target || !pose) return false;

  const movingLeft = position[1] < challengePreviousPosition[1];
  challengeCat.style.setProperty('--challenge-facing', movingLeft ? -1 : 1);
  challengeCat.dataset.action = action;
  setChallengeCatFrame(action === 'back' ? 3 : fast ? 2 : 2);
  challengePreviousPosition = [...position];

  if (reducedMotion() || !window.gsap || !oldRect) {
    setChallengeCatFrame(action === 'back' ? 3 : 0);
    if (action !== 'back') startChallengeCatIdle();
    return true;
  }

  const nextRect = challengeCat.getBoundingClientRect();
  const dx = oldRect.left - nextRect.left;
  const dy = oldRect.top - nextRect.top;
  const moved = await new Promise(resolve => {
    let settled = false;
    const settle = completed => {
      if (settled) return;
      settled = true;
      if (settleChallengeMotion === settle) settleChallengeMotion = null;
      resolve(completed);
    };
    settleChallengeMotion = settle;
    challengeCatMotionTimeline = gsap.timeline({ onComplete: () => settle(true) });
    challengeCatMotionTimeline.timeScale(demoSpeed);
    challengeCatMotionTimeline.fromTo(challengeCat,
      { x: dx, y: dy },
      { x: 0, y: 0, duration: fast ? .19 : action === 'back' ? .24 : .3, ease: action === 'back' ? 'power2.in' : 'power2.inOut' }, 0);
    if (action === 'back') {
      challengeCatMotionTimeline
        .to(pose, { x: -5, y: 2, rotation: -7, scaleX: .95, scaleY: .92, duration: .11, ease: 'power2.out' }, 0)
        .to(pose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .13, ease: 'power2.in' }, .11);
    } else {
      challengeCatMotionTimeline
        .to(pose, { x: 3, y: fast ? -5 : -8, rotation: 5, scaleX: 1.04, scaleY: .91, duration: fast ? .08 : .12, ease: 'power2.out' }, 0)
        .call(() => setChallengeCatFrame(3), [], fast ? .08 : .12)
        .to(pose, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: fast ? .11 : .18, ease: 'bounce.out' }, fast ? .08 : .12);
    }
  });
  if (!moved || runToken !== challengeRunId) return false;
  setChallengeCatFrame(action === 'back' ? 3 : 0);
  if (action !== 'back') startChallengeCatIdle();
  return true;
}

function clearChallengeSearchMarks() {
  challengeCells.forEach(cell => {
    cell.classList.remove('challenge-visited', 'challenge-returned', 'challenge-bfs', 'challenge-current', 'challenge-goal-found');
    cell.querySelectorAll('.solution-mark, .dead-mark').forEach(mark => mark.remove());
  });
}

function showChallengeSolution(path) {
  path.forEach((position, index) => {
    const cell = challengeCells.get(key(...position));
    const marker = document.createElement('span');
    marker.className = 'solution-mark';
    marker.style.animationDelay = `${index * 45}ms`;
    marker.setAttribute('aria-hidden', 'true');
    const center = document.createElement('b');
    marker.append(center);
    [path[index - 1], path[index + 1]].filter(Boolean).forEach(neighbor => {
      const line = document.createElement('i');
      line.className = `to-${direction(position, neighbor)}`;
      marker.append(line);
    });
    cell?.append(marker);
  });
}

async function animateDfsChallenge(search, runToken) {
  for (let index = 0; index < search.events.length; index += 1) {
    if (runToken !== challengeRunId || !await waitForDemoResume(runId) || runToken !== challengeRunId) return false;
    const event = search.events[index];
    challengeCells.forEach(cell => cell.classList.remove('challenge-current'));
    const fromCell = challengeCells.get(key(...event.from));
    const targetCell = challengeCells.get(key(...event.to));
    if (event.type === 'back') fromCell?.classList.add('challenge-returned');
    else targetCell?.classList.add('challenge-visited');
    targetCell?.classList.add('challenge-current');
    if (!await moveChallengeCat(event.to, runToken, event.type === 'back', event.type) || runToken !== challengeRunId) return false;
    journeyFill.style.width = `${((index + 1) / search.events.length) * 92}%`;
    setMessage(event.type === 'back'
      ? '这条路没有找到目标，DFS 回到最近还有其他选择的位置。'
      : 'DFS 选定一条支路继续深入探索。');
    if (!await playbackWait(reducedMotion() ? 0 : 75, () => runToken === challengeRunId)) return false;
  }
  return true;
}

async function animateBfsChallenge(search, runToken) {
  const currentRun = () => runToken === challengeRunId;
  for (let index = 0; index < search.order.length; index += 1) {
    if (!currentRun() || !await waitForDemoResume(runId) || !currentRun()) return false;
    const cellKey = search.order[index];
    const depth = topologyDepth(cellKey, search.parents);
    const nextKey = search.order[index + 1];
    const nextDepth = nextKey ? topologyDepth(nextKey, search.parents) : depth;
    const layerOrder = search.order.filter(item => topologyDepth(item, search.parents) === depth);
    const layerIndex = layerOrder.indexOf(cellKey) + 1;
    challengeCells.forEach(cell => cell.classList.remove('challenge-current'));
    challengeCells.get(cellKey)?.classList.add('challenge-bfs', 'challenge-current');
    journeyFill.style.width = `${((index + 1) / search.order.length) * 78}%`;
    narrationLabel.textContent = `第 ${depth} 层 · 检查 ${layerIndex}/${layerOrder.length}`;
    setBfsMessage(cellKey === '0-5'
      ? `找到小鱼：每步代价相同，最短路线为 ${search.path.length - 1} 步。`
      : nextDepth > depth ? `第 ${depth} 层检查完毕；下一步进入第 ${nextDepth} 层。`
      : `检查与起点相距 ${depth} 步的位置；本层检查完才进入下一层。`);
    if (!await playbackWait(nextDepth > depth ? 2000 : 1300, currentRun)) return false;
  }

  if (!currentRun()) return false;
  showChallengeSolution(search.path);
  narrationLabel.textContent = '搜索结束 · 沿最短路线行走';
  setBfsMessage(`金色路线共 ${search.path.length - 1} 步。蓝色记录搜索检查；现在小猫才开始沿路线行走。`);
  if (!await playbackWait(2400, currentRun)) return false;
  for (const position of search.path.slice(1)) {
    if (!currentRun() || !await waitForDemoResume(runId) || !currentRun()) return false;
    challengeCells.forEach(cell => cell.classList.remove('challenge-current'));
    challengeCells.get(key(...position))?.classList.add('challenge-current');
    if (!await moveChallengeCat(position, runToken, true, 'forward') || !currentRun()) return false;
  }
  return true;
}

function challengeFeedbackCopy(algorithm) {
  if (algorithm === 'bfs') {
    return '任务完成。每一步代价相同时，BFS 第一次找到目标，就得到了步数最少的路线。';
  }
  return '小猫找到了目标，但任务还没有完成：DFS 不能保证第一条路线就是步数最少的路线。';
}

function showChallengeResult(search) {
  const result = {
    checked: search.order.length,
    steps: search.path.length - 1,
    shortest: search.algorithm === 'bfs'
  };
  challengeResultsByAlgorithm[search.algorithm] = result;
  challengeGuide.hidden = true;
  challengeResults.hidden = false;
  challengeResultTitle.textContent = `${search.algorithm.toUpperCase()} 探索结果`;
  resultMetrics.innerHTML = `
    <div class="result-metric"><strong>${result.checked}</strong><span>检查位置</span></div>
    <div class="result-metric"><strong>${result.steps}</strong><span>路线步数</span></div>
    <div class="result-metric"><strong>${result.shortest ? '是' : '不保证'}</strong><span>保证最短</span></div>`;
  challengeFeedback.textContent = challengeFeedbackCopy(search.algorithm);

  const comparison = challengeResultsByAlgorithm;
  if (comparison.dfs && comparison.bfs) {
    markChapterComplete(4);
    resultMetrics.insertAdjacentHTML('afterend', `
      <div class="result-comparison">
        <div class="result-row"><span>方法</span><span>检查位置</span><span>路线步数</span></div>
        <div class="result-row"><span>DFS</span><span>${comparison.dfs.checked}</span><span>${comparison.dfs.steps}</span></div>
        <div class="result-row"><span>BFS</span><span>${comparison.bfs.checked}</span><span>${comparison.bfs.steps}</span></div>
      </div>`);
    challengeResultTitle.textContent = '两种方法，对照观察';
    challengeFeedback.textContent = '两种方法都找到了小鱼，但只有 BFS 能在等步长迷宫中保证这条路线的步数最少。';
    challengeCompareButton.hidden = true;
    challengeContinueButton.hidden = false;
    challengeContinueButton.textContent = '进入总结';
  } else {
    challengeCompareButton.hidden = false;
    challengeContinueButton.hidden = true;
  }
}

async function runChallenge(algorithm = challengeAlgorithm) {
  if (challengeBusy || !algorithm) return;
  challengeBusy = true;
  challengeAlgorithm = algorithm;
  showPlaybackControls('challenge', { step: false, running: true });
  const runToken = ++challengeRunId;
  buildChallengeMaze();
  clearChallengeSearchMarks();
  challengeCells.get('5-0').classList.add('challenge-current');
  challengeAlgorithmButtons.forEach(button => {
    button.disabled = true;
    button.setAttribute('aria-pressed', String(button.dataset.challengeAlgorithm === algorithm));
  });
  challengeStartButton.disabled = true;
  challengeResults.querySelector('.result-comparison')?.remove();
  challengeResults.hidden = true;
  challengeGuide.hidden = false;
  phaseLabel.textContent = algorithm.toUpperCase();
  narrationLabel.textContent = '正在执行你选择的策略';
  setMessage(algorithm === 'dfs' ? 'DFS 开始沿一条支路向深处探索。' : 'BFS 开始从起点向外逐层搜索。');
  journeyFill.style.width = '2%';

  const search = algorithm === 'dfs' ? createDfsChallengeSearch() : createBfsChallengeSearch();
  challengeBusy = true;
  try {
  const completed = algorithm === 'dfs'
    ? await animateDfsChallenge(search, runToken)
    : await animateBfsChallenge(search, runToken);
  if (!completed || runToken !== challengeRunId) return;

  if (algorithm === 'dfs') showChallengeSolution(search.path);
  challengeCells.get('0-5').classList.add('challenge-goal-found');
  celebrateChallengeCat();
  journeyFill.style.width = '100%';
  stepNumber.textContent = '04';
  phaseLabel.textContent = '对照';
  narrationLabel.textContent = '这次选择带来了什么结果？';
  if (algorithm === 'bfs') setBfsMessage(challengeFeedbackCopy(algorithm));
  else setMessage(challengeFeedbackCopy(algorithm));
  showChallengeResult(search);
  challengeBusy = false;
  showPlaybackControls('challenge', { step: false, running: false });
  demoPauseButton.disabled = true;
  restartButton.hidden = true;
  restartButton.querySelector('span').textContent = '再试一次';
  challengeAlgorithmButtons.forEach(button => { button.disabled = false; });
  } finally {
    // An old run must never release controls owned by its replacement.
    if (runToken === challengeRunId) challengeBusy = false;
  }
}

function resetChallenge() {
  challengeRunId += 1;
  playbackContext = 'none';
  demoPaused = false;
  challengeAlgorithm = null;
  challengeBusy = false;
  missionNumber.textContent = '挑战任务';
  missionTitle.textContent = '找到最少步数';
  missionCopy.textContent = '每走一格都算一步。这次必须帮助小猫找到步数最少的路线。';
  missionRule.textContent = '规则：每走一格算一步，不能穿过石头。';
  challengeGuide.hidden = false;
  challengeResults.hidden = true;
  challengeResults.querySelector('.result-comparison')?.remove();
  challengeCompareButton.hidden = false;
  challengeContinueButton.hidden = true;
  challengeAlgorithmButtons.forEach(button => {
    button.disabled = false;
    button.setAttribute('aria-pressed', 'false');
  });
  challengeChoices.hidden = false;
  challengeStartButton.hidden = false;
  challengeStartButton.disabled = true;
  challengeStartButton.textContent = '先选择一种方法';
  replayTreeButton.hidden = true;
  replayTreeButton.disabled = true;
  restartButton.hidden = true;
  buildChallengeMaze();
  journeyFill.style.width = '0%';
  phaseLabel.textContent = '选择';
  narrationLabel.textContent = '先理解任务，再选择策略';
  progressLabel.textContent = '新迷宫挑战';
  setMessage('这次需要找到步数最少的路线。根据任务要求选择更合适的搜索方法。');
}

function startChallenge() {
  runId += 1;
  resetDemoControls();
  updateChapterMap(4);
  treeReplayId += 1;
  resetMotion();
  mode = 'challenge-ready';
  lesson.classList.remove('is-intro', 'is-summary');
  introStage.hidden = true;
  summaryStage.hidden = true;
  stage.hidden = true;
  challengeStage.hidden = false;
  startDemoButton.hidden = true;
  startPracticeButton.hidden = true;
  startTreeButton.hidden = true;
  nextStepButton.hidden = true;
  replayTreeButton.hidden = true;
  restartButton.hidden = true;
  chapterNumber.textContent = '04';
  chapterLabel.textContent = '选择搜索策略';
  stepNumber.textContent = '04';
  challengeResultsByAlgorithm = {};
  resetChallenge();
}

function finishChallenge() {
  markChapterComplete(4);
  routeToChapter(5);
}

introStartButton.addEventListener('click', () => {
  markChapterComplete(0);
  routeToChapter(1);
});
summaryRestartButton.addEventListener('click', () => {
  resetChapterProgress();
  practiceStarted = false;
  dfsReplayRecord = null;
  routeToChapter(0);
});
chapterMapButtons.forEach(button => button.addEventListener('click', () => routeToChapter(Number(button.dataset.chapterTarget))));
summaryChoiceButtons.forEach(button => button.addEventListener('click', () => {
  answerSummaryTask(button.closest('[data-summary-task]'), button.dataset.summaryChoice);
}));
demoPauseButton.addEventListener('click', () => {
  if (playbackContext === 'tree' && !treeAutoPlaying) {
    runTreeReplay();
    return;
  }
  setDemoPaused(!demoPaused);
});
playbackStepButton.addEventListener('click', async () => {
  if (playbackContext !== 'tree' || treeStepBusy || (treeAutoPlaying && !demoPaused)) return;
  playbackStepButton.disabled = true;
  const pausedAutoPlay = treeAutoPlaying && demoPaused;
  const replay = treeReplayId;
  await advanceTreeStep(replay, pausedAutoPlay);
  if (replay !== treeReplayId || playbackContext !== 'tree') return;
  if (!pausedAutoPlay && playbackContext === 'tree') {
    playbackReplayButton.hidden = false;
    demoPauseButton.hidden = true;
  }
  if (mode === 'tree' && (!treeAutoPlaying || demoPaused)) playbackStepButton.disabled = false;
});
playbackReplayButton.addEventListener('click', () => {
  if (playbackContext === 'demo' || mode === 'ready' || mode === 'demo') runDemo();
  else if (playbackContext === 'tree' || mode === 'tree' || mode === 'tree-complete') runTreeReplay({ restart: true });
  else if (playbackContext === 'challenge' && challengeAlgorithm) {
    challengeRunId += 1;
    challengeBusy = false;
    runChallenge(challengeAlgorithm);
  }
});
demoSpeedButtons.forEach(button => button.addEventListener('click', () => setDemoSpeed(Number(button.dataset.demoSpeed))));
startDemoButton.addEventListener('click', runDemo);
startPracticeButton.addEventListener('click', () => routeToChapter(2));
startTreeButton.addEventListener('click', () => routeToChapter(3));
replayTreeButton.addEventListener('click', () => {
  if (mode.startsWith('challenge') && challengeAlgorithm) runChallenge(challengeAlgorithm);
  else runTreeReplay();
});
nextStepButton.addEventListener('click', () => {
  if (mode === 'tree-incomplete') routeToChapter(2, { resumePractice: true });
  else if (mode === 'tree-complete') routeToChapter(4);
  else advanceTreeStep();
});
viewButtons.forEach(button => button.addEventListener('click', () => setTreeView(button.dataset.view)));
algorithmButtons.forEach(button => button.addEventListener('click', () => setTreeAlgorithm(button.dataset.algorithm)));
thinkingToggle.addEventListener('click', () => {
  setThinkingAnswer(thinkingToggle.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stepTimeline?.pause();
    reactionTimeline?.pause();
    idleTimeline?.pause();
    reunionTimeline?.pause();
    challengeCatIdleTimeline?.pause();
    challengeCatMotionTimeline?.pause();
    challengeCatReactionTimeline?.pause();
  } else if (!demoPaused) {
    stepTimeline?.resume();
    reactionTimeline?.resume();
    reunionTimeline?.resume();
    challengeCatMotionTimeline?.resume();
    challengeCatReactionTimeline?.resume();
    if (cat.dataset.action === 'idle') startCatIdle();
    if (document.querySelector('#challenge-cat')?.dataset.action === 'idle') startChallengeCatIdle();
  }
});
document.addEventListener('focusin', () => window.requestAnimationFrame(pinDesktopViewport));
window.addEventListener('resize', pinDesktopViewport);
restartButton.addEventListener('click', () => {
  if (mode.startsWith('challenge')) {
    challengeResultsByAlgorithm = {};
    resetChallenge();
  }
  else if (mode === 'tree' || mode === 'tree-complete') prepareTreeReplay();
  else if (mode === 'practice' || mode === 'complete') startPractice();
  else runDemo();
});
challengeAlgorithmButtons.forEach(button => button.addEventListener('click', () => {
  if (challengeBusy) return;
  challengeAlgorithm = button.dataset.challengeAlgorithm;
  challengeAlgorithmButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  challengeStartButton.disabled = false;
  challengeStartButton.textContent = `使用 ${challengeAlgorithm.toUpperCase()} 开始挑战`;
}));
challengeStartButton.addEventListener('click', () => runChallenge());
challengeCompareButton.addEventListener('click', () => {
  const alternate = challengeAlgorithm === 'dfs' ? 'bfs' : 'dfs';
  challengeAlgorithm = alternate;
  runChallenge(alternate);
});
challengeContinueButton.addEventListener('click', () => {
  finishChallenge();
});
window.addEventListener('hashchange', () => routeToChapter(chapterFromHash(), { updateHash: false }));
routeToChapter(chapterFromHash(), { updateHash: false });
