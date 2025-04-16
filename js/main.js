
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      
  
      document.body.classList.toggle('menu-open');
    });
    

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
    

    document.addEventListener('click', function(event) {
      if (!mainNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
  

  document.querySelectorAll('a[href^="#"]:not(.scrollspy-nav a)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      

      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        

        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  

  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-list li');
    
    navItems.forEach(item => {
      const anchor = item.querySelector('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      

      if (href === 'index.html' && (currentPath === '/' || currentPath.includes('index.html'))) {
        item.classList.add('active');
      }
 
      else if (currentPath.includes(href) && href !== 'index.html') {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  

  setActiveNavItem();
  

  document.querySelectorAll('.expandable-image').forEach(img => {
    img.addEventListener('click', function() {
      this.classList.toggle('expanded');
    });
  });
  

  const terminalCursor = document.querySelector('.terminal-cursor');
  if (terminalCursor) {
    setInterval(() => {
      terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
    }, 500);
  }
  

  if ('loading' in HTMLImageElement.prototype) {

    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.setAttribute('loading', 'lazy');
    });
  } else {

  }
  

  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
});
