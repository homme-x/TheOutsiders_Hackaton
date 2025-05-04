'use client';

import dynamic from "next/dynamic";

// Importer le chatbot de manière dynamique pour éviter les erreurs de rendu côté serveur
const Chatbot = dynamic(() => import("@/components/Chatbot/Chatbot"), {
  ssr: false,
  loading: () => null,
});

export default function ChatbotWrapper() {
  return <Chatbot />;
}
