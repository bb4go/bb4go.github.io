document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.copy-btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const pre = button.nextElementSibling;
      const firstLine = pre.innerText.split('\n')[0].trim();

      // Only copy what comes after the first '$'
      const command = firstLine.includes('$')
        ? firstLine.split('$').slice(1).join('$').trim()
        : firstLine;

      const textarea = document.createElement('textarea');
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999);

      try {
        const success = document.execCommand('copy');
        button.textContent = success ? '✅ Copied!' : '❌ Failed';
      } catch (err) {
        console.error('Copy error:', err);
        button.textContent = '❌ Error';
      }

      document.body.removeChild(textarea);

      setTimeout(() => {
        button.textContent = '📋 Copy';
      }, 2000);
    });
  });
});

