import { ChatContainer } from '@/components/chat/ChatContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat — Zeraora AI',
};

export default function ChatPage() {
  return (
    <div className="h-full w-full">
      <ChatContainer />
    </div>
  );
}
