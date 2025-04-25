function estimateReadingTime(content, wpm = 100, codeWeight = 0.5) {
    const clone = content.cloneNode(true);
    const codeBlocks = clone.querySelectorAll('pre, code');
    
    let codeWords = 0;
    codeBlocks.forEach(el => {
        codeWords += el.textContent.trim().split(/\s+/).length;
        el.remove();
    });
    
    const textWords = clone.textContent.trim().split(/\s+/).length;
    return Math.ceil((textWords + codeWords * codeWeight) / wpm);
}

document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector(".main-content");
    const display = document.getElementById("reading-time");
    if (content && display) {
        display.textContent = `${estimateReadingTime(content)} min read`;
    }
});
