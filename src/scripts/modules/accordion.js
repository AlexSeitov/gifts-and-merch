export default function accordion(selector) {
  const accordions = document.querySelectorAll(selector);

  accordions.forEach((accordionItem) => {
    accordionItem.addEventListener('click', () => {
      const accordionActive = document.querySelector('.accordion__head.active');

      const accordionText = accordionItem.nextElementSibling;

      accordionItem.classList.toggle('active');

      if (accordionActive && accordionActive !== accordionItem) {
        accordionActive.classList.toggle('active');
        accordionActive.nextElementSibling.style.maxHeight = 0;
      }

      if (accordionItem.classList.contains('active')) {
        accordionText.style.maxHeight = accordionText.scrollHeight + 'px';
      } else {
        accordionText.style.maxHeight = 0;
      }
    });
  });
}
