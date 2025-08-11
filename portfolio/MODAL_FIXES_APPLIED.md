# モーダル問題の修正内容

## 修正された問題

### 問題1: 初期スライド位置の修正
**解決策**: Glide.jsの初期化方法を変更
- `startAt`オプションを常に0に設定
- マウント後に`go()`メソッドで正しい位置に移動
- 50msの遅延で確実な初期化を保証

```javascript
// 修正後のコード
glide.mount();
if (startIndex > 0) {
  setTimeout(() => {
    glide.go(`=${startIndex}`);
    setCurrentIndex(startIndex);
  }, 50);
}
```

### 問題2: ナビゲーションボタンクリックによるモーダル閉じる問題
**解決策**: ポータルレンダリングを削除し、DialogContent内に配置
- ReactDOM.createPortalを削除
- ナビゲーションコントロールをDialogContent内に移動
- `absolute`ポジショニングで同じ視覚的配置を維持
- z-indexを50に調整してDialogContent内で適切に表示

## テスト手順

1. http://localhost:4323/ にアクセス
2. 異なるプロジェクトカードをクリックして、正しい位置でモーダルが開くことを確認
3. 矢印ボタンをクリックしてナビゲーションが動作することを確認
4. ドットインジケーターをクリックして特定のプロジェクトに移動できることを確認
5. モーダルが意図せず閉じないことを確認

## 技術的な詳細

### Glide.js初期化の問題
- Glide.jsの`startAt`オプションはDOM構造によっては機能しない場合がある
- 初期化後に明示的に`go()`メソッドを呼び出すことで確実に動作

### Radix UI Dialogの仕様
- Dialogコンポーネントは`onPointerDownOutside`イベントでDialog外のクリックを検出
- ポータルでレンダリングされた要素は「外部」として扱われる
- DialogContent内に配置することで、この問題を回避

## 変更されたファイル
- `/src/components/ProjectModal.tsx`
  - useEffectでのGlide初期化ロジック改善
  - ナビゲーションコントロールの配置変更
  - 不要なReactDOMインポートの削除