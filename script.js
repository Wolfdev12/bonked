// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Add scroll animation to elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .step, .about-content, .tokenomics-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 100) {
                if (!element.classList.contains('animate__animated')) {
                    element.classList.add('animate__animated', 'animate__fadeIn');
                }
            }
        });
    };
    
    // Initial check for elements in view on page load
    animateOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Make ticker animation responsive
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const tickerItems = tickerContent.querySelectorAll('span');
        const clonedItems = Array.from(tickerItems).map(item => item.cloneNode(true));
        
        clonedItems.forEach(item => {
            tickerContent.appendChild(item);
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Create a floating mascot that follows mouse movement
    const createFloatingMascot = () => {
        const mascotImages = ['mascot1.png', 'mascot3.png', 'mascot7.png', 'mascot9.png'];
        const randomIndex = Math.floor(Math.random() * mascotImages.length);
        const mascotImage = mascotImages[randomIndex];
        
        const floatingMascot = document.createElement('div');
        floatingMascot.classList.add('floating-mascot', 'animate__animated', 'animate__fadeIn');
        floatingMascot.innerHTML = `<img src="assets/${mascotImage}" alt="Floating Mascot">`;
        
        document.body.appendChild(floatingMascot);
        
        setTimeout(() => {
            floatingMascot.classList.remove('animate__fadeIn');
            floatingMascot.classList.add('animate__fadeOut');
            
            setTimeout(() => {
                document.body.removeChild(floatingMascot);
            }, 1000);
        }, 5000);
        
        return floatingMascot;
    };
    
    // Occasionally show a floating mascot
    const showRandomMascot = () => {
        if (Math.random() > 0.7) {
            const mascot = createFloatingMascot();
            const maxX = window.innerWidth - 100;
            const maxY = window.innerHeight - 100;
            
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);
            
            mascot.style.left = `${randomX}px`;
            mascot.style.top = `${randomY}px`;
        }
    };
    
    // Show mascot every 10 seconds
    setInterval(showRandomMascot, 10000);
    
    // Button pulse effect
    const addButtonEffects = () => {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseover', function() {
                this.classList.add('animate__animated', 'animate__pulse');
            });
            
            button.addEventListener('mouseout', function() {
                this.classList.remove('animate__animated', 'animate__pulse');
            });
        });
    };
    
    addButtonEffects();
    
    // Add style for the floating mascot
    const style = document.createElement('style');
    style.textContent = `
        .floating-mascot {
            position: fixed;
            z-index: 999;
            width: 80px;
            height: 80px;
            pointer-events: none;
        }
        
        .floating-mascot img {
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Mobile menu toggle for responsive design
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        const mobileMenuToggle = document.createElement('div');
        mobileMenuToggle.classList.add('mobile-menu-toggle');
        mobileMenuToggle.innerHTML = `<span></span><span></span><span></span>`;
        
        header.insertBefore(mobileMenuToggle, nav);
        
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Add mobile menu styles
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            .mobile-menu-toggle {
                display: none;
                flex-direction: column;
                justify-content: space-between;
                width: 30px;
                height: 20px;
                cursor: pointer;
            }
            
            .mobile-menu-toggle span {
                display: block;
                height: 3px;
                width: 100%;
                background-color: var(--text);
                border-radius: 3px;
                transition: all 0.3s ease;
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
            
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex;
                }
                
                nav {
                    display: none;
                    width: 100%;
                }
                
                nav.active {
                    display: block;
                }
                
                nav ul {
                    flex-direction: column;
                    align-items: center;
                }
                
                nav ul li {
                    margin: 10px 0;
                }
            }
        `;
        document.head.appendChild(mobileStyle);
    };
    
    // Call mobile menu creation
    createMobileMenu();
    
    // Add coin counter animation in tokenomics section
    const animateCounter = () => {
        const tokenValue = document.querySelector('.token-value:not(.address)');
        if (!tokenValue) return;
        
        const finalValue = parseInt(tokenValue.textContent.replace(/,/g, ''));
        let currentValue = 0;
        const increment = finalValue / 100;
        
        tokenValue.textContent = '0';
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const interval = setInterval(() => {
                        currentValue += increment;
                        
                        if (currentValue >= finalValue) {
                            currentValue = finalValue;
                            clearInterval(interval);
                        }
                        
                        tokenValue.textContent = Math.floor(currentValue).toLocaleString();
                    }, 10);
                    
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(tokenValue);
    };
    
    // Initialize counter animation
    animateCounter();
}); 