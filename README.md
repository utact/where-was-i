# Where Was I?

**"당신의 맥락을 저장합니다."**
> Where Was I?는 사용자의 재방문 경험을 향상시키는 크롬 익스텐션입니다.  
> 본 익스텐션은 사용자가 **어떤 글을, 어디까지 읽었고, 얼마나 기억하고 있는지**와 같은 '맥락'을 지원합니다.

##

👉 Where Was I?는 **사용자가 원하지 않는 정보**는 수집하지 않습니다.  
👉 본 익스텐션에서는 **두 가지 방식**을 제안하며, 사용자는 기호에 따라 선택하여 이용합니다.
1. **WWI Fixer** (기본형/비동기화)
2. **WWI Tracker** (팝업형/동기화)

---

## WWI Fixer

> WWI Fixer는 **단축키를 통해 현재 위치를 저장하고 재방문 시 자동 복원**해 줍니다.  
> **local storage**를 사용하여 **정말 많은 웹 페이지**를 저장할 수 있습니다.  
> 동기화되지 않는다는 단점이 있으며, **복원 외 추가적인 기능**은 없습니다.

### ⌨️ 키보드 단축키 기반 로컬 저장
- `Alt + S`: 현재 페이지의 스크롤 위치를 로컬에 저장
- `Alt + D`: 해당 저장 정보를 로컬에서 삭제


https://github.com/user-attachments/assets/1069f779-b33b-48df-bb96-d2415c711ef4


---

## WWI Tracker

> WWI Tracker는 **팝업을 열고 '현재 웹 페이지 저장' 버튼을 눌러 최초 등록**합니다.  
> **sync storage**를 사용하여 **약 400개의 웹 페이지**를 저장할 수 있습니다.  
> **모든 기기 간 동기화**되며, 조금 더 **특별한 기능**을 제공합니다.

### 🧩 팝업 UI
- 사용자가 직접 등록한 **웹 페이지 목록**과 **남은 저장소 용량**을 표시합니다.  

### 📈 진행률 시각화
- 각 웹 페이지의 시각화된 진행률을 통해 **진행 상황**을 한눈에 알아볼 수 있습니다.  
- 모두 읽었다고 판단될 경우, 해당 웹 페이지를 `pendingDelete` **상태로 전환**합니다.  
- 전환된 웹 페이지들은 **1일간 보관 후 자동으로 삭제**됩니다.

### 🧠 기억 잔존율 시각화
- 각 웹 페이지의 타이틀은 **마지막 액세스를 기점으로 점차 붉은 색상**에 가까워집니다.  

### 🔖 스크롤 위치 자동 저장
- **단축키를 누를 필요 없이** 웹 페이지를 닫아버리면, **자동으로 마지막 위치를 저장**합니다.
- 해당 웹 페이지 재방문 시 **마지막 위치로 자동 복원**합니다.


https://github.com/user-attachments/assets/33c28227-ab8b-4233-9658-4d3249d106c4


---

## 📦 기술 스택
- Chrome Extension Manifest V3
- Storage API (`sync`, `local`)
- TypeScript + Vite
- Content Script & Background Worker

## 🛠 개발 중인 기능들
- 다 읽은 페이지 자동 삭제
- 방치된 페이지 리마인더 알림
- 망각률 높은 페이지 진행 내용 요약 (AI 활용)

## 📂 설치 방법

```bash
git clone https://github.com/utact/where-was-i.git
cd where-was-i-vite
npm install
npm run build
```
생성된 dist/ 폴더를 크롬 확장 프로그램으로 로드합니다.

## 🐛 개발 일지 & 이슈 제보

- [불편함이 개발로 이끌었다](https://funczun.tistory.com/97)
- [개인 프로젝트지만 협업처럼 행동하자](https://funczun.tistory.com/98)
- [Vite 기반 번들링 환경 구축과 타입 안정성을 위한 TS 마이그레이션](https://funczun.tistory.com/99)
- [실수를 통해 성장하는 개발자가 되자](https://funczun.tistory.com/100)
- [깃 히스토리는 중요할까? 중요하다면 왜 중요한 걸까?](https://funczun.tistory.com/101)
- [크롬 확장 프로그램을 개발하자](https://funczun.tistory.com/102)
- [배열 순회 문제와 팝업 진행률 이슈](https://funczun.tistory.com/103)
- [세이브 취소/타이틀 축약/잔여 용량 체크/기억 잔존율 시각화](https://funczun.tistory.com/104)
- [유휴 상태 콜백 메서드와 병렬 처리로 최적화 할 수 있을까?](https://funczun.tistory.com/105)

사용 중 문제가 발생했거나 기능 제안을 하고 싶다면 [ISSUES](https://github.com/utact/where-was-i/issues)를 방문해 주세요!

---

## ⚖️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
