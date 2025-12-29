// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown');
    
    // Debug: Check if elements exist
    if (!mobileMenuToggle) {
        console.warn('Mobile menu toggle button not found');
    }
    if (!mainNav) {
        console.warn('Main navigation not found');
    }
    
    // Toggle mobile menu - support both click and touch events
    if (mobileMenuToggle && mainNav) {
        // Function to toggle menu
        function toggleMenu() {
            const isActive = mainNav.classList.contains('active');
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            // Prevent body scroll when menu is open
            if (!isActive) {
                document.body.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
            } else {
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        }
        
        // Click event - use capture phase to ensure it fires
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            toggleMenu();
        }, true);
        
        // Touch event for better mobile support
        let touchStartTime = 0;
        let touchStartY = 0;
        let touchStartX = 0;
        
        mobileMenuToggle.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        mobileMenuToggle.addEventListener('touchend', function(e) {
            const touchEndTime = Date.now();
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaX = Math.abs(touchEndX - touchStartX);
            
            // Only trigger if it was a quick tap (not a swipe)
            if (touchEndTime - touchStartTime < 300 && deltaY < 10 && deltaX < 10) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                toggleMenu();
            }
        }, { passive: false });
    }
    
    // Close mobile menu when clicking outside
    function closeMenu() {
        if (mainNav) {
            mainNav.classList.remove('active');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
    
    // Click outside to close - but not on the button itself
    document.addEventListener('click', function(e) {
        if (mainNav && mainNav.classList.contains('active')) {
            // Don't close if clicking the toggle button (it will handle its own toggle)
            if (mobileMenuToggle && mobileMenuToggle.contains(e.target)) {
                return;
            }
            // Close if clicking outside the menu
            if (!mainNav.contains(e.target)) {
                closeMenu();
            }
        }
    }, true);
    
    // Touch outside to close (for mobile) - but not on the button itself
    document.addEventListener('touchend', function(e) {
        if (mainNav && mainNav.classList.contains('active')) {
            // Don't close if touching the toggle button (it will handle its own toggle)
            if (mobileMenuToggle && mobileMenuToggle.contains(e.target)) {
                return;
            }
            // Close if touching outside the menu
            if (!mainNav.contains(e.target)) {
                closeMenu();
            }
        }
    }, true);
    
    // Handle dropdown toggle on mobile/tablet
    dropdownToggles.forEach(function(toggle) {
        // Use both click and touchstart for better mobile support
        ['click', 'touchend'].forEach(function(eventType) {
            toggle.addEventListener(eventType, function(e) {
                // Check if we're on mobile/tablet (screen width <= 1024px)
                if (window.innerWidth <= 1024px) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = toggle.closest('.dropdown');
                    
                    // Close all other dropdowns
                    dropdownMenus.forEach(function(menu) {
                        if (menu !== dropdown) {
                            menu.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            }, { passive: false });
        });
    });
    
    // Handle clicks on dropdown menu links
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(function(link) {
        // Click event
        link.addEventListener('click', function(e) {
            // Allow the link to navigate normally - don't prevent default
            // Close the mobile menu after navigation
            if (window.innerWidth <= 1024px) {
                closeMenu();
                
                // Close dropdown
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }
        });
        
        // Touch event for better mobile support
        link.addEventListener('touchend', function(e) {
            // Don't prevent default - let the link navigate
            if (window.innerWidth <= 1024px) {
                closeMenu();
                
                // Close dropdown
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }
        });
    });
    
    // Also close menu when clicking regular nav links on mobile
    const navLinks = document.querySelectorAll('.main-nav > ul > li > a:not(.dropdown-toggle)');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024px) {
                closeMenu();
            }
        });
    });
    
    // Close dropdowns when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024px) {
            // Don't close if clicking on a dropdown link (let it navigate)
            if (e.target.closest('.dropdown-menu a')) {
                return;
            }
            
            dropdownMenus.forEach(function(dropdown) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });
    
    // Handle window resize - close mobile menu if resizing to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 1024px) {
                closeMenu();
                dropdownMenus.forEach(function(dropdown) {
                    dropdown.classList.remove('active');
                });
            }
        }, 250);
    });
});
