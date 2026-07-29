// ---------- PRECAUÇÃO: script assume que HTML já incluiu <script> inline no head que define html.dark quando necessário ----------

// Função para setar o ícone do botão de tema depois que o DOM estiver pronto:
function refreshThemeButton() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    // Se html tem classe dark (aplicada antecipadamente), mostra sol
    if (document.documentElement.classList.contains("dark")) {
        btn.textContent = "☀️";
    } else {
        btn.textContent = "🌙";
    }
}

// Toggle de tema (alterna classe tanto em html quanto em body para compatibilidade)
function toggleTheme() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    const isDark = document.documentElement.classList.toggle("dark");
    // também setar em body por compatibilidade
    if (isDark) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
        btn.textContent = "☀️";
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
        btn.textContent = "🌙";
    }
}

// Associa botão
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.addEventListener("click", toggleTheme);
    }
    refreshThemeButton();

    // Ao carregar a index.html, aplicar filtro a partir do hash (se houver)
    applyFilterFromHash();
});

// ---------- FILTRAGEM POR CATEGORIA (INDEX) ----------

function filterCategory(category) {
    const cards = document.querySelectorAll(".card");
    // When called programmatically, also update hash so header links work consistently
    if (location.hash !== `#${category}`) {
        location.hash = category === 'todas' ? '' : `#${category}`;
    }

    cards.forEach(card => {
        if (category === "todas" || card.dataset.category === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

    // set active class on buttons (if present)
    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
    const btnEl = document.getElementById(category);
    if (btnEl) btnEl.classList.add("active");
}

// Quando a página carrega ou quando o hash muda, aplicar filtro
function applyFilterFromHash() {
    // Only run if we are on index.html (or no other index-like path)
    // Use location.pathname to check current file
    const path = location.pathname.split("/").pop();
    if (path !== '' && path !== 'index.html') return;

    // hash could be '#politica' or empty
    const raw = location.hash.replace('#','');
    const cat = raw ? raw : 'todas';
    filterCategory(cat);
}

// Also listen hashchange (user clicking header links that set hash)
window.addEventListener('hashchange', applyFilterFromHash);
