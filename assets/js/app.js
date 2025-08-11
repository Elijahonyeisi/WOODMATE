// Main app functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cart functionality
    const cartCount = document.querySelector('.badge.bg-dark');
    let cartItems = 3; // Initial cart items
    
    // Add to cart buttons
    document.querySelectorAll('.btn-outline-primary').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.card-title').textContent;
            const productPrice = productCard.querySelector('.text-primary').textContent;
            
            cartItems++;
            cartCount.textContent = cartItems;
            
            // Show added notification
            showToast(`${productName} added to cart`);
        });
    });

    // Notify me button
    document.querySelector('.btn-outline-secondary').addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.card-title').textContent;
        
        showToast(`We'll notify you when ${productName} is available`);
    });

    // Search functionality
    const searchButton = document.querySelector('.hero-section button');
    const searchInput = document.querySelector('.hero-section input');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            showToast(`Searching for: ${searchTerm}`);
            // In a real app, you would redirect to search results or filter products
        }
    });
    
    // Allow search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // Newsletter subscription
    const subscribeButton = document.querySelector('footer button.btn-primary');
    const subscribeInput = document.querySelector('footer input[type="email"]');
    
    subscribeButton.addEventListener('click', function() {
        const email = subscribeInput.value.trim();
        if (email && validateEmail(email)) {
            showToast('Thanks for subscribing!');
            subscribeInput.value = '';
        } else {
            showToast('Please enter a valid email', 'error');
        }
    });

    // Helper function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    // Track order simulation (could be connected to real API in production)
    const trackOrderStatus = document.querySelector('.order-tracker .active h6');
    const progressBar = document.querySelector('.order-tracker .progress-bar');
    
    // Simulate production progress (would be API-driven in real app)
    let progress = 60;
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress === 100) {
                trackOrderStatus.textContent = 'Quality Inspection';
                clearInterval(progressInterval);
                
                // Simulate next step after delay
                setTimeout(() => {
                    const nextStep = document.querySelector('.order-tracker .active').nextElementSibling;
                    if (nextStep) {
                        document.querySelector('.order-tracker .active').classList.remove('active');
                        nextStep.classList.add('active');
                        nextStep.querySelector('h6').textContent = 'Ready for Delivery';
                    }
                }, 3000);
            }
        }
    }, 2000);
});