// Navigate to security check
function navigateToHome() {
    window.location.href = "/home";
}

// Smooth scroll to "How It Works" section
function scrollToHowItWorks() {
    const howItWorksSection = document.querySelector('.how-it-works');
    if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Auto-rotate highlight for fun facts (left-to-right queue)
(function initFunFactsRotator() {
    const container = document.querySelector('.testimonials .testimonial-cards');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.card'));
    if (cards.length === 0) return;

    let activeIndex = 0;

    function getContainerHorizontalPadding() {
        const styles = getComputedStyle(container);
        const pl = parseInt(styles.paddingLeft || '0', 10);
        const pr = parseInt(styles.paddingRight || '0', 10);
        return { pl, pr };
    }

    function setActive(index) {
        cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Ensure active card is scrolled into view within the horizontal row
        const activeCard = cards[index];
        const offsetLeft = activeCard.offsetLeft;
        const containerWidth = container.clientWidth;
        const cardWidth = activeCard.clientWidth;
        const { pl, pr } = getContainerHorizontalPadding();
        const visibleWidth = containerWidth - (pl + pr);
        const scrollTarget = Math.max(0, offsetLeft - pl - (visibleWidth - cardWidth) / 2);
        container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }

    setActive(activeIndex);

    // Rotate every 3 seconds
    setInterval(() => {
        activeIndex = (activeIndex + 1) % cards.length;
        setActive(activeIndex);
    }, 3000);
})();

