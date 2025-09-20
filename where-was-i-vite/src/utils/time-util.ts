/**
 * 평균적인 분당 단어 읽기 속도(WPM).
 * 일반적인 성인은 분당 약 200-250개의 단어를 읽습니다.
 */
const WORDS_PER_MINUTE = 230;

/**
 * 페이지의 픽셀 당 평균 단어 수에 대한 추정치.
 * 이 값은 경험적인 수치(heuristic)이며, 웹 페이지의 텍스트 밀도에 따라 결과가 달라질 수 있습니다.
 * 예를 들어, 1000px 높이의 콘텐츠에 약 200개의 단어가 있다고 가정 (200/1000 = 0.2).
 * 이 값을 조정하여 예상 시간의 정확도를 조절할 수 있습니다.
 */
const WORDS_PER_PIXEL = 0.2;

/**
 * 페이지의 남은 스크롤을 기반으로 예상 읽기 시간을 계산합니다.
 *
 * @param totalHeight 문서의 전체 높이 (e.g., document.documentElement.scrollHeight)
 * @param currentScroll 현재 스크롤 위치 (e.g., window.scrollY)
 * @param viewportHeight 뷰포트의 높이 (e.g., window.innerHeight)
 * @returns '약 5분' 또는 '약 1분 미만'과 같은 형식의 문자열
 */
export function calculateRemainingTime(
  totalHeight: number,
  currentScroll: number,
  viewportHeight: number
): string {
  // 스크롤이 없는 페이지는 즉시 완료로 간주합니다.
  if (totalHeight <= viewportHeight) {
    return "약 1분 미만";
  }

  // 아직 읽지 않은, 스크롤 해야 할 남은 픽셀을 계산합니다.
  const remainingPixels = Math.max(
    0,
    totalHeight - (currentScroll + viewportHeight)
  );

  // 남은 단어 수를 추정합니다.
  const estimatedRemainingWords = remainingPixels * WORDS_PER_PIXEL;

  // 남은 시간(분)을 계산합니다.
  const estimatedMinutes = estimatedRemainingWords / WORDS_PER_MINUTE;

  const roundedMinutes = Math.round(estimatedMinutes);

  // 1분 미만이거나, 반올림 결과 0분이 될 경우 '1분 미만'으로 표시합니다.
  if (roundedMinutes < 1) {
    return "약 1분 미만";
  }

  return `약 ${roundedMinutes}분`;
}
