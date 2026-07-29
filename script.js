/* script.js - SPA Otimizada
    - Dark mode persistente via localStorage
    - Funções de Slide Toggle e PIX Copy modularizadas
    - Intersection Observer para Highlights
    - Mobile Menu otimizado para Single Page (Anchor links)
*/

// Aplica o tema salvo antecipadamente para evitar "flash"
(function(){
    try {
        if(localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
    } catch(e){}
})();

// Função utilitária para animação slide up/down expansível
function slideToggle(element) {
    const isExpanded = element.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.offsetWidth; // Força reflow
        element.style.maxHeight = '0';
        element.setAttribute('data-expanded', 'false');
    } else {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.setAttribute('data-expanded', 'true');
        setTimeout(() => {
            if(element.getAttribute('data-expanded') === 'true') {
                element.style.maxHeight = 'none';
            }
        }, 400);
    }
}

// Atualiza a UI do botão de tema
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

// Funcionalidade genérica de Copiar (PIX)
function setupPixCopy(btnId, valueId) {
    const btnCopiar = document.getElementById(btnId);
    const valueSpan = document.getElementById(valueId);

    if (!btnCopiar || !valueSpan) return;

    btnCopiar.addEventListener('click', () => {
        const textToCopy = valueSpan.textContent.trim();
        const originalText = btnCopiar.textContent;
        
        const resetBtn = () => {
            setTimeout(() => { btnCopiar.textContent = originalText; }, 2000);
        };

        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    btnCopiar.textContent = 'Copiado!';
                    resetBtn();
                })
                .catch(err => console.error('Falha ao copiar:', err));
        } else {
            // Fallback
            const tempInput = document.createElement('input');
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            btnCopiar.textContent = 'Copiado!';
            resetBtn();
        }
    });
}

// Wrapper para Toggles de UI
function setupToggle(buttonId, contentId, expandText, collapseText) {
    const btn = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (btn && content) {
        content.setAttribute('data-expanded', 'false');
        content.style.maxHeight = '0';

        btn.addEventListener('click', () => {
            slideToggle(content);
            const isExpanded = content.getAttribute('data-expanded') === 'true';
            btn.textContent = isExpanded ? collapseText : expandText;
        });
    }
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

// Inicialização segura no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {

    // 1. Dark Mode
    const themeToggleBtn = document.getElementById('themeToggle'); 
    if(themeToggleBtn) themeToggleBtn.classList.add('theme-toggle-btn');
    
    updateThemeButton(); 

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e){}
            updateThemeButton();
        });
    });

    // 2. Setup dos Blocos Dinâmicos (Doações / Expandir)
    // Biblioteca
    setupToggle('btnQueroDoarBiblioteca', 'pixDetailsBiblioteca', 'Quero Doar', 'Esconder');
    setupToggle('btnDropdownBiblioteca', 'dropdownContentBiblioteca', 'Outras Formas', 'Esconder');
    setupPixCopy('btnCopiarPixBiblioteca', 'pixValueBiblioteca'); 

    // Mooca
    setupToggle('btnQueroDoarMoocaSolidaria', 'pixDetailsMoocaSolidaria', 'Quero Doar', 'Esconder');
    setupToggle('btnDropdownMoocaSolidaria', 'dropdownContentMoocaSolidaria', 'Outras Formas', 'Esconder');
    setupPixCopy('btnCopiarPixMoocaSolidaria', 'pixValueMoocaSolidaria');

    // 3. Efeitos de Rolagem
    setupHighlightObserver();

    // 4. Menu Mobile p/ Single Page
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.getElementById('navLinks');

    if (mobileBtn && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            mobileBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        };

        mobileBtn.addEventListener('click', toggleMenu);

        // Otimização para SPA: Clicar em um link âncora fecha a gaveta do menu
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if(navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
});