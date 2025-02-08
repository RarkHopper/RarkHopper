import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { hc } from 'hono/client'
import type { AppType } from '@server/index';

// APIサーバーのURLを指定（例: http://localhost:3000/）
const client = hc<AppType>('/api/');

// GET /message エンドポイントを呼び出す関数
const fetchMessage = async () => {
  // Hono公式クライアントの書き方は、スキーマ定義がある場合は型情報を渡すことで型安全に利用可能です
  // ここではシンプルに '/message' エンドポイントを呼び出しています
  const response = await client.message.$get();
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Message: React.FC = () => {
  const { data, error, isLoading } = useQuery(['message'], fetchMessage);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <p className="text-lg">Message: {data.message}</p>
    </div>
  );
};

export default Message;
