const DEFAULT_RETENTION_PERIOD_DAYS = 14;

export async function calculateRetention(
  lastAccessed: number
): Promise<number> {
  const now = Date.now();
  const diffHours = (now - lastAccessed) / (1000 * 60 * 60);

  // 사용자 설정 주기(일) 불러오기, 없으면 기본값 사용
  const { userOptions = {} } = await chrome.storage.sync.get("userOptions");
  const retentionPeriodInDays =
    typeof userOptions.retentionPeriodInDays === "number"
      ? userOptions.retentionPeriodInDays
      : DEFAULT_RETENTION_PERIOD_DAYS;

  // 주기가 0 이하일 경우 오류 방지
  if (retentionPeriodInDays <= 0) return 0;

  // 주기에 따라 감쇠율 계산. 주기가 길수록 감쇠율은 낮아짐.
  // 1 / (주기 * 24시간) -> 이 주기가 지나면 잔존율이 1/e (~37%)가 됨.
  const decayRate = 1 / (retentionPeriodInDays * 24);

  return Math.exp(-decayRate * diffHours);
}

export function getTextColor(retentionRate: number): string {
  const rate = Math.max(0, Math.min(retentionRate / 100, 1));

  const red = Math.floor(255 * (1 - rate));
  const green = 0;
  const blue = Math.floor(255 * rate);

  return `rgb(${red}, ${green}, ${blue})`;
}
