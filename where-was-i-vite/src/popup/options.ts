const DEFAULT_RETENTION_PERIOD_DAYS = 14;

type UserOptions = {
  decayRate?: number;
  retentionPeriodInDays?: number;
};

document.addEventListener("DOMContentLoaded", async () => {
  const retentionPeriodInput = document.getElementById(
    "retentionPeriod"
  ) as HTMLInputElement;
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  if (!retentionPeriodInput || !saveButton || !statusMessage) {
    console.error("Options page UI elements not found.");
    return;
  }

  // 1. 저장된 설정 불러오기
  const { userOptions = {} }: { userOptions?: UserOptions } =
    await chrome.storage.sync.get("userOptions");
  const currentPeriod =
    userOptions.retentionPeriodInDays || DEFAULT_RETENTION_PERIOD_DAYS;

  retentionPeriodInput.value = currentPeriod.toString();

  // 3. 저장 버튼 클릭 시 설정 저장
  saveButton.addEventListener("click", async () => {
    const newPeriod = parseInt(retentionPeriodInput.value, 10);

    if (isNaN(newPeriod) || newPeriod <= 0) {
      statusMessage.textContent = "유효한 숫자를 입력해주세요.";
      statusMessage.style.color = "#e63946";
      return;
    }

    const { userOptions = {} }: { userOptions?: UserOptions } =
      await chrome.storage.sync.get("userOptions");
    userOptions.retentionPeriodInDays = newPeriod;

    await chrome.storage.sync.set({ userOptions });

    statusMessage.textContent = "설정이 저장되었습니다!";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 2500);
  });
});
