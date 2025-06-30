import ChatWindowHeader from './Header';
import ChatContainer from './ChatContainer';
import Sponsor from '../Sponsor';
import ResetChat from '../ResetChat';
import { useChatContext } from '@/context/ChatContext';

export default function ChatWindow({ closeChat, settings, sessionId }) {
  const { supportAgent, setSupportAgent, isChangingAgent, saveSupportAgent } =
    useChatContext();

  // const { chatHistory, setChatHistory, loading } = useChatHistory(
  //   settings,
  //   sessionId
  // );

  // if (loading) {
  //   return (
  //     <div className='allm-flex allm-flex-col allm-h-full'>
  //       <ChatWindowHeader
  //         sessionId={sessionId}
  //         settings={settings}
  //         iconUrl={settings.brandImageUrl}
  //         closeChat={closeChat}
  //         setChatHistory={setChatHistory}
  //       />
  //       <ChatHistoryLoading />
  //       <div className='allm-pt-4 allm-pb-2 allm-h-fit allm-gap-y-1'>
  //         <SessionId />
  //         <Sponsor settings={settings} />
  //       </div>
  //     </div>
  //   );
  // }

  const handleToggleSupportAgent = () => {
    setSupportAgent((agent) => {
      const newAgentType = agent === 'bot' ? 'human' : 'bot';
      saveSupportAgent(newAgentType);
      return newAgentType;
    });
  };

  setEventDelegatorForCodeSnippets();

  return (
    <div className='allm-flex allm-flex-col allm-h-full'>
      {!settings.noHeader && (
        <ChatWindowHeader
          sessionId={sessionId}
          settings={settings}
          iconUrl={settings.brandImageUrl}
          closeChat={closeChat}
          setChatHistory={() => {}}
        />
      )}
      <div className='allm-flex-grow allm-overflow-y-auto'>
        <ChatContainer
          sessionId={sessionId}
          settings={settings}
          knownHistory={[]}
        />
      </div>
      <div className='allm-mt-4 allm-pb-4 allm-h-fit allm-gap-y-2 allm-z-10'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <button
            className='allm-h-fit allm-px-0 allm-border-none allm-cursor-pointer allm-text-sm allm-bg-transparent hover:allm-opacity-80 hover:allm-underline'
            style={{ color: '#7A7D7E' }}
            disabled={isChangingAgent}
            onClick={handleToggleSupportAgent}
          >
            {isChangingAgent
              ? 'Changing agent.Please wait...'
              : `Switch to ${supportAgent === 'bot' ? 'human agent' : 'bot'}`}
          </button>
          <ResetChat settings={settings} />
          <Sponsor settings={settings} />
        </div>
      </div>
    </div>
  );
}

// Enables us to safely markdown and sanitize all responses without risk of injection
// but still be able to attach a handler to copy code snippets on all elements
// that are code snippets.
function copyCodeSnippet(uuid) {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;

  const markdown =
    target.parentElement?.parentElement?.querySelector(
      'pre:first-of-type'
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);

  target.classList.add('allm-text-green-500');
  const originalText = target.innerHTML;
  target.innerText = 'Copied!';
  target.setAttribute('disabled', true);

  setTimeout(() => {
    target.classList.remove('allm-text-green-500');
    target.innerHTML = originalText;
    target.removeAttribute('disabled');
  }, 2500);
}

// Listens and hunts for all data-code-snippet clicks.
function setEventDelegatorForCodeSnippets() {
  document?.addEventListener('click', function (e) {
    const target = e.target.closest('[data-code-snippet]');
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return false;
    copyCodeSnippet(uuidCode);
  });
}
