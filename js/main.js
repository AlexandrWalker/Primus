gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, ScrollSmoother, TweenMax);

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Инициализация Lenis
   */
  const lenis = new Lenis({
    anchors: {
      offset: 0,
    }
  });

  document.getElementById('preloaderApprove').addEventListener('click', () => {
    document.getElementById('preloader').classList.add('remove');
    document.documentElement.classList.remove('pleloaderShow');
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /**
   * Разбиение текста по буквам
   */
  const titleChars = document.querySelectorAll('[data-splitting="chars"]');
  titleChars.forEach(titleChar => {
    const char = new SplitType(titleChar.querySelector('p'), { types: 'words, chars' });
  });

  /* Инициализация swiper */
  const pagesContainer = document.querySelector('.page__container');
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
    navigation: {
      //   nextPrev: '.button__prev',
      nextEl: '.button__next',
    },
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
      thresholdTime: 1000
    },
    keyboard: true,
    speed: 400,
    loop: true,
    on: {
      transitionEnd: $.proxy(_transitionEnd, this),
    }
  });

  setTimeout(() => {
    if (document.querySelector('.page')) { document.querySelector('.page').classList.add('complete'); }
  }, 1000);

  function _transitionEnd(slider) {

    const { activeIndex } = slider;
    const html = document.documentElement;

    const prefix = 'pp';
    const class4rem = html.className.split(' ').filter(c => c.startsWith(prefix))[0];

    html.classList.remove(class4rem);
    html.classList.add('pp-' + slider.slides[activeIndex].dataset.hash);

    // slider.slides[activeIndex - 1] ? slider.slides[activeIndex - 1].classList.add('complete') : slider.slides[activeIndex];

    checkMenuActive(slider.slides[activeIndex].dataset.hash);
    anim(slider.slides[activeIndex].dataset.hash, slider.slides[activeIndex]);

    if (slider.slides[activeIndex]) {
      slider.slides[activeIndex].classList.add('complete');
    }

    if ((slider.slides.length - 1) == activeIndex) {

      console.log('a')
    }
  }

  function checkMenuActive(hash) {
    const menuItems = document.querySelectorAll('ul.main__menu a[href*="#"]');

    for (let menuItem of menuItems) {
      if (menuItem.classList.contains('is__active'))
        menuItem.classList.remove('is__active')
    }

    const curMenuItem = document.querySelector('ul.main__menu a[href*="#' + hash + '"]');

    if (curMenuItem !== null)
      curMenuItem.classList.add('is__active');
  }

  function anim(hash, slide) {
    const aboutPage = document.querySelector('.about-page');
    if (aboutPage) {
      if (!document.querySelector('.' + `${hash}`).classList.contains('complete')) {
        const pageTitle = aboutPage.querySelector('.' + `${hash}` + ' .page__title img');
        if (pageTitle) {
          gsap.fromTo(pageTitle,
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
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: '.page[class*="' + hash + '"]',
                start: 'top 100%',
                end: 'bottom top',
              },
            }
          );
        }

        const pageDate = aboutPage.querySelector('.' + `${hash}` + ' .page__date img');
        if (pageDate) {
          gsap.fromTo(pageDate,
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
              duration: 1,
              delay: 0.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: '.page[class*="' + hash + '"]',
                start: 'top 100%',
                end: 'bottom top',
              }
            }
          );
        }

        const fadeInItems = document.querySelectorAll('[data-transform="fadeIn"]');
        fadeInItems.forEach(fadeInItem => {
          const chars = fadeInItem.querySelectorAll("div.char");
          const tl = gsap.timeline({
            paused: true
          });
          tl.fromTo(chars, {
            opacity: 0,
          }, {
            opacity: 1,
            duration: 1,
            delay: 0.4,
            ease: "power1.out",
            stagger: {
              amount: .3
            }
          });
          scrollTriggerPlayer(fadeInItem, tl)
        });
      }

      gsap.registerPlugin(ScrollTrigger);
    }
  }
  anim('begin');

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
      // trigger: '.page[class*="' + triggerElement + '"]',
      trigger: triggerElement,
      start: 'top 100%',
      end: 'bottom top',
      onEnter: () => timeline.play(),
    })
  }

  /**
   * GSAP
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

    /* Анимация mask */
    $(".wrapper").mousemove(function (e) {
      const masks = document.querySelectorAll('.mask');
      masks.forEach(mask => {
        parallaxIt(e, mask, -50);
        // parallaxIt(e, ".page__object", -100);
      });
    });

    function parallaxIt(e, target, movement) {
      var $this = $(target);
      var relX = e.pageX - $this.offset().left;
      var relY = e.pageY - $this.offset().top;

      TweenMax.to(target, 1, {
        x: (relX - $this.width() / 2) / $this.width() * movement,
        y: (relY - $this.height() / 2) / $this.height() * movement,
        ease: 'none'
      });
    }

  });

  const magneticButtons = document.querySelectorAll('.magnetic');
  magneticButtons.forEach((button) => {

    const magnetic_hit = button.querySelector('.magnetic__hit');
    const magnetic_inner = button.querySelector('.magnetic__inner');
    const magnetic_text = button.querySelector('.magnetic__text');

    magnetic_hit.addEventListener('mousemove', function (e) {
      const position = button.getBoundingClientRect();

      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;

      magnetic_inner.style.transform = 'translate(' + x * 0.3 + 'px, ' + y * 0.5 + 'px)';
      magnetic_text.style.transform = 'translate(' + x * 0.05 + 'px, ' + y * 0.15 + 'px) scale(1.1, 1.1)';
    });

    magnetic_hit.addEventListener('mouseout', function (e) {
      magnetic_inner.style.transform = 'translate(0px, 0px)';
      magnetic_text.style.transform = 'translate(0px, 0px) scale(1, 1)';
    });

    button.addEventListener('click', function (e) {
      e.preventDefault();

      let data_target = this.dataset.target;
      let data_detail = document.querySelector('[data-id="' + data_target + '"]');

      if (data_detail) {
        document.documentElement.classList.add('panel-open');
        data_detail.classList.add('is__open');

        PrimusProduction.pagesSwiper.disable();

        let backdrop = data_detail.querySelector('.backdrop');
        backdrop.addEventListener('click', function () {

          PrimusProduction.pagesSwiper.enable();

          data_detail.classList.remove('is__open');
          document.documentElement.classList.remove('panel-open');
        });


        let buttonClose = data_detail.querySelector('.button__close');
        buttonClose.addEventListener('click', function () {

          PrimusProduction.pagesSwiper.enable();

          data_detail.classList.remove('is__open');
          document.documentElement.classList.remove('panel-open');
        });
      }
    });
  });

  window.addEventListener('resize scroll', function () { ScrollTrigger.refresh() });

  const btnMenuOpen = document.querySelector('[data-entity="menu-open"]')
  const btnMenuClose = document.querySelector('[data-entity="menu-close"]')

  btnMenuOpen.addEventListener('click', function () {
    document.documentElement.classList.add('menu-open');

    const asd = document.querySelectorAll('.nav__second ul li');
    for (let i = 0; asd.length != asd[i]; i++) {
      const a = asd[i].querySelector('a.nav__second-link');
      gsap.fromTo(a,
        {
          y: '+3%',
          opacity: 0,
        },
        {
          y: '0',
          opacity: 1,
          duration: 1,
          delay: 0.1 * i,
          ease: "power4.out",
          scrollTrigger: {
            trigger: '.menu-open .nav__second',
            start: 'top 100%',
            end: 'bottom top',
          }
        }
      );
    }
  });

  btnMenuClose.addEventListener('click', function () {
    document.documentElement.classList.remove('menu-open');
  });
});