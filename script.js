document.addEventListener('DOMContentLoaded', function() {
    // Features Scroll Functionality
    const initializeScroll = () => {
        const scrollContainer = document.querySelector('.features-scroll');
        const leftButton = document.querySelector('.scroll-left');
        const rightButton = document.querySelector('.scroll-right');
        
        if (scrollContainer && leftButton && rightButton) {
            const scrollAmount = 370; // card width (350px) + gap (20px)
            
            // Left scroll
            leftButton.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            // Right scroll
            rightButton.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            // Update button visibility
            const updateScrollButtons = () => {
                const isAtStart = scrollContainer.scrollLeft <= 0;
                const isAtEnd = scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth);
                
                leftButton.style.opacity = isAtStart ? '0' : '1';
                leftButton.style.pointerEvents = isAtStart ? 'none' : 'auto';
                
                rightButton.style.opacity = isAtEnd ? '0' : '1';
                rightButton.style.pointerEvents = isAtEnd ? 'none' : 'auto';
            };
            
            // Listen for scroll and resize events
            scrollContainer.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
            updateScrollButtons(); // Initial check
            
            // Add touch scroll for mobile
            let isDown = false;
            let startX;
            let scrollLeft;
            
            scrollContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                scrollContainer.style.cursor = 'grabbing';
                startX = e.pageX - scrollContainer.offsetLeft;
                scrollLeft = scrollContainer.scrollLeft;
            });
            
            scrollContainer.addEventListener('mouseleave', () => {
                isDown = false;
                scrollContainer.style.cursor = 'grab';
            });
            
            scrollContainer.addEventListener('mouseup', () => {
                isDown = false;
                scrollContainer.style.cursor = 'grab';
            });
            
            scrollContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - scrollContainer.offsetLeft;
                const walk = (x - startX) * 2;
                scrollContainer.scrollLeft = scrollLeft - walk;
            });
        }
    };
    
    // Copy Button Functionality
    const initializeCopyButtons = () => {
        // Generic copy buttons
        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const content = button.previousElementSibling.textContent;
                copyToClipboard(content, button);
            });
        });
        
        // Specific copy buttons
        const specificCopyButtons = document.querySelectorAll('.copy-btn');
        specificCopyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const container = button.closest('.address-container');
                if (container) {
                    const textElement = container.querySelector('.token-value.address');
                    if (textElement) {
                        const content = textElement.textContent;
                        copyToClipboard(content, button);
                    }
                }
            });
        });
    };
    
    // Helper function for copying to clipboard
    const copyToClipboard = async (text, button) => {
        try {
            // Try the modern Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = 0;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            // Visual feedback
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            button.textContent = 'Error';
            
            setTimeout(() => {
                button.textContent = originalText || 'Copy';
                button.classList.remove('copied');
            }, 2000);
        }
    };
    
    // Smooth Scroll Navigation
    const initializeSmoothScroll = () => {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };
    
    // Animation on Scroll
    const initializeScrollAnimation = () => {
        const elements = document.querySelectorAll('.feature-card, .step, .about-content, .tokenomics-card');
        
        const animateOnScroll = () => {
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                
                if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                    element.classList.add('animate__animated', 'animate__fadeIn');
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Initial check
    };    // Initialize all functionality
    initializeScroll();
    initializeCopyButtons();
    initializeSmoothScroll();
    initializeScrollAnimation();
    initializeTicker();
    
    // Setup copy functionality for tokenomics address
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.innerHTML = '<span class="copy-text">Copy</span><span class="copied-text">Copied!</span>';
        
        btn.addEventListener('click', function() {
            const addressContainer = this.closest('.address-container');
            if (addressContainer) {
                const address = addressContainer.querySelector('.token-value.address').textContent;
                copyToClipboard(address, this);
            }
        });
    });
      // Initialize ticker with proper cloning for infinite scroll
    function initializeTicker() {
        const tickerContent = document.getElementById('ticker');
        if (!tickerContent) return;
        
        // Clone the content to create a seamless loop
        const originalElements = Array.from(tickerContent.children);
        originalElements.forEach(element => {
            const clone = element.cloneNode(true);
            tickerContent.appendChild(clone);
        });
        
        // Adjust animation speed based on content width
        const tickerWidth = tickerContent.scrollWidth / 2;
        const animationDuration = Math.max(15, tickerWidth / 50); // Ensure minimum speed
        
        // Apply animation dynamically
        const animationName = 'ticker-scroll';
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            @keyframes ${animationName} {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${tickerWidth}px); }
            }
            #ticker {
                animation: ${animationName} ${animationDuration}s linear infinite;
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Check if we need to pause animation on hover
        tickerContent.addEventListener('mouseenter', () => {
            tickerContent.style.animationPlayState = 'paused';
        });
        
        tickerContent.addEventListener('mouseleave', () => {
            tickerContent.style.animationPlayState = 'running';
        });
    }
});