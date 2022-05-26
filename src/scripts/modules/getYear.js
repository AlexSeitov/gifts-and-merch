export default function getCurrentYear(selector) {
  const yearElement = document.getElementById(selector);
  const currentYear = new Date().getFullYear();
  yearElement.innerText = currentYear;
}
