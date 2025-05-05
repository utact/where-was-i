export function calculateRetention(lastAccessed: number): number {
  const now = Date.now();
  const diffHours = (now - lastAccessed) / (1000 * 60 * 60);
  const decayRate = 0.05;
  return Math.exp(-decayRate * diffHours);
}

export function getTextColor(retentionRate: number): string {
  const rate = Math.max(0, Math.min(retentionRate / 100, 1));

  const red = Math.floor(255 * (1 - rate));
  const green = 0;
  const blue = Math.floor(255 * rate);

  return `rgb(${red}, ${green}, ${blue})`;
}
