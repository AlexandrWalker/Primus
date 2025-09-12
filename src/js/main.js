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

  /**
   * GSAP
   * 
   */
  $(window).on('resize load', function () {
    if (window.innerWidth > '834') {

      const parallaxImgBoxes = document.querySelector('[data-animation="parallax-item"]');
      const begin = document.querySelector('.begin');
      gsap.fromTo(parallaxImgBoxes,
        { y: '-50%' },
        {
          y: '20%',
          scrollTrigger: {
            trigger: begin,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    };

    gsap.registerPlugin(ScrollTrigger);

  });

  window.addEventListener('resize scroll', function () { ScrollTrigger.refresh() });

});