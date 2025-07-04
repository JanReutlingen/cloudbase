document.addEventListener('DOMContentLoaded', function () {
    const logoBtn = document.getElementById('logo-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('side-menu-overlay');

    overlay.onclick = function () {
        closeNavMenu();
    };

    closeBtn.onclick = function () {
        closeNavMenu();
    };

    function closeNavMenu() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('show');
    }
});

// Reviews Carousel Functionality
let currentReview = 1;
const totalReviews = 3;

function showReview(reviewNumber) {
    // Hide all review cards
    document.querySelectorAll('.review-card').forEach(card => {
        card.classList.remove('active', 'prev');
    });
    
    // Hide all indicators
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show selected review
    const selectedCard = document.querySelector(`[data-review="${reviewNumber}"]`);
    const selectedIndicator = document.querySelector(`.indicator[data-review="${reviewNumber}"]`);
    
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    if (selectedIndicator) {
        selectedIndicator.classList.add('active');
    }
    
    currentReview = reviewNumber;
}

function nextReview() {
    const next = currentReview >= totalReviews ? 1 : currentReview + 1;
    showReview(next);
}

function previousReview() {
    const prev = currentReview <= 1 ? totalReviews : currentReview - 1;
    showReview(prev);
}

// Auto-rotate reviews every 8 seconds
setInterval(nextReview, 8000);

// Add click handlers for indicators
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const reviewNumber = parseInt(this.getAttribute('data-review'));
            showReview(reviewNumber);
        });
    });
    
    // Add click handlers for review cards to expand them
    document.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('click', function() {
            // Add click behavior here if needed (e.g., expand full review)
            console.log('Review card clicked');
        });
    });
});

