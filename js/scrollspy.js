document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.content-section');
  const scrollspyLinks = document.querySelectorAll('.scrollspy-nav a');
  
  if (!sections.length || !scrollspyLinks.length) return;


 
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60px 0px',
    threshold: 0.2
  };
  
  const idToLinkMap = {};
  scrollspyLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      idToLinkMap[href.slice(1)] = link;
    }
  });
  
  function removeActiveClass() {
    scrollspyLinks.forEach(link => link.classList.remove('active'));
  }
  
  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const link = idToLinkMap[id];
        if (link) {
          removeActiveClass();
          link.classList.add('active');
        }
      }
    });
  }
  
  const observer = new IntersectionObserver(handleIntersection, observerOptions);
  sections.forEach(section => observer.observe(section));
  
  scrollspyLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!/^#[\w\-_]+$/.test(href)) return;
      const targetSection = document.getElementById(href.slice(1));
      if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const top = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });
});