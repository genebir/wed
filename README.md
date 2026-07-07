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

1. 이미지를 1200px 이하 webp로 변환해 `public/gallery/`에 저장
2. `src/data/gallery.json`에 항목 한 줄 추가 (`image`, `moods`, `locations`, `sourceUrl`, `memo`)
3. 커밋 메시지는 `content:` 프리픽스 사용

⚠️ 개인정보(실명, 연락처, 계좌, 상세 계약금액)는 커밋하지 않는다.
