document.documentElement.classList.add('js');

const langButton = document.querySelector('[data-language-toggle]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const filterButtons = document.querySelectorAll('[data-filter]');
const newsCards = document.querySelectorAll('[data-content-type]');
const languageStorageKey = 'jrc-language-v2';

function setLanguage(language) {
  const next = language === 'en' ? 'en' : 'zh';
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach((element) => {
    element.textContent = element.dataset[next];
  });
  document.querySelectorAll('[data-alt-zh][data-alt-en]').forEach((image) => {
    image.alt = next === 'zh' ? image.dataset.altZh : image.dataset.altEn;
  });
  langButton.textContent = next === 'zh' ? 'EN' : '中文';
  langButton.setAttribute('aria-label', next === 'zh' ? 'Switch to English' : '切换至中文');
  document.title = next === 'zh'
    ? '社会经济系统区域联合研究中心'
    : 'Joint Research Center for Regional Socio-Economic Systems';
  localStorage.setItem(languageStorageKey, next);
}

langButton.addEventListener('click', () => {
  setLanguage(document.documentElement.lang.startsWith('zh') ? 'en' : 'zh');
});

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    newsCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.contentType !== filter;
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

setLanguage(localStorage.getItem(languageStorageKey) || 'en');
