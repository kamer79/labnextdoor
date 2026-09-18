(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#nav');
  if (!menu || !nav) return;
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false');
  }));
})();
