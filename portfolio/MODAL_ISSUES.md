# プロジェクトモーダルの問題調査ドキュメント

## 現在解決できていない問題

### 問題1: 初期スライド位置が常に最初になる
**症状**: 
- どのプロジェクトカードをクリックしても、モーダルは常に最初のプロジェクト（未踏）から表示される
- コンソールログでは正しいインデックスが計算されているが、実際の表示に反映されない

**現在の実装**:
```tsx
// ProjectModal.tsx (lines 48-99)
useEffect(() => {
  if (!glideRef.current || !open || !project) return;

  const timer = setTimeout(() => {
    const startIndex = sortedProjects.findIndex(p => p.id === project.id);
    console.log('Initializing Glide for project:', project.id, 'at index:', startIndex);
    
    const glide = new Glide(glideRef.current!, {
      type: 'slider',
      startAt: startIndex >= 0 ? startIndex : 0,  // ← 設定しているが効いていない
      // ...
    });

    glide.mount();
    glideInstance.current = glide;
    setCurrentIndex(startIndex >= 0 ? startIndex : 0);
    console.log('Glide mounted, current index:', glide.index);
  }, 100);
}, [open, project, sortedProjects]);
```

**確認された事実**:
- `startIndex`の計算は正しい（コンソールログで確認済み）
- Glideのオプションで`startAt`を設定しているが、実際には反映されない
- `glide.index`は初期化後も0を返している

### 問題2: 矢印ボタンクリックでモーダルが閉じる
**症状**:
- ナビゲーション矢印をクリックするとモーダル全体が閉じてしまう
- ドットインジケーターをクリックしても同様にモーダルが閉じる

**現在の実装構造**:
```tsx
// ProjectModal.tsx (lines 130-166)
// ReactDOM.createPortalを使用してdocument.bodyに直接レンダリング
{open && ReactDOM.createPortal(
  <>
    <button 
      className="fixed ... z-[100]"
      onClick={handlePrev}
    >
      <ChevronLeft />
    </button>
    // ...
  </>,
  document.body
)}

// 別の場所にDialogコンポーネント
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    // モーダルコンテンツ
  </DialogContent>
</Dialog>
```

**DOM構造**:
```
document.body
├── ポータルでレンダリングされた矢印ボタン (z-index: 100)
└── DialogPortal
    ├── DialogOverlay (z-index: 50)
    └── DialogContent (z-index: 50)
```

**確認された事実**:
- Radix UIのDialogは、Dialog外のクリックを`onPointerDownOutside`イベントで検知する
- ポータルでレンダリングされた要素は「Dialog外」として扱われる
- `e.stopPropagation()`は異なるDOMツリー間では効果がない

## デバッグ用情報

### コンソールログ出力箇所
1. `Projects.tsx:35` - カードクリック時のプロジェクト情報
2. `ProjectModal.tsx:67` - Glide初期化時のプロジェクトIDとインデックス
3. `ProjectModal.tsx:89` - Glideマウント後の現在インデックス
4. `ProjectModal.tsx:107,115,123` - 各ボタンクリック時の状態

### プロジェクトの並び順
両ファイルで同じソート処理を使用:
```tsx
// 1. isOngoing (進行中が先)
// 2. year (新しい順)
sortedProjects.sort((a, b) => {
  if (a.isOngoing !== b.isOngoing) {
    return a.isOngoing ? -1 : 1;
  }
  const yearA = parseInt(a.year.split('-')[0]);
  const yearB = parseInt(b.year.split('-')[0]);
  return yearB - yearA;
});
```

## 私が試みた実装と失敗した理由

### 試み1: `initialIndex`をuseMemoで計算
- 結果: 効果なし
- 理由: 計算自体は正しかったが、Glideの初期化タイミングの問題は解決しなかった

### 試み2: useEffectの依存配列を変更
- `[open]`のみ → `[open, project, sortedProjects]`に変更
- 結果: 効果なし
- 理由: 再初期化はトリガーされるが、`startAt`が効かない根本原因は不明

### 試み3: ポータルを使用して矢印をDialog外に配置
- 結果: 矢印クリックでモーダルが閉じる問題が発生
- 理由: Radix UIのDialog実装の仕様を正しく理解していなかった

## 未解決の疑問点

1. **Glide.jsの`startAt`オプションが効かない理由**
   - DOMの準備ができていない？
   - Glideの内部的なバグ？
   - 初期化のタイミングが不適切？

2. **Radix UI Dialogとポータルの相互作用**
   - `onPointerDownOutside`を適切に制御する方法は？
   - ポータル要素をDialog内として認識させる方法は？

3. **代替アプローチの可能性**
   - Glide.js以外のカルーセルライブラリ？
   - Dialog以外のモーダル実装？
   - ナビゲーションボタンの配置方法？