
const themeToggleButtons = document.querySelectorAll('.theme-toggle');
const htmlElement = document.documentElement;


const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;


function initializeTheme() {
  if (savedTheme) {
    htmlElement.className = savedTheme;
  } else {
    htmlElement.className = 'dark-theme';
  }
}

function toggleTheme() {
  if (htmlElement.classList.contains('dark-theme')) {
    htmlElement.classList.remove('dark-theme');
    htmlElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light-theme');
  } else {
    htmlElement.classList.remove('light-theme');
    htmlElement.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark-theme');
  }
}

themeToggleButtons.forEach(button => {
  button.addEventListener('click', toggleTheme);
});
document.addEventListener('DOMContentLoaded', initializeTheme);
