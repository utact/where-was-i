const DEFAULT_DECAY_RATE = 0.05;

export async function calculateRetention(
  lastAccessed: number
): Promise<number> {
  const now = Date.now();
  const diffHours = (now - lastAccessed) / (1000 * 60 * 60);

  // 사용자 설정 감쇠율 불러오기, 없으면 기본값 사용
  const { userOptions = {} } = await chrome.storage.sync.get("userOptions");
  const decayRate =
    typeof userOptions.decayRate === "number"
      ? userOptions.decayRate
      : DEFAULT_DECAY_RATE;

  return Math.exp(-decayRate * diffHours);
}

export function getTextColor(retentionRate: number): string {
  const rate = Math.max(0, Math.min(retentionRate / 100, 1));

  const red = Math.floor(255 * (1 - rate));
  const green = 0;
  const blue = Math.floor(255 * rate);

  return `rgb(${red}, ${green}, ${blue})`;
}
