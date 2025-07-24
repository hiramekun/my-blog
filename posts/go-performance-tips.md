---
title: "Go言語パフォーマンス最適化のコツ"
date: "2025-01-25"
excerpt: "Go言語でのパフォーマンス最適化について、実際のプロジェクトで使えるテクニックを紹介します。"
tags: ["Go", "パフォーマンス", "最適化"]
---

# Go言語パフォーマンス最適化のコツ

Go言語でのパフォーマンス最適化について、実際のプロジェクトで効果があったテクニックをまとめます。

## 1. メモリアロケーションの最適化

### スライスの事前確保

```go
// Bad: 容量不足で何度もリアロケーションが発生
var items []string
for i := 0; i < 1000; i++ {
    items = append(items, fmt.Sprintf("item-%d", i))
}

// Good: 事前に容量を確保
items := make([]string, 0, 1000)
for i := 0; i < 1000; i++ {
    items = append(items, fmt.Sprintf("item-%d", i))
}
```

### sync.Poolを使ったオブジェクト再利用

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 0, 1024)
    },
}

func processData(data []byte) []byte {
    buf := bufferPool.Get().([]byte)
    defer bufferPool.Put(buf[:0]) // 長さを0にリセット
    
    // bufferを使った処理
    return append(buf, data...)
}
```

## 2. 文字列操作の最適化

### strings.Builderの活用

```go
// Bad: 文字列の連結でメモリコピーが多発
func buildString(items []string) string {
    result := ""
    for _, item := range items {
        result += item + ","
    }
    return result
}

// Good: strings.Builderを使用
func buildString(items []string) string {
    var builder strings.Builder
    builder.Grow(len(items) * 10) // 概算サイズで事前確保
    
    for _, item := range items {
        builder.WriteString(item)
        builder.WriteString(",")
    }
    return builder.String()
}
```

## 3. 並行処理の最適化

### Worker Poolパターン

```go
func processItems(items []Item) {
    const numWorkers = 4
    jobs := make(chan Item, len(items))
    results := make(chan Result, len(items))
    
    // Worker起動
    for w := 0; w < numWorkers; w++ {
        go worker(jobs, results)
    }
    
    // ジョブを送信
    for _, item := range items {
        jobs <- item
    }
    close(jobs)
    
    // 結果を収集
    for i := 0; i < len(items); i++ {
        <-results
    }
}

func worker(jobs <-chan Item, results chan<- Result) {
    for job := range jobs {
        result := processItem(job)
        results <- result
    }
}
```

## まとめ

- メモリアロケーションを意識する
- 文字列操作には`strings.Builder`を使う
- 適切な並行処理パターンを選択する
- プロファイリングツールで計測する

次回はJavaのJVMチューニングについて書く予定です。