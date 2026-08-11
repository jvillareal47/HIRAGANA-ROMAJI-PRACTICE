/* Merged script.js (updated per request)
   - 50 item session: 25 H2R (hiragana -> romaji), 25 R2H (romaji -> hiragana)
   - 60s per item; scoring: +10 within time, +5 after time, -1 per wrong attempt
   - separate direction scores, max 250 pts per direction (500 total)
   - local start/end times shown as time-only on certificate (no ISO)
   - Print / Save removed
*/

const kanaToRomajiMap = {
  'あ': 'a','い': 'i','う': 'u','え': 'e','お': 'o',
  'か': 'ka','き': 'ki','く': 'ku','け': 'ke','こ': 'ko',
  'が': 'ga','ぎ': 'gi','ぐ': 'gu','げ': 'ge','ご': 'go',
  'さ': 'sa','し': 'shi','す': 'su','せ': 'se','そ': 'so',
  'ざ': 'za','じ': 'ji','ず': 'zu','ぜ': 'ze','ぞ': 'zo',
  'た': 'ta','ち': 'chi','つ': 'tsu','て': 'te','と': 'to',
  'だ': 'da','ぢ': 'ji','づ': 'zu','で': 'de','ど': 'do',
  'な': 'na','に': 'ni','ぬ': 'nu','ね': 'ne','の': 'no',
  'は': 'ha','ひ': 'hi','ふ': 'fu','へ': 'he','ほ': 'ho',
  'ば': 'ba','び': 'bi','ぶ': 'bu','べ': 'be','ぼ': 'bo',
  'ぱ': 'pa','ぴ': 'pi','ぷ': 'pu','ぺ': 'pe','ぽ': 'po',
  'ま': 'ma','み': 'mi','む': 'mu','め': 'me','も': 'mo',
  'や': 'ya','ゆ': 'yu','よ': 'yo',
  'ら': 'ra','り': 'ri','る': 'ru','れ': 're','ろ': 'ro',
  'わ': 'wa','を': 'wo','ん': 'n',
  'きゃ': 'kya','きゅ': 'kyu','きょ': 'kyo',
  'しゃ': 'sha','しゅ': 'shu','しょ': 'sho',
  'ちゃ': 'cha','ちゅ': 'chu','ちょ': 'cho',
  'にゃ': 'nya','にゅ': 'nyu','にょ': 'nyo',
  'ひゃ': 'hya','ひゅ': 'hyu','ひょ': 'hyo',
  'みゃ': 'mya','みゅ': 'myu','みょ': 'myo',
  'りゃ': 'rya','りゅ': 'ryu','りょ': 'ryo',
  'ぎゃ': 'gya','ぎゅ': 'gyu','ぎょ': 'gyo',
  'じゃ': 'ja','じゅ': 'ju','じょ': 'jo',
  'びゃ': 'bya','びゅ': 'byu','びょ': 'byo',
  'ぴゃ': 'pya','ぴゅ': 'pyu','ぴょ': 'pyo',
  'ー': '-'
};

function hiraganaToRomaji(str) {
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (str[i] === 'っ') {
      if (i + 1 < str.length) {
        let nextKana = str.substr(i + 1, 2);
        let romaji = kanaToRomajiMap[nextKana];
        if (!romaji) romaji = kanaToRomajiMap[str[i + 1]];
        if (romaji) result += romaji[0];
      }
      i++;
      continue;
    }
    if (i + 1 < str.length) {
      let twoChar = str.substr(i, 2);
      if (kanaToRomajiMap[twoChar]) {
        result += kanaToRomajiMap[twoChar];
        i += 2; continue;
      }
    }
    let oneChar = str[i];
    if (kanaToRomajiMap[oneChar]) result += kanaToRomajiMap[oneChar];
    else result += oneChar;
    i++;
  }
  return result.toUpperCase();
}

