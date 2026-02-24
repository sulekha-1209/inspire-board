// ── Clock ─────────────────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}`;

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    document.getElementById('date-display').textContent =
        `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}
setInterval(updateClock, 1000);
updateClock();

// ── Wallpaper via Unsplash API (no-key random) ────────────────────
// Uses the public /photos/random endpoint – no API key needed for this usage
const UNSPLASH_COLLECTIONS = ['317099', '1065396', '3694365', '9260386'];
const PICSUM_FALLBACK = true;

async function loadWallpaper() {
    try {
        // Unsplash source replacement: picsum.photos (no deprecated source API needed)
        // We use a curated nature/landscape aesthetic
        const seeds = ['mountains', 'nature', 'forest', 'ocean', 'aurora', 'landscape', 'sunrise'];
        const seed = seeds[Math.floor(Math.random() * seeds.length)];
        const w = screen.width || 1920;
        const h = screen.height || 1080;
        // Picsum with a fixed seed gives a deterministic beautiful photo
        const imgUrl = `https://picsum.photos/${w}/${h}?random=${Date.now()}`;

        const img = new Image();
        img.onload = () => {
            document.getElementById('bg').style.backgroundImage = `url(${imgUrl})`;
        };
        img.src = imgUrl;

        // Credit
        document.getElementById('photo-credit').innerHTML = 'Photo from <a href="https://picsum.photos" target="_blank">Lorem Picsum</a>';
    } catch (e) {
        // Fallback gradient
        document.getElementById('bg').style.background =
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    }
}

loadWallpaper();

// ── Quote (quotable.io – free, no CORS proxy needed) ──────────────
async function fetchQuote() {
    const loader = document.getElementById('quote-loader');
    const content = document.getElementById('quote-content');
    loader.classList.remove('hidden');
    content.classList.add('hidden');

    try {
        const res = await fetch('https://api.quotable.io/quotes/random?minLength=60&maxLength=200');
        const [data] = await res.json();
        document.getElementById('quote-text').textContent = `"${data.content}"`;
        document.getElementById('quote-author').textContent = `— ${data.author}`;
        loader.classList.add('hidden');
        content.classList.remove('hidden');
    } catch (e) {
        // Fallback quotes if API is unavailable
        const fallbacks = [
            { content: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
            { content: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
            { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { content: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
            { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        ];
        const q = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        document.getElementById('quote-text').textContent = `"${q.content}"`;
        document.getElementById('quote-author').textContent = `— ${q.author}`;
        loader.classList.add('hidden');
        content.classList.remove('hidden');
    }
}

function tweetQuote() {
    const q = document.getElementById('quote-text').textContent;
    const a = document.getElementById('quote-author').textContent;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(q + ' ' + a)}`, '_blank');
}

fetchQuote();

// ── Intention ─────────────────────────────────────────────────────
function loadIntention() {
    const saved = localStorage.getItem('inspire-intention');
    if (saved) {
        document.getElementById('intention-text').textContent = saved;
        document.getElementById('intention-input-area').classList.add('hidden');
        document.getElementById('intention-display').classList.remove('hidden');
        // Restore checkbox state
        const done = localStorage.getItem('inspire-intention-done') === 'true';
        document.getElementById('intention-check').checked = done;
        if (done) document.getElementById('intention-text').style.textDecoration = 'line-through';
    }
}

function saveIntention() {
    const val = document.getElementById('intention-input').value.trim();
    if (!val) return;
    localStorage.setItem('inspire-intention', val);
    localStorage.removeItem('inspire-intention-done');
    document.getElementById('intention-text').textContent = val;
    document.getElementById('intention-input-area').classList.add('hidden');
    document.getElementById('intention-display').classList.remove('hidden');
}

function clearIntention() {
    localStorage.removeItem('inspire-intention');
    localStorage.removeItem('inspire-intention-done');
    document.getElementById('intention-input').value = '';
    document.getElementById('intention-check').checked = false;
    document.getElementById('intention-text').style.textDecoration = '';
    document.getElementById('done-message').classList.remove('visible');
    document.getElementById('intention-display').classList.add('hidden');
    document.getElementById('intention-input-area').classList.remove('hidden');
}

function toggleIntentionDone() {
    const checked = document.getElementById('intention-check').checked;
    const text = document.getElementById('intention-text');
    const msg = document.getElementById('done-message');
    localStorage.setItem('inspire-intention-done', checked);
    if (checked) {
        text.style.textDecoration = 'line-through';
        msg.classList.add('visible');
        setTimeout(() => msg.classList.remove('visible'), 3000);
    } else {
        text.style.textDecoration = '';
        msg.classList.remove('visible');
    }
}

function showIntentionOpts() {
    const btn = document.getElementById('intention-remove');
    btn.classList.remove('hidden');
    btn.classList.add('visible');
}
function hideIntentionOpts() {
    const btn = document.getElementById('intention-remove');
    btn.classList.remove('visible');
    setTimeout(() => btn.classList.add('hidden'), 200);
}

loadIntention();

// ── To-do ─────────────────────────────────────────────────────────
let todos = JSON.parse(localStorage.getItem('inspire-todos') || '[]');

function saveTodos() {
    localStorage.setItem('inspire-todos', JSON.stringify(todos));
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach((todo, i) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'todo-check';
        check.checked = todo.done;
        check.onchange = () => { todos[i].done = check.checked; saveTodos(); renderTodos(); };

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;

        const close = document.createElement('button');
        close.className = 'icon-btn small todo-close';
        close.innerHTML = '<i class="fa fa-times"></i>';
        close.onclick = (e) => { e.stopPropagation(); todos.splice(i, 1); saveTodos(); renderTodos(); };

        li.appendChild(check);
        li.appendChild(span);
        li.appendChild(close);
        list.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const val = input.value.trim();
    if (!val) return;
    todos.unshift({ text: val, done: false });
    saveTodos();
    renderTodos();
    input.value = '';
}

function toggleTodo() {
    document.getElementById('todo-panel').classList.toggle('hidden');
}

renderTodos();
