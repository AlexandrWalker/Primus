gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, ScrollSmoother);

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Инициализация GSAP ScrollSmoother
   */
  // gsap.registerPlugin(ScrollSmoother);
  // ScrollSmoother.create({
  //   smooth: 1,
  //   effects: true,
  //   smoothTouch: 0.5,
  // });

  /**
   * Инициализация Lenis
   */
  const lenis = new Lenis({
    anchors: {
      // offset: -180,
      offset: 0,
    }
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);



  /* Инициализация swiper */
  const pagesContainer = document.querySelector('.main__container');
  pagesSwiper = new Swiper(pagesContainer, {
    slideClass: 'page',
    slideActiveClass: 'page--current',
    slideNextClass: 'page--next',
    slidePrevClass: 'page--prev',
    watchOverflow: true,
    direction: 'vertical',

    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: true,
        translate: [0, "-20%", -1],
      },
      next: {
        translate: [0, "100%", 0],
      },
    },

    hashNavigation: {
      watchState: true,
    },
    // navigation: {
    //   nextPrev: '.button__prev',
    //   nextEl: '.button__next',
    // },
    pagination: {
      el: '[data-entity="bullets"]',
      bulletClass: 'bullets__item',
      bulletActiveClass: 'is__active',
      clickable: true,
      clickableClass: 'bullets--clickable',
      verticalClass: 'bullets--vertical',
      modifierClass: '',
      renderBullet: function (index, className) {
        return '<div class="' + className + '"></div>';
      },
    },
    mousewheel: {
      forceToAxis: true,
      sensitivity: 0.5,
      releaseOnEdges: true,
      thresholdTime: 1200
    },
    keyboard: true,
    speed: 600,
    on: {
      transitionEnd: $.proxy(_transitionEnd, this),
      // snapIndexChange: BX.proxy(this._transitionEnd, this),
    }
  });

  function _transitionEnd(slider) {

    const { activeIndex } = slider;
    const html = document.documentElement;

    const prefix = 'pp';
    const class4rem = html.className.split(' ').filter(c => c.startsWith(prefix))[0];

    html.classList.remove(class4rem);
    html.classList.add('pp-' + slider.slides[activeIndex].dataset.hash);

    checkMenuActive(slider.slides[activeIndex].dataset.hash);
    // anim(slider.slides[activeIndex].dataset.anim);

    if ((slider.slides.length - 1) == activeIndex) {

      console.log('a')
    }
  }

  function checkMenuActive(hash) {
    const menuItems = document.querySelectorAll('ul.main__menu a[href*="#"]');

    console.log(menuItems);

    for (let menuItem of menuItems) {
      if (menuItem.classList.contains('is__active'))
        menuItem.classList.remove('is__active')
    }

    const curMenuItem = document.querySelector('ul.main__menu a[href*="#' + hash + '"]');

    if (curMenuItem !== null)
      curMenuItem.classList.add('is__active');
  }

  function anim(hash) {
    const aboutPage = document.querySelector('.about-page');
    if (aboutPage) {
      const pages = aboutPage.querySelectorAll('.page');
      pages.forEach(page => {

        // const tl = gsap.timeline({
        //   paused: true
        // });

        let pageTitle = page.querySelector('.page__title');
        let pageTitleSvgs = page.querySelectorAll('.page__title-svg');
        pageTitleSvgs.forEach(pageTitleSvg => {
          gsap.fromTo(pageTitleSvg,
            {
              y: '+5%',
              opacity: 0,
              rotate: '20deg',
              transformOrigin: "0 50%"
            },
            {
              y: '0',
              opacity: 1,
              rotate: '0',
              duration: 0.8,
              scrollTrigger: {
                trigger: '.page[class*="' + hash + '"]',
                start: 'top 100%',
                end: 'bottom top',
              }
            }
          );
        });

        let pageDate = page.querySelector('.page__date');
        let pageDateSvg = page.querySelector('.page__date-svg');
        gsap.fromTo(pageDateSvg,
          {
            y: '+5%',
            opacity: 0,
            rotate: '20deg',
            transformOrigin: "0 50%"
          },
          {
            y: '0',
            opacity: 1,
            rotate: '0',
            duration: 0.8,
            delay: 0.2,
            // delay: -0.4,
            scrollTrigger: {
              trigger: '.page[class*="' + hash + '"]',
              start: 'top 100%',
              end: 'bottom top',
            }
          }
        );
        // scrollTriggerPlayer(hash, tl)
      });
      gsap.registerPlugin(ScrollTrigger);
    }
  }
  anim('begin');

  /**
   * Разбиение текста по буквам
   */
  const titleChars = document.querySelectorAll('[data-splitting="chars"]');
  titleChars.forEach(titleChar => {
    const char = new SplitType(titleChar.querySelector('p'), { types: 'words, chars' });
  });

  const fadeInItems = document.querySelectorAll('[data-transform="fadeIn"]');
  fadeInItems.forEach(fadeInItem => {
    const chars = fadeInItem.querySelectorAll("div.char");
    const tl = gsap.timeline({
      paused: true
    });
    tl.from(chars, {
      opacity: 0,
      duration: .8,
      delay: 0.4,
      ease: "power1.out",
      stagger: {
        amount: .3
      }
    });
    scrollTriggerPlayer(fadeInItem, tl)
  });

  function scrollTriggerPlayer(triggerElement, timeline, onEnterStart = "top 85%") {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(1);
        timeline.pause()
      }
    });
    ScrollTrigger.create({
      trigger: '.page[class*="' + triggerElement + '"]',
      start: 'top 100%',
      end: 'bottom top',
      onEnter: () => timeline.play(),
    })
  }

  /**
 * GSAP
 * 
 */
  $(window).on('resize load', function () {
    //   if (window.innerWidth > 834) {

    //     const parallaxImgBoxes = document.querySelector('[data-animation="parallax-item"]');
    //     const begin = document.querySelector('.begin');
    //     gsap.fromTo(parallaxImgBoxes,
    //       { y: '-50%' },
    //       {
    //         y: '20%',
    //         scrollTrigger: {
    //           trigger: begin,
    //           start: 'top 90%',
    //           end: 'bottom top',
    //           scrub: true,
    //         },
    //       }
    //     );

    //   } else if (window.innerWidth > 600) {

    //     const parallaxImgBoxes = document.querySelector('[data-animation="parallax-item"]');
    //     const begin = document.querySelector('.begin');
    //     gsap.fromTo(parallaxImgBoxes,
    //       { y: '-50%' },
    //       {
    //         y: '20%',
    //         scrollTrigger: {
    //           trigger: begin,
    //           start: 'top 90%',
    //           end: 'bottom top',
    //           scrub: true,
    //         },
    //       }
    //     );

    //   };



  });

  window.addEventListener('resize scroll', function () { ScrollTrigger.refresh() });
});