// Master vocab (copied from source). romaji are uppercase to match previous behavior.
const masterVocabList = [
  { word: "だいがく", romaji: "DAIGAKU", meaning: "university" },
  { word: "えき", romaji: "EKI", meaning: "station" },
  { word: "せんせい", romaji: "SENSEI", meaning: "teacher" },
  { word: "あいます", romaji: "AIMASU", meaning: "to meet" },
  { word: "あおい", romaji: "AOI", meaning: "blue" },
  { word: "あかい", romaji: "AKAI", meaning: "red" },
  { word: "あかるい", romaji: "AKARUI", meaning: "bright" },
  { word: "あき", romaji: "AKI", meaning: "autumn" },
  { word: "あけます", romaji: "AKEMASU", meaning: "to open" },
  { word: "あさ", romaji: "ASA", meaning: "morning" },
  { word: "あさごはん", romaji: "ASAGOHAN", meaning: "breakfast" },
  { word: "あし", romaji: "ASHI", meaning: "leg, foot" },
  { word: "あした", romaji: "ASHITA", meaning: "tomorrow" },
  { word: "あたま", romaji: "ATAMA", meaning: "head" },
  { word: "あたらしい", romaji: "ATARASHII", meaning: "new" },
  { word: "あつい", romaji: "ATSUI", meaning: "hot (weather)" },
  { word: "あに", romaji: "ANI", meaning: "older brother" },
  { word: "あね", romaji: "ANE", meaning: "older sister" },
  { word: "あめ", romaji: "AME", meaning: "rain" },
  { word: "あるきます", romaji: "ARUKIMASU", meaning: "to walk" },
  { word: "いえ", romaji: "IE", meaning: "house" },
  { word: "いきます", romaji: "IKIMASU", meaning: "to go" },
  { word: "いしゃ", romaji: "ISHA", meaning: "doctor" },
  { word: "いす", romaji: "ISU", meaning: "chair" },
  { word: "いぬ", romaji: "INU", meaning: "dog" },
  { word: "いま", romaji: "IMA", meaning: "now" },
  { word: "いもうと", romaji: "IMOUTO", meaning: "younger sister" },
  { word: "いりぐち", romaji: "IRIGUCHI", meaning: "entrance" },
  { word: "うた", romaji: "UTA", meaning: "song" },
  { word: "うみ", romaji: "UMI", meaning: "sea, ocean" },
  { word: "えいが", romaji: "EIGA", meaning: "movie" },
  { word: "えいご", romaji: "EIGO", meaning: "English" },
  { word: "えんぴつ", romaji: "ENPITSU", meaning: "pencil" },
  { word: "おいしい", romaji: "OISHII", meaning: "delicious" },
  { word: "おおきい", romaji: "OOKII", meaning: "big" },
  { word: "おかね", romaji: "OKANE", meaning: "money" },
  { word: "おちゃ", romaji: "OCHA", meaning: "green tea" },
  { word: "おんがく", romaji: "ONGAKU", meaning: "music" },
  { word: "がいこく", romaji: "GAIKOKU", meaning: "foreign country" },
  { word: "かいしゃ", romaji: "KAISHA", meaning: "company" },
  { word: "かぎ", romaji: "KAGI", meaning: "key" },
  { word: "がくせい", romaji: "GAKUSEI", meaning: "student" },
  { word: "かさ", romaji: "KASA", meaning: "umbrella" },
  { word: "かぞく", romaji: "KAZOKU", meaning: "family" },
  { word: "がっこう", romaji: "GAKKOU", meaning: "school" },
  { word: "かばん", romaji: "KABAN", meaning: "bag" },
  { word: "かんじ", romaji: "KANJI", meaning: "kanji" },
  { word: "き", romaji: "KI", meaning: "tree" },
  { word: "きっさてん", romaji: "KISSATEN", meaning: "coffee shop" },
  { word: "きっぷ", romaji: "KIPPU", meaning: "ticket" },
  { word: "きのう", romaji: "KINOU", meaning: "yesterday" },
  { word: "ぎゅうにゅう", romaji: "GYUUNYUU", meaning: "milk" },
  { word: "きょう", romaji: "KYOU", meaning: "today" },
  { word: "きょうしつ", romaji: "KYOUSHITSU", meaning: "classroom" },
  { word: "くだもの", romaji: "KUDAMONO", meaning: "fruit" },
  { word: "くつ", romaji: "KUTSU", meaning: "shoes" },
  { word: "くるま", romaji: "KURUMA", meaning: "car" },
  { word: "けしごむ", romaji: "KESHIGOMU", meaning: "eraser" },
  { word: "こうえん", romaji: "KOUEN", meaning: "park" },
  { word: "さかな", romaji: "SAKANA", meaning: "fish" },
  { word: "ざっし", romaji: "ZASSHI", meaning: "magazine" },
  { word: "じかん", romaji: "JIKAN", meaning: "time" },
  { word: "じしょ", romaji: "JISHO", meaning: "dictionary" },
  { word: "じてんしゃ", romaji: "JITENSHA", meaning: "bicycle" },
  { word: "しゃしん", romaji: "SHASHIN", meaning: "photo" },
  { word: "しんぶん", romaji: "SHINBUN", meaning: "newspaper" },
  { word: "すし", romaji: "SUSHI", meaning: "sushi" },
  { word: "たべもの", romaji: "TABEMONO", meaning: "food" },
  { word: "たまご", romaji: "TAMAGO", meaning: "egg" },
  { word: "ちかてつ", romaji: "CHIKATETSU", meaning: "subway" },
  { word: "ちず", romaji: "CHIZU", meaning: "map" },
  { word: "でんしゃ", romaji: "DENSHA", meaning: "train" },
  { word: "でんわ", romaji: "DENWA", meaning: "telephone" },
  { word: "とうきょう", romaji: "TOUKYOU", meaning: "Tokyo" },
  { word: "としょかん", romaji: "TOSHOKAN", meaning: "library" },
  { word: "とり", romaji: "TORI", meaning: "bird" },
  { word: "なつ", romaji: "NATSU", meaning: "summer" },
  { word: "にく", romaji: "NIKU", meaning: "meat" },
  { word: "にほん", romaji: "NIHON", meaning: "Japan" },
  { word: "ねこ", romaji: "NEKO", meaning: "cat" },
  { word: "はな", romaji: "HANA", meaning: "flower" },
  { word: "ひこうき", romaji: "HIKOUKI", meaning: "airplane" },
  { word: "ふゆ", romaji: "FUYU", meaning: "winter" },
  { word: "ほん", romaji: "HON", meaning: "book" },
  { word: "みず", romaji: "MIZU", meaning: "water" },
  { word: "やま", romaji: "YAMA", meaning: "mountain" },
  { word: "りんご", romaji: "RINGO", meaning: "apple" }
];

