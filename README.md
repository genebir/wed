# 쩜오의 결혼이야기 💍

예비부부 둘이 함께 보는 결혼 준비 웹서비스. 2027-03-20 본식까지의 일정·체크리스트·셀프 스냅 계획·예산을 한곳에서 관리한다.

- **스택**: Vite + React 18 + TypeScript + Tailwind CSS
- **배포**: GitHub Pages (`main` push → GitHub Actions → `gh-pages` 브랜치)
- **콘텐츠**: `src/data/*.json` 파일로 관리 (별도 백엔드 없음)
- **체크 상태**: 브라우저 `localStorage`에 저장

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입체크 + 프로덕션 빌드
```

## 배포 설정

1. GitHub에 리포지토리 생성 (이름이 `wed`가 아니면 `vite.config.ts`의 `base`를 `/<repo-name>/`으로 수정)
2. `main` 브랜치 push → Actions가 자동으로 `gh-pages` 브랜치에 배포
3. 리포 Settings → Pages → Source를 `gh-pages` 브랜치로 설정 (최초 1회)

## 콘텐츠 수정

| 파일 | 내용 |
|---|---|
| `src/data/wedding.json` | 본식 날짜, 총 예산 |
| `src/data/timeline.json` | 준비 일정 (월별) |
| `src/data/checklist.json` | 월별 체크리스트 항목 |
| `src/data/gallery.json` | 셀프 스냅 레퍼런스 |
| `src/data/budget.json` | 카테고리별 예산 |
| `src/data/vendors.json` | 업체/예약 현황 |
| `src/data/snapPlan.json` | 촬영 장소·장비·샷 리스트 |

### 스냅 레퍼런스 추가 방법

1. 마음에 드는 이미지를 `refs-inbox/` 폴더에 저장 (jpg/png/webp — 폴더가 없으면 `npm run refs`가 만들어줌)
2. `npm run refs` 실행 → 1200px webp 변환 + `public/gallery/` 저장 + `gallery.json` 항목 추가까지 자동
3. `src/data/gallery.json`에서 방금 추가된 항목의 `moods`/`locations`/`sourceUrl`/`memo` 채우기
4. `content:` 프리픽스로 커밋 후 push

`refs-inbox/`는 gitignore라 원본은 커밋되지 않고, 변환된 webp만 올라간다.
공개 리포이므로 저작권 있는 타인의 사진(인스타/핀터레스트 저장본 등)은 넣지 말 것.

⚠️ 개인정보(실명, 연락처, 계좌, 상세 계약금액)는 커밋하지 않는다.
