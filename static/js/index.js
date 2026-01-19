window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Simulation carousel navigation
    var currentSimulationSlide = 0;
    var simulationContainer = document.querySelector('.simulation-carousel-container');
    var simulationItems = document.querySelectorAll('.simulation-carousel-item');
    var simulationVideos = document.querySelectorAll('.simulation-video');
    var totalSimulationSlides = simulationItems.length;
    var prevButton = document.querySelector('.carousel-prev');
    var nextButton = document.querySelector('.carousel-next');
    var videosPerView = 3; // Show up to 3 videos at a time

    function getVideosPerView() {
      if (window.innerWidth <= 768) {
        return 1;
      } else if (window.innerWidth <= 1024) {
        return 2;
      }
      return 3;
    }

    function updateSimulationCarousel() {
      if (simulationContainer && simulationItems.length > 0) {
        videosPerView = getVideosPerView();
        var maxSlide = Math.max(0, totalSimulationSlides - videosPerView);
        currentSimulationSlide = Math.min(currentSimulationSlide, maxSlide);
        
        var itemWidth = simulationItems[0].offsetWidth + 20; // Include gap
        var translateX = currentSimulationSlide * itemWidth;
        simulationContainer.style.transform = `translateX(-${translateX}px)`;
        
        // Pause videos that are not visible
        simulationVideos.forEach(function(video, index) {
          if (index >= currentSimulationSlide && index < currentSimulationSlide + videosPerView) {
            video.play();
          } else {
            video.pause();
          }
        });
      }
    }

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', function() {
        videosPerView = getVideosPerView();
        currentSimulationSlide = Math.max(0, currentSimulationSlide - 1);
        updateSimulationCarousel();
      });

      nextButton.addEventListener('click', function() {
        videosPerView = getVideosPerView();
        var maxSlide = Math.max(0, totalSimulationSlides - videosPerView);
        currentSimulationSlide = Math.min(maxSlide, currentSimulationSlide + 1);
        updateSimulationCarousel();
      });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
      updateSimulationCarousel();
    });

    // Initialize carousel
    if (simulationVideos.length > 0) {
      updateSimulationCarousel();
    }

})
