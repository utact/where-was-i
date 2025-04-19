export function createFloatingProgressBar(): void {
  const existing = document.getElementById("wwi-progress-bar-container");
  if (existing) return; // 중복 생성 방지

  const progressContainer = document.createElement("div");
  progressContainer.id = "wwi-progress-bar-container";
  progressContainer.style.position = "fixed";
  progressContainer.style.top = "0";
  progressContainer.style.left = "0";
  progressContainer.style.width = "100%";
  progressContainer.style.height = "5px";
  progressContainer.style.backgroundColor = "#e0e0e0";
  progressContainer.style.zIndex = "9999";

  const progressBar = document.createElement("div");
  progressBar.id = "wwi-progress-bar";
  progressBar.style.height = "100%";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#81c784";
  progressBar.style.transition = "width 0.2s ease-out";

  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);
}

export function updateProgressBar(): void {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  let progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
  if (progress > 1) progress = 1;

  const bar = document.getElementById("wwi-progress-bar");
  if (bar) {
    bar.style.width = `${progress * 100}%`;
  }
}
