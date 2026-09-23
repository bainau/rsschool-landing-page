const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'true') {
  document.body.classList.add('dark-theme');
}

const themeButton = document.querySelector('.theme-button');

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark-theme')
  );
});
