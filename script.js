document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.carousel-item');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (items.length > 0 && nextBtn && prevBtn) {
        let index = 0;
        let interval;

        function showSlide(i) {
            items.forEach(item => item.classList.remove('active'));
            items[i].classList.add('active');
        }

        function nextSlide() {
            index = (index + 1) % items.length;
            showSlide(index);
        }

        function prevSlide() {
            index = (index - 1 + items.length) % items.length;
            showSlide(index);
        }

        function startAutoPlay() {
            interval = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(interval);
            startAutoPlay();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        showSlide(index);
        startAutoPlay();
    }

    const track = document.getElementById('galeriaTrack');
    const prevGaleriaBtn = document.querySelector('.prev-galeria');
    const nextGaleriaBtn = document.querySelector('.next-galeria');

    if (track && prevGaleriaBtn && nextGaleriaBtn) {
        const originalCards = Array.from(track.children);
        const totalOriginals = originalCards.length;
        const autoPlayDelay = 1500;
        let autoPlayTimer = null;

        // 1. Clona o conjunto completo para esquerda e direita
        originalCards.forEach(card => {
            const cloneEnd = card.cloneNode(true);
            track.appendChild(cloneEnd);
        });

        originalCards.slice().reverse().forEach(card => {
            const cloneStart = card.cloneNode(true);
            track.insertBefore(cloneStart, track.firstChild);
        });

        // 2. Calcula a largura exata de cada card + gap
        const getCardWidth = () => {
            const firstCard = track.children[0];
            const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
            return firstCard.getBoundingClientRect().width + gap;
        };

        // 3. Posiciona o scroll inicial no grupo original do meio
        let cardWidth = getCardWidth();
        const initialOffset = totalOriginals * cardWidth;
        
        // Timeout pequeno para garantir renderização do layout antes de setar o scroll
        setTimeout(() => {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = initialOffset;
            track.style.scrollBehavior = 'smooth';
        }, 50);

        // 4. Verificação de limites sem sobressaltos
        const checkLoopBoundaries = () => {
            cardWidth = getCardWidth();
            const currentScroll = track.scrollLeft;
            const singleSetWidth = totalOriginals * cardWidth;

            // Limite Direita -> Reseta para o centro sem animação
            if (currentScroll >= singleSetWidth * 2 - 10) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = currentScroll - singleSetWidth;
                track.style.scrollBehavior = 'smooth';
            }
            // Limite Esquerda -> Reseta para o centro sem animação
            else if (currentScroll <= 10) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = currentScroll + singleSetWidth;
                track.style.scrollBehavior = 'smooth';
            }
        };

        track.addEventListener('scroll', () => {
            window.clearTimeout(track.scrollTimeout);
            track.scrollTimeout = setTimeout(checkLoopBoundaries, 100);
        });

        // 5. Funções de deslize
        const slideNext = () => {
            cardWidth = getCardWidth();
            track.style.scrollBehavior = 'smooth';
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        };

        const slidePrev = () => {
            cardWidth = getCardWidth();
            track.style.scrollBehavior = 'smooth';
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        };

        // 6. Autoplay e Controles de Interação
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayTimer = setInterval(slideNext, autoPlayDelay);
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        };

        nextGaleriaBtn.addEventListener('click', () => {
            slideNext();
            startAutoPlay();
        });

        prevGaleriaBtn.addEventListener('click', () => {
            slidePrev();
            startAutoPlay();
        });

        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay, { passive: true });
        track.addEventListener('touchend', startAutoPlay);

        startAutoPlay();
    }
});