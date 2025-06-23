import {
  Plus,
  ChatCircleDots,
  Headset,
  Binoculars,
  MagnifyingGlass,
  MagicWand,
} from '@phosphor-icons/react';

// const CHAT_ICONS = {
//   plus: Plus,
//   chatBubble: ChatCircleDots,
//   support: Headset,
//   search2: Binoculars,
//   search: MagnifyingGlass,
//   magic: MagicWand,
// };

export default function OpenButton({ settings, isOpen, toggleOpen }) {
  if (isOpen) return null;
  return (
    <button
      style={{ backgroundColor: settings.buttonColor }}
      id='anything-llm-embed-chat-button'
      onClick={toggleOpen}
      className={`hover:allm-cursor-pointer allm-flex allm-items-center allm-justify-center allm-p-4 allm-rounded-full allm-text-white allm-text-2xl hover:allm-opacity-95 allm-border-1 allm-border-[#00ffc3]`}
      aria-label='Toggle Menu'
    >
      <ChatCircleDots color='#00ffc3' />
    </button>
  );
}
