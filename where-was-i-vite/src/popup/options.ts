// 기본 감쇠율. retention.ts에 있는 값과 일치해야 합니다.
const DEFAULT_DECAY_RATE = 0.05;

type UserOptions = {
  decayRate?: number;
};

document.addEventListener("DOMContentLoaded", async () => {
  const decayRateInput = document.getElementById(
    "decayRate"
  ) as HTMLInputElement;
  const decayRateValueSpan = document.getElementById("decayRateValue");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  if (!decayRateInput || !decayRateValueSpan || !saveButton || !statusMessage) {
    console.error("Options page UI elements not found.");
    return;
  }

  // 1. 저장된 설정 불러오기
  const { userOptions = {} }: { userOptions?: UserOptions } =
    await chrome.storage.sync.get("userOptions");
  const currentRate = (userOptions.decayRate || DEFAULT_DECAY_RATE).toFixed(2);

  decayRateInput.value = currentRate;
  decayRateValueSpan.textContent = currentRate;

  // 2. 슬라이더 값 변경 시 텍스트 실시간 업데이트
  decayRateInput.addEventListener("input", () => {
    decayRateValueSpan.textContent = parseFloat(decayRateInput.value).toFixed(
      2
    );
  });

  // 3. 저장 버튼 클릭 시 설정 저장
  saveButton.addEventListener("click", async () => {
    const newDecayRate = parseFloat(decayRateInput.value);

    const { userOptions = {} }: { userOptions?: UserOptions } =
      await chrome.storage.sync.get("userOptions");
    userOptions.decayRate = newDecayRate;

    await chrome.storage.sync.set({ userOptions });

    statusMessage.textContent = "설정이 저장되었습니다!";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 2500);
  });
});
