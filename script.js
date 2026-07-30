/* script.js - Otimizado
    - Dark mode persistente via localStorage
    - Intersection Observer para Highlights
*/

// Aplica o tema salvo antecipadamente para evitar "flash" de luz
(function(){
    try {
        if(localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
    } catch(e){}
})();

// Atualiza a UI do botão de tema de acordo com a classe atual
function updateThemeButton(){
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    if(themeBtns.length === 0) return;

    const isDark = document.documentElement.classList.contains('dark');
    const icon = isDark ? '☀️' : '🌙';
    const ariaLabel = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';

    themeBtns.forEach(btn => {
        btn.textContent = icon;
        btn.setAttribute('aria-label', ariaLabel);
    });
}

// Observer para animar o "marca-texto" durante o scroll
function setupHighlightObserver() {
    const highlights = document.querySelectorAll('.highlight');
    if (highlights.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, { threshold: 0.8 });

    highlights.forEach(el => observer.observe(el));
}

// Inicialização segura no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dark Mode Setup
    updateThemeButton(); 

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e){}
            updateThemeButton();
        });
    });

    // 2. Efeitos de Rolagem
    setupHighlightObserver();

});