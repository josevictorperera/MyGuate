
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

//SHARE LINK ON HEADER
document.addEventListener('DOMContentLoaded', () => {

    const shareToggle = document.getElementById('share-toggle');
    const shareOptions = document.getElementById('share-options');

    if (shareToggle && shareOptions) {
        shareToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            shareOptions.classList.toggle('active');
        });
    }

    document.addEventListener('click', function(event) {
        const container = document.querySelector('.share-container');
        if (container && !container.contains(event.target)) {
            if (shareOptions) shareOptions.classList.remove('active');
        }
    });

});

// Copy to Clipboard Function (as before, but using window.location.href)
function copyToClipboard(url) {
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('¡Enlace copiado al portapapeles!');
            document.getElementById('share-options').classList.remove('active'); // Close panel after copying
        })
        .catch(err => {
            console.error('No se pudo copiar el texto: ', err);
        });
}
//HIDE THE HOME LINK WHEN ON HOME PAGE
document.addEventListener('DOMContentLoaded', function() {
    const homeNavItem = document.getElementById('home-nav-item');
    
    // Get the part of the URL that comes after the domain (e.g., '/index.html')
    let currentPath = window.location.pathname;

    // Normalize the path for comparison. 
    // This removes leading slashes and ensures consistency.
    // Example: '/' and '/index.html' are common home page paths.
    // We check for the explicit file name OR the root path.
    
    if (homeNavItem) {
        // Condition 1: Check if the path ends with /index.html (case insensitive)
        const isIndexFile = currentPath.toLowerCase().endsWith('/index.html');

        // Condition 2: Check if the path is just the root '/'
        const isRootPath = currentPath === '/';
        
        // If the user is on the home page, hide the navigation item
        if (isIndexFile || isRootPath) {
            homeNavItem.style.display = 'none';
        }
    }
});
/*
//SYNC QUANTITY WITH SNIPCART
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('add-to-cart');
    btn.addEventListener('click', function() {
        const qty = document.getElementById('quantity_input').value;
        this.setAttribute('data-item-quantity', qty);
    });
});*/

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('add-to-cart');
    if (btn) {
        btn.addEventListener('click', function() {
            const qtyInput = document.getElementById('quantity_input');
            if (qtyInput) {
                this.setAttribute('data-item-quantity', qtyInput.value);
            }
        });
    }
});
  

// SNIPCART TEMPLATE LOADER
(function () {
  const settings = window.SnipcartSettings || {};
  const loadEvents = ["focus", "mouseover", "touchmove", "scroll", "keydown"];
  let initialized = false;

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();

  function init() {
    if (settings.loadStrategy === "on-user-interaction") {
      loadEvents.forEach(evt => document.addEventListener(evt, loadSnipcart));
      setTimeout(loadSnipcart, settings.timeoutDuration);
    } else {
      loadSnipcart();
    }
  }

  function loadSnipcart() {
    if (initialized) return;
    initialized = true;

    createRoot();
    injectBaseCSS();
    injectCustomThemeCSS();   // <-- THE OVERRIDE FILE

    loadEvents.forEach(evt =>
      document.removeEventListener(evt, loadSnipcart)
    );
  }

  function createRoot() {
    let root = document.getElementById("snipcart");

    if (!root) {
      root = document.createElement("div");
      root.id = "snipcart";
      root.hidden = true;
      document.body.appendChild(root);
    }

    applySettings(root);
  }

  function applySettings(root) {
    const s = window.SnipcartSettings;

    if (s.publicApiKey) root.dataset.apiKey = s.publicApiKey;
    if (s.currency) root.dataset.currency = s.currency;
    if (s.templatesUrl) root.dataset.templatesUrl = s.templatesUrl;
    if (s.modalStyle) root.dataset.configModalStyle = s.modalStyle;
    if (s.addProductBehavior)
      root.dataset.configAddProductBehavior = s.addProductBehavior;
  }

  function injectBaseCSS() {
    if (!document.querySelector('link[href$="snipcart.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/assets/css/snipcart.css";
      document.head.prepend(link);
    }
  }

  function injectCustomThemeCSS() {
    if (!document.querySelector('link[href$="snipcart-theme.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/assets/css/snipcart-theme.css";
      document.head.appendChild(link);
    }
  }

})();

//LANGUAGE VALIDATION

    document.addEventListener('snipcart.ready', function() {
        Snipcart.api.session.setLanguage('es', {
            "payment": {
                "form": {
                    "deferred_payment_instructions": "Pagará el pedido cuando lo reciba. Por favor asegúrese de estar disponible en la dirección proporcionada.",
                    "deferred_payment_title": "Pago contra entrega"
                },
                "methods": {
                    "deferred_payment": "=> Completar el Pedido",
                },
                "title": "Paga con Tarjeta, con Fri o solo contra entrega y completa el pedido.",                
            },

        });
    });
// TILO PAY LINK 
document.addEventListener("DOMContentLoaded", function () {
    if (typeof tlpmbdInit === "function") {
        tlpmbdInit(); // attaches Tilopay behavior to #tlpmbd-btn-pay
    }
});
