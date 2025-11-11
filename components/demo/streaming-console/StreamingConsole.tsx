/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef } from 'react';
import WelcomeScreen from '../welcome-screen/WelcomeScreen';

import { useLogStore } from '@/lib/state';

const formatTimestamp = (date: Date) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const renderContent = (text: string) => {
  // Split by ```json...``` code blocks
  const parts = text.split(/(`{3}json\n[\s\S]*?\n`{3})/g);

  return parts.map((part, index) => {
    if (part.startsWith('```json')) {
      const jsonContent = part.replace(/^`{3}json\n|`{3}$/g, '');
      return (
        <pre key={index}>
          <code>{jsonContent}</code>
        </pre>
      );
    }

    // Split by **bold** text
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        return <strong key={boldIndex}>{boldPart.slice(2, -2)}</strong>;
      }
      return boldPart;
    });
  });
};


export default function StreamingConsole() {
  const turns = useLogStore(state => state.turns);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  return (
    <div className="transcription-container">
      {turns.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="transcription-view" ref={scrollRef}>
          {turns.map((t, i) => (
            <div
              key={i}
              className={`transcription-entry ${t.role} ${
                !t.isFinal ? 'interim' : ''
              }`}
            >
              {t.role === 'user' || t.role === 'agent' ? (
                <>
                  <div className="transcription-header">
                    <div className="transcription-source">
                      {t.role === 'user' ? 'You' : 'Agent'}
                    </div>
                  </div>
                  <div className="chat-bubble">
                    <div className="transcription-text-content">
                      {renderContent(t.text)}
                    </div>
                    {t.groundingChunks && t.groundingChunks.length > 0 && (
                      <div className="grounding-chunks">
                        <strong>Sources:</strong>
                        <ul>
                          {t.groundingChunks
                            // FIX: Add a check for chunk.web.uri to ensure links are valid.
                            .filter(chunk => chunk.web && chunk.web.uri)
                            .map((chunk, index) => (
                              <li key={index}>
                                <a
                                  href={chunk.web!.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {chunk.web!.title || chunk.web!.uri}
                                </a>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="system-message">
                  <div className="transcription-text-content">
                    {renderContent(t.text)}
                  </div>
                  <div className="transcription-timestamp">
                    {formatTimestamp(t.timestamp)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}