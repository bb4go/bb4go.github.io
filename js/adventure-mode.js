document.addEventListener('DOMContentLoaded', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.scrollspy-nav a');

  const adventureModeContainer = document.createElement('div');
  adventureModeContainer.className = 'adventure-mode-container';

  const adventureModeBtn = document.createElement('button');
  adventureModeBtn.className = 'adventure-mode-btn';
  adventureModeBtn.textContent = '🔍 Enter Adventure Mode';
  adventureModeBtn.setAttribute('aria-label', 'Enter Adventure Mode');
  adventureModeBtn.setAttribute('title', 'Enter a guided challenge mode. Sections will be hidden. Click through to explore and reveal content as you progress.');

  const exitAdventureModeBtn = document.createElement('button');
  exitAdventureModeBtn.className = 'adventure-mode-btn adventure-mode-btn-exit';
  exitAdventureModeBtn.textContent = '❌ Exit Adventure Mode';
  exitAdventureModeBtn.setAttribute('aria-label', 'Exit Adventure Mode');
  exitAdventureModeBtn.style.display = 'none';

  adventureModeContainer.appendChild(adventureModeBtn);
  adventureModeContainer.appendChild(exitAdventureModeBtn);

  const articleHeader = document.querySelector('.article-header');
  if (articleHeader) {
    articleHeader.insertAdjacentElement('afterend', adventureModeContainer);
  }

  const AdventureState = {
    timeout: 30 * 60 * 1000, // 30 minutes

    getUnlockedIndex() {
      const index = parseInt(sessionStorage.getItem('unlockedSections'), 10);
      return Number.isNaN(index) ? 0 : Math.min(index, contentSections.length - 1);
    },

    isModeActive() {
      return sessionStorage.getItem('adventureModeActive') === 'true';
    },

    isFresh() {
      const ts = parseInt(sessionStorage.getItem('adventureModeTimestamp'), 10);
      return !isNaN(ts) && (Date.now() - ts < this.timeout);
    },

    save(index) {
      sessionStorage.setItem('adventureModeActive', 'true');
      sessionStorage.setItem('unlockedSections', index.toString());
      sessionStorage.setItem('adventureModeTimestamp', Date.now().toString());
    },

    clear() {
      sessionStorage.removeItem('adventureModeActive');
      sessionStorage.removeItem('unlockedSections');
      sessionStorage.removeItem('adventureModeTimestamp');
    }
  };

  function createNextSectionButton(sectionIndex) {
    const btn = document.createElement('button');
    btn.className = 'next-section-btn';
    btn.textContent = 'Next Section →';
    btn.setAttribute('data-next-section', sectionIndex + 1);
    btn.addEventListener('click', () => revealNextSection(sectionIndex + 1));
    return btn;
  }

  function revealNextSection(index) {
    if (index < contentSections.length) {
      contentSections[index].classList.remove('adventure-hidden');

      // Remove all existing next-section buttons before adding a new one
      document.querySelectorAll('.next-section-btn').forEach(btn => btn.remove());

      if (navItems[index]) {
        navItems[index].parentElement.classList.remove('nav-locked');
      }

      const ariaLive = document.createElement('div');
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.className = 'sr-only';
      ariaLive.textContent = `Section unlocked: ${contentSections[index].querySelector('h2')?.textContent || 'Section'}`;
      document.body.appendChild(ariaLive);
      setTimeout(() => ariaLive.remove(), 3000);

      contentSections[index].scrollIntoView({ behavior: 'smooth' });
      AdventureState.save(index);

      if (index < contentSections.length - 1 && !contentSections[index].querySelector('.next-section-btn')) {
        contentSections[index].appendChild(createNextSectionButton(index));
      }
    }
  }

  function enterAdventureMode() {
    contentSections.forEach((section, i) => {
      if (i > 0) section.classList.add('adventure-hidden');
    });

    const first = contentSections[0];
    if (!first.querySelector('.next-section-btn')) {
      first.appendChild(createNextSectionButton(0));
    }

    navItems.forEach((item, i) => {
      if (i > 0) {
        item.parentElement.classList.add('nav-locked');
        item.setAttribute('title', 'This section is locked. Continue through the write-up to unlock it.');
      }
    });

    adventureModeBtn.style.display = 'none';
    exitAdventureModeBtn.style.display = 'flex';

    AdventureState.save(0);

    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = 'Adventure Mode activated. Only the Introduction section is visible.';
    document.body.appendChild(ariaLive);
    setTimeout(() => ariaLive.remove(), 3000);
  }

  function exitAdventureMode() {
    contentSections.forEach(section => section.classList.remove('adventure-hidden'));
    document.querySelectorAll('.next-section-btn').forEach(btn => btn.remove());
    navItems.forEach(item => {
      item.parentElement.classList.remove('nav-locked');
      item.removeAttribute('title');
    });

    adventureModeBtn.style.display = 'flex';
    exitAdventureModeBtn.style.display = 'none';

    AdventureState.clear();

    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = 'Adventure Mode deactivated. All sections are now visible.';
    document.body.appendChild(ariaLive);
    setTimeout(() => ariaLive.remove(), 3000);
  }

  function restoreAdventureModeState() {
    if (!AdventureState.isModeActive() || !AdventureState.isFresh()) {
      AdventureState.clear();
      return;
    }

    adventureModeBtn.style.display = 'none';
    exitAdventureModeBtn.style.display = 'flex';

    const lastUnlockedIndex = AdventureState.getUnlockedIndex();

    contentSections.forEach((section, i) => {
      if (i > lastUnlockedIndex) {
        section.classList.add('adventure-hidden');
      } else if (i < lastUnlockedIndex && i < contentSections.length - 1) {
        if (!section.querySelector('.next-section-btn')) {
          section.appendChild(createNextSectionButton(i));
        }
      }
    });

    navItems.forEach((item, i) => {
      if (i > lastUnlockedIndex) {
        item.parentElement.classList.add('nav-locked');
        item.setAttribute('title', 'This section is locked. Continue through the write-up to unlock it.');
      }
    });

    const currentSection = contentSections[lastUnlockedIndex];
    if (lastUnlockedIndex < contentSections.length - 1 && !currentSection.querySelector('.next-section-btn')) {
      currentSection.appendChild(createNextSectionButton(lastUnlockedIndex));
    }
  }

  adventureModeBtn.addEventListener('click', enterAdventureMode);
  exitAdventureModeBtn.addEventListener('click', exitAdventureMode);

  navItems.forEach((item, index) => {
    if (index > 0) {
      if (AdventureState.isModeActive()) {
        item.parentElement.classList.add('nav-locked');
        item.setAttribute('title', 'This section is locked. Continue through the write-up to unlock it.');
      } else {
        item.parentElement.classList.remove('nav-locked');
        item.removeAttribute('title');
      }
    }

    item.addEventListener('click', e => {
      if (item.parentElement.classList.contains('nav-locked')) {
        e.preventDefault();
      }
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(style);

  restoreAdventureModeState();
});