// --- session constants & state
const SESSION_LIMIT = 50;
const TIME_LIMIT = 60; // seconds per item
const MAX_PER_DIRECTION = 250;
const MAX_TOTAL = 500;

let sessionList = [];      // items with {word, romaji, meaning, type: 'H2R'|'R2H'}
let currentIndex = 0;
let scoreTotal = 0;
let scoreH2R = 0;
let scoreR2H = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let isTimeExpired = false;
let attemptsThisItem = 0;

let userName = "";
let startTime = null;
let endTime = null;
let videoStream = null;

// DOM refs
const welcomeScreen = document.getElementById('welcome-screen');
const practiceScreen = document.getElementById('practice-screen');
const cameraScreen = document.getElementById('camera-screen');
const certificateScreen = document.getElementById('certificate-screen');

const vocabHiraganaEl = document.getElementById('vocab-hiragana');
const vocabRomajiEl = document.getElementById('vocab-romaji');
const meaningEl = document.getElementById('vocab-meaning');
const wordCountEl = document.getElementById('word-count');
const timerDisplayEl = document.getElementById('timer-display');
const scoreEl = document.getElementById('score');
const progressBarEl = document.getElementById('progress-bar');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackMsg = document.getElementById('feedback-msg');
const errorMessageEl = document.getElementById('error-message');
const answerInput = document.getElementById('answer-input');

// --- utilities
function shuffleArray(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a,b) => a.r - b.r)
    .map(x => x.v);
}

function clampFloorZero(val) { return val < 0 ? 0 : val; }

// Build romaji->kana syllable list (for breakdown hints)
const romajiToKana = {};
for (const [k, r] of Object.entries(kanaToRomajiMap)) {
  romajiToKana[r.toLowerCase()] = k;
}
const romajiSyllables = Object.keys(romajiToKana).sort((a,b) => b.length - a.length); // longest-first

