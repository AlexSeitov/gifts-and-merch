export default function smoothScroll(selector) {
  const links = document.querySelectorAll(selector);

  function clickHandler(e) {
    e.preventDefault();

    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop;
    /* eslint-disable no-restricted-globals */
    scroll({
      top: offsetTop,
      behavior: 'smooth'
    });
    /* eslint-disable no-restricted-globals */
  }

  links.forEach((link) => {
    link.addEventListener('click', clickHandler);
  });
}
