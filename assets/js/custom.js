
  (function ($) {
  
  "use strict";

    // HERO SLIDE
    $('.hero-slide').backstretch([
      "images/slideshow/white-wall-living-room-have-sofa-decoration-3d-rendering.jpg", 
      "images/slideshow/interior-wall-mockup-with-sofa-cabinet-living-room-with-empty-white-wall-background-3d-rendering.jpg",
      "images/slideshow/wood-sideboard-living-room-interior-with-copy-space.jpg"
    ],  {duration: 2000, fade: 750});

    // REVIEWS CAROUSEL
    $('.reviews-carousel').owlCarousel({
    items:4,
    loop:true,
    dots: false,
    nav: true,
    autoplay: true,
    margin:10,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:3
        },
        1000:{
          items:4
        }
      }
    })

    // CUSTOM LINK
    $('.smoothscroll').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height();

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
    }
});
    
  })(window.jQuery);

// UPDATE THE YEAR
  document.getElementById('current-year').textContent = new Date().getFullYear();
// FILTER SEARCH AND SCROLL
document.addEventListener('DOMContentLoaded', () => {
    const itemsPerLoad = 10;
    let currentItemIndex = 0;
    let currentFilter = 'all';
    let currentSearchTerm = '';

    const searchInput = document.getElementById('product-search');
    const filterButtons = document.querySelectorAll('.filter-button');
    const productItems = document.querySelectorAll('.filterable-item');

    // Utility: normalize string for consistent comparison
    const normalize = str => (str || '').toLowerCase().trim();

    function loadNextBatch() {
        const eligibleItems = Array.from(productItems).filter(
            item => !item.classList.contains('filtered-out')
        );

        for (let i = currentItemIndex; i < currentItemIndex + itemsPerLoad && i < eligibleItems.length; i++) {
            eligibleItems[i].style.display = ''; 
        }

        currentItemIndex += itemsPerLoad;

        if (currentItemIndex >= eligibleItems.length) {
            window.removeEventListener('scroll', checkScrollPosition);
        }
    }

    function checkScrollPosition() {
        const scrollThreshold = 200;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollFromTop = window.scrollY;

        if (scrollFromTop + viewportHeight >= documentHeight - scrollThreshold) {
            loadNextBatch();
        }
    }

    function applyFilters() {
        currentSearchTerm = normalize(searchInput.value);
        let eligibleItemCount = 0;

        productItems.forEach(item => {
            const content = item.querySelector('.product-content');
            if (!content) return;

            const title = normalize(content.dataset.title);
            const categories = normalize(item.dataset.category).split(/\s+/); // split by any whitespace

            const categoryMatch =
                currentFilter === 'all' || categories.includes(normalize(currentFilter));

            const searchMatch = title.includes(currentSearchTerm);

            if (categoryMatch && searchMatch) {
                item.classList.remove('filtered-out');
                item.style.display = 'none'; // hide initially; batch loader will reveal
                eligibleItemCount++;
            } else {
                item.classList.add('filtered-out');
                item.style.display = 'none';
            }
        });

        // reset state
        currentItemIndex = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        window.removeEventListener('scroll', checkScrollPosition);
        if (eligibleItemCount > 0) {
            window.addEventListener('scroll', checkScrollPosition);
            loadNextBatch();
        }
    }

    // --- Event listeners ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            searchInput.value = '';
            applyFilters();
        });
    });

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 250); // debounce for performance
    });

    // Initial load
    applyFilters();
});



