'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  console.log(window.pageXOffset, window.pageYOffset);
  // window.scroll(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  // gaurd clause
  if (!clicked) return;
  // active tab
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // tab componenet
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handlehover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handlehover.bind(0.5));

nav.addEventListener('mouseout', handlehover.bind(1));

const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;
console.log(navheight);
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
});
observer.observe(header);

const allSections = document.querySelectorAll('.section');
const revealSections = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

const imgTarget = document.querySelectorAll('img[data-src]');
const lazyimage = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageLoader = new IntersectionObserver(lazyimage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imageLoader.observe(img));

// slides
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/*lessons ///////////////////////
///////////////////////////////
////////////////////////////////

const header = document.querySelector('.header');
document.getElementsByTagName('button');
document.getElementsByClassName('section');

const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML = ` we accept all cookies <button class =" btn btn--close-cookie"> got it </button>`;

header.append(message);
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
console.log(message.style.width);
console.log(message.style.height);
console.log(getComputedStyle(message).height);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 25 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// message.style.setProperty('height', '70px');

const logo = document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.className);

logo.alt = ' beautiful logo';

console.log(logo.src);
console.log(logo.getAttribute('src'));

logo.setAttribute('desinger', 'viki');

console.log(logo.getAttribute('desinger'));

console.log(logo.dataset.versionNumber);*/

// const h1 = document.querySelector('h1');

// h1.querySelectorAll('.highlight');

// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);

// console.log(h1.parentNode);
// console.log(h1.parentElement);
// console.log(h1.closest('.header'));
// console.log(h1.closest('h1'));

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('dom is loaded');
});

window.addEventListener('load', function () {
  console.log('page is loaded');
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log('save');
//   e.returnValue = ' ';
// });
