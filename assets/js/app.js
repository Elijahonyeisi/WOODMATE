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
    let cartItems = 0; // Initial cart items
    
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

// Add some basic styling for the toast notifications
const style = document.createElement('style');
style.textContent = document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    let cartCount = 0;
    updateCartCount();
    
    // Category filter functionality
    const categoryBadges = document.querySelectorAll('.category-badge');
    categoryBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            categoryBadges.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts();
        });
    });
    
    // Price range slider
    const priceSlider = document.querySelector('.price-range-slider');
    const priceValues = document.querySelectorAll('.price-values span');
    priceSlider.addEventListener('input', function() {
        const price = parseInt(this.value);
        priceValues[0].textContent = `₦0`;
        priceValues[1].textContent = `₦${price.toLocaleString()}`;
    });
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('.filter-card button.btn-primary');
    applyFiltersBtn.addEventListener('click', filterProducts);
    
    // Search functionality
    const searchInput = document.querySelector('.input-group input');
    const searchBtn = document.querySelector('.input-group button');
    searchBtn.addEventListener('click', function() {
        filterProducts();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterProducts();
        }
    });
    
    // Sort dropdown functionality
    const sortDropdownItems = document.querySelectorAll('.sort-dropdown .dropdown-item');
    const sortDropdownBtn = document.querySelector('.sort-dropdown .dropdown-toggle');
    sortDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            sortDropdownBtn.textContent = this.textContent;
            sortProducts();
        });
    });
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-outline-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.card-title').textContent;
            const productPrice = productCard.querySelector('.text-primary').textContent;
            
            cartCount++;
            updateCartCount();
            
            // Show success message
            showToast(`${productName} added to cart!`);
        });
    });
    
    // Notify me buttons
    const notifyButtons = document.querySelectorAll('.btn-outline-secondary');
    notifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.card-title').textContent;
            
            showToast(`We'll notify you when ${productName} is available!`);
        });
    });
    
    // Pagination
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    paginationLinks.forEach(link => {
        if (!link.parentElement.classList.contains('disabled') && 
            !link.parentElement.classList.contains('active')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // In a real app, this would load new products
                showToast(`Loading page ${this.textContent}...`);
            });
        }
    });
    
    // Helper functions
    function filterProducts() {
        const activeCategory = document.querySelector('.category-badge.active').textContent;
        const maxPrice = parseInt(priceSlider.value);
        const searchTerm = searchInput.value.toLowerCase();
        
        // In a real app, this would filter products from the server
        showToast(`Filtering: ${activeCategory}, max ₦${maxPrice.toLocaleString()}, search: "${searchTerm}"`);
    }
    
    function sortProducts() {
        const sortBy = sortDropdownBtn.textContent;
        // In a real app, this would sort products
        showToast(`Sorting by: ${sortBy}`);
    }
    
    function updateCartCount() {
        const cartBadge = document.querySelector('.navbar .badge.bg-dark');
        if (cartBadge) {
            cartBadge.textContent = cartCount;
        }
    }
    
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        
        const toastInner = document.createElement('div');
        toastInner.className = 'toast show';
        toastInner.setAttribute('role', 'alert');
        toastInner.setAttribute('aria-live', 'assertive');
        toastInner.setAttribute('aria-atomic', 'true');
        
        toastInner.innerHTML = `
            <div class="toast-header bg-primary text-white">
                <strong class="me-auto">WOODMATE</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-white">
                ${message}
            </div>
        `;
        
        toast.appendChild(toastInner);
        document.body.appendChild(toast);
        
        // Auto-remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    let cartCount = 0;
    updateCartCount();
    
    // Location filter functionality
    const locationSelect = document.querySelector('.filter-card select.form-select');
    locationSelect.addEventListener('change', filterWorkshops);
    
    // Specialization checkboxes
    const specializationCheckboxes = document.querySelectorAll('.filter-card .form-check-input');
    specializationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterWorkshops);
    });
    
    // IoT Certification radio buttons
    const iotRadios = document.querySelectorAll('input[name="iotCert"]');
    iotRadios.forEach(radio => {
        radio.addEventListener('change', filterWorkshops);
    });
    
    // Experience range slider
    const experienceSlider = document.querySelector('.filter-card .form-range');
    const experienceValues = document.querySelectorAll('.filter-card .d-flex.justify-content-between small');
    experienceSlider.addEventListener('input', function() {
        const years = parseInt(this.value);
        experienceValues[1].textContent = `${years}+ years`;
    });
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('.filter-card button.btn-primary');
    applyFiltersBtn.addEventListener('click', filterWorkshops);
    
    // Search functionality
    const searchInput = document.querySelector('.input-group input');
    const searchBtn = document.querySelector('.input-group button');
    searchBtn.addEventListener('click', function() {
        filterWorkshops();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterWorkshops();
        }
    });
    
    // Navigation pills
    const navPills = document.querySelectorAll('.nav-pills .nav-link');
    navPills.forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.preventDefault();
            navPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            filterWorkshops();
        });
    });
    
    // View Workshop buttons
    const viewWorkshopButtons = document.querySelectorAll('.btn-outline-primary');
    viewWorkshopButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const workshopCard = this.closest('.workshop-card');
            const workshopName = workshopCard.querySelector('.card-title').textContent;
            
            showToast(`Loading ${workshopName} details...`);
        });
    });
    
    // Load More button
    const loadMoreBtn = document.querySelector('.btn-primary.btn-lg');
    loadMoreBtn.addEventListener('click', function() {
        // In a real app, this would load more workshops
        showToast('Loading more workshops...');
    });
    
    // Apply to Join button
    const applyToJoinBtn = document.querySelector('.btn-view-workshop');
    applyToJoinBtn.addEventListener('click', function() {
        showToast('Redirecting to application form...');
    });
    
    // Helper functions
    function filterWorkshops() {
        const location = locationSelect.value;
        const specializations = Array.from(specializationCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.nextElementSibling.textContent);
        const iotCertification = document.querySelector('input[name="iotCert"]:checked').id;
        const minExperience = parseInt(experienceSlider.value);
        const searchTerm = searchInput.value.toLowerCase();
        const activeTab = document.querySelector('.nav-pills .nav-link.active').textContent;
        
        // In a real app, this would filter workshops from the server
        showToast(`Filtering: ${location}, ${specializations.join(', ')}, ${iotCertification}, ${minExperience}+ years, "${searchTerm}", ${activeTab}`);
    }
    
    function updateCartCount() {
        const cartBadge = document.querySelector('.navbar .badge.bg-dark');
        if (cartBadge) {
            cartBadge.textContent = cartCount;
        }
    }
    
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        
        const toastInner = document.createElement('div');
        toastInner.className = 'toast show';
        toastInner.setAttribute('role', 'alert');
        toastInner.setAttribute('aria-live', 'assertive');
        toastInner.setAttribute('aria-atomic', 'true');
        
        toastInner.innerHTML = `
            <div class="toast-header bg-primary text-white">
                <strong class="me-auto">WOODMATE</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-white">
                ${message}
            </div>
        `;
        
        toast.appendChild(toastInner);
        document.body.appendChild(toast);
        
        // Auto-remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
    }
});