function romajiBreakdown(romajiUpper) {
  const s = romajiUpper.toLowerCase();
  let i = 0;
  const parts = [];
  while (i < s.length) {
    // handle doubled consonant marker (gemination) like 'tt' -> 'っ'
    if (i + 1 < s.length && s[i] === s[i+1] && /[bcdfghjklmnpqrstvwxyz]/.test(s[i])) {
      parts.push(s[i]); // mark doubled consonant as separate part
      i++; continue;
    }
    let matched = false;
    for (const syl of romajiSyllables) {
      if (s.startsWith(syl, i)) {
        parts.push(syl);
        i += syl.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // fallback to single char
      parts.push(s[i]);
      i++;
    }
  }
  return parts.join(' ');
}

// --- session creation
function createSessionList() {
  // sample 50 unique words from master
  const pool = shuffleArray([...masterVocabList]);
  const take = pool.slice(0, SESSION_LIMIT); // 50 unique items
  const firstHalf = take.slice(0, 25);
  const secondHalf = take.slice(25, 50);

  const list = [];
  firstHalf.forEach(item => list.push({...item, type:'H2R'}));
  secondHalf.forEach(item => list.push({...item, type:'R2H'}));
  // shuffle combined list
  return shuffleArray(list);
}

// --- game flow
function startPractice() {
  const nameInput = document.getElementById('user-name-input').value.trim();
  if (!nameInput) {
    alert("Please enter your name to proceed.");
    return;
  }
  userName = nameInput;
  startTime = new Date();

  welcomeScreen.classList.remove('active');
  practiceScreen.classList.add('active');

  initGame();
}

function initGame() {
  sessionList = createSessionList();
  currentIndex = 0;
  scoreTotal = 0;
  scoreH2R = 0;
  scoreR2H = 0;
  attemptsThisItem = 0;
  loadWord();
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_LIMIT;
  isTimeExpired = false;
  attemptsThisItem = 0;
  timerDisplayEl.classList.remove('expired');
  timerDisplayEl.textContent = `Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft >= 0) {
      timerDisplayEl.textContent = `Time Left: ${timeLeft}s`;
    } else {
      isTimeExpired = true;
      stopTimer();
      timerDisplayEl.classList.add('expired');
      timerDisplayEl.textContent = `Time Expired!`;
      errorMessageEl.textContent = "⏰ Time's up! If you answer now you'll get +5 points.";
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// render current item
function loadWord() {
  feedbackOverlay.style.display = 'none';
  errorMessageEl.textContent = '';
  answerInput.value = '';
  answerInput.focus();

  const item = sessionList[currentIndex];

  // show/hide correct display
  if (item.type === 'H2R') {
    vocabHiraganaEl.style.display = 'block';
    vocabRomajiEl.style.display = 'none';
    vocabHiraganaEl.textContent = item.word;
    document.getElementById('practice-mode-title').textContent = 'Hiragana → Romaji';
    answerInput.placeholder = 'Type ROMAJI (e.g., NEKO)';
  } else {
    vocabHiraganaEl.style.display = 'none';
    vocabRomajiEl.style.display = 'block';
    vocabRomajiEl.textContent = item.romaji;
    document.getElementById('practice-mode-title').textContent = 'Romaji → Hiragana';
    answerInput.placeholder = 'Type HIRAGANA (e.g., ねこ)';
  }

  meaningEl.textContent = item.meaning;
  wordCountEl.textContent = `Item: ${currentIndex + 1} / ${sessionList.length}`;
  scoreEl.textContent = `Score: ${scoreTotal}`;
  const progress = (currentIndex / sessionList.length) * 100;
  progressBarEl.style.width = `${progress}%`;

  startTimer();
}

function handleFormSubmit(event) {
  event.preventDefault();
  const userRaw = answerInput.value.trim();
  if (!userRaw) return;
  attemptsThisItem++;

  const item = sessionList[currentIndex];
  // H2R: show hiragana and expect romaji
  if (item.type === 'H2R') {
    const userRomaji = userRaw.toUpperCase();
    if (userRomaji === item.romaji) {
      stopTimer();
      const points = isTimeExpired ? 5 : 10;
      // add to direction, cap at MAX_PER_DIRECTION
      const available = Math.max(0, MAX_PER_DIRECTION - scoreH2R);
      const toAdd = Math.min(points, available);
      scoreH2R += toAdd;
      scoreTotal = Math.min(MAX_TOTAL, scoreH2R + scoreR2H);
      updateScoreDisplay();
      feedbackTitle.textContent = 'CORRECT! 🎉';
      feedbackTitle.style.color = 'var(--primary-green)';
      feedbackMsg.textContent = `"${item.word}" → ${item.romaji} (+${toAdd} pts)`;
      feedbackOverlay.style.display = 'flex';
    } else {
      // incorrect guess: subtract from H2R (not below 0)
      scoreH2R = Math.max(0, scoreH2R - 1);
      scoreTotal = Math.max(0, scoreH2R + scoreR2H);
      updateScoreDisplay();
      const romajiAttempt = userRomaji;
      const correctRomaji = item.romaji;
      errorMessageEl.innerHTML = `Incorrect! You typed "${userRaw}" (${romajiAttempt}). Hint: check small kana (ゃ/ゅ/ょ) and doubled consonants (っ). Expected romaji length: ${correctRomaji.length}. (-1 pt)`;
      answerInput.select();
    }
  } else {
    // R2H: show romaji prompt and expect hiragana
    const userHiragana = userRaw;
    if (userHiragana === item.word) {
      stopTimer();
      const points = isTimeExpired ? 5 : 10;
      const available = Math.max(0, MAX_PER_DIRECTION - scoreR2H);
      const toAdd = Math.min(points, available);
      scoreR2H += toAdd;
      scoreTotal = Math.min(MAX_TOTAL, scoreH2R + scoreR2H);
      updateScoreDisplay();
      feedbackTitle.textContent = 'CORRECT! 🎉';
      feedbackTitle.style.color = 'var(--primary-green)';
      feedbackMsg.textContent = `"${item.romaji}" → ${item.word} (+${toAdd} pts)`;
      feedbackOverlay.style.display = 'flex';
    } else {
      // incorrect guess: subtract from R2H
      scoreR2H = Math.max(0, scoreR2H - 1);
      scoreTotal = Math.max(0, scoreH2R + scoreR2H);
      updateScoreDisplay();
      const breakdown = romajiBreakdown(item.romaji);
      errorMessageEl.innerHTML = `Incorrect! You typed "${userRaw}". Hint (romaji breakdown): ${breakdown} — combine small kana (kya/chu) and use っ for doubled consonants. (-1 pt)`;
      answerInput.select();
    }
  }
}

function updateScoreDisplay() {
  scoreEl.textContent = `Score: ${scoreTotal}`;
}

function nextWord() {
  currentIndex++;
  if (currentIndex < sessionList.length) {
    loadWord();
  } else {
    // finished
    stopTimer();
    endTime = new Date();
    startCameraScreen();
  }
}

// --- camera & certificate flow (kept similar to original)
function startCameraScreen() {
  practiceScreen.classList.remove('active');
  cameraScreen.classList.add('active');

  const video = document.getElementById('webcam-video');
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      videoStream = stream;
      video.srcObject = stream;
    })
    .catch(err => {
      // user might deny camera — still allow certificate flow
      console.warn('Camera access denied or not available.', err);
    });
}

function takeSnapshot() {
  const video = document.getElementById('webcam-video');
  const canvas = document.getElementById('photo-canvas');
  const photo = document.getElementById('captured-photo');

  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/png');
  photo.src = dataUrl;

  video.style.display = 'none';
  photo.style.display = 'block';

  document.getElementById('snap-btn').style.display = 'none';
  document.getElementById('retake-btn').style.display = 'inline-block';
  document.getElementById('cert-btn').style.display = 'inline-block';
}

function resetCamera() {
  const video = document.getElementById('webcam-video');
  const photo = document.getElementById('captured-photo');

  video.style.display = 'block';
  photo.style.display = 'none';

  document.getElementById('snap-btn').style.display = 'inline-block';
  document.getElementById('retake-btn').style.display = 'none';
  document.getElementById('cert-btn').style.display = 'none';
}

function showCertificate() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }

  cameraScreen.classList.remove('active');
  certificateScreen.classList.add('active');

  // Fill certificate fields
  document.getElementById('cert-user-name').textContent = userName;
  document.getElementById('cert-score-h2r').textContent = scoreH2R;
  document.getElementById('cert-score-r2h').textContent = scoreR2H;
  document.getElementById('cert-total-score').textContent = scoreTotal;
  document.getElementById('cert-items-count').textContent = sessionList.length;

  const totalSeconds = Math.floor((endTime - startTime) / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  document.getElementById('cert-total-time').textContent = `${mins}m ${secs}s`;

  // start/end local time only (no date)
  document.getElementById('cert-start-time').textContent = startTime ? startTime.toLocaleTimeString() : '-';
  document.getElementById('cert-end-time').textContent = endTime ? endTime.toLocaleTimeString() : '-';

  // Date (keep separate)
  const dateSource = startTime || new Date();
  document.getElementById('cert-date').textContent = dateSource.toISOString().split('T')[0];

  const photoData = document.getElementById('captured-photo').src;
  const certCard = document.getElementById('certificate');
  if (photoData) {
    certCard.style.backgroundImage = `url('${photoData}')`;
  }
}

// Expose nextWord to global (button onclick)
window.nextWord = nextWord;
window.startPractice = startPractice;
window.handleFormSubmit = handleFormSubmit;
window.takeSnapshot = takeSnapshot;
window.resetCamera = resetCamera;
window.showCertificate = showCertificate;