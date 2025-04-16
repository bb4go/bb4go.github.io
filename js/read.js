function estimateReadingTime(content, wordsPerMinute = 100) {
    const text = content.innerText || content.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    return time;
}

document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.querySelector(".main-content");
    const display = document.getElementById("reading-time");

    if (mainContent && display) {
        const time = estimateReadingTime(mainContent);
        display.textContent = `${time} min read`;
    }
});
