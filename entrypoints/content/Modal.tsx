import { useState } from "react";
import sendIcon from "../../assets/send.png";
import regenerateIcon from "../../assets/regenrate.png";
import insertIcon from "../../assets/insert.png";

type Message = {
  text: string;
  type: "user" | "bot";
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (messages: Message[]) => void;
}
export default function Modal({ isOpen, onClose, onInsert }: ModalProps) {
  const [prompt, setPrompt] = useState<string>(""); // typed as string
  const [messages, setMessages] = useState<Message[]>([]); // typed as array of Message objects

  // Generate message logic
  const handleGenerate = () => {
    if (!prompt) {
      return alert("Please write something");
    }
    const userMessage = prompt;
    const generatedMessage =
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, type: "user" },
      { text: generatedMessage, type: "bot" },
    ]);
    setPrompt("");
  };

  const resetModal = () => {
    setPrompt("");
    setMessages([]);
  };

  const handleModalClose = () => {
    resetModal();
    onClose();
  };

  const handleInsert = () => {
    resetModal();
    onInsert(messages);
  };

  return (
    isOpen && (
      <div
        className="fixed left-0 top-0 w-screen h-screen flex items-center justify-center z-50 bg-[#0000003e]"
        onClick={handleModalClose}
      >
        <div
          className="bg-[#F9FAFB] max-w-[500px] w-full p-5 rounded-xl shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col p-2 gap-2 mb-2">
            {messages.map((message, index) => (
              <p
                key={index}
                className={` rounded-md p-2 text-gray-500 max-w-[80%] ${
                  message.type == "user"
                    ? "ml-auto bg-gray-200 "
                    : "mr-auto bg-[#DBEAFE]"
                } `}
              >
                {message.text}
              </p>
            ))}
          </div>
          <input
            type="text"
            className="bg-white w-full p-1 px-2 rounded-md !outline-none !border !border-black  focus:!outline-none focus:!border-none"
            placeholder="Your Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-end pt-4 gap-3 ">
            {!messages.length ? (
              <div
                className=" flex items-center gap-1 px-3 py-1 cursor-pointer  bg-[#3B82F6] text-white rounded-md"
                onClick={handleGenerate}
              >
                <img src={sendIcon} alt="" className="h-[14px] w-auto" />
                Generate
              </div>
            ) : (
              <>
                <div
                  className="flex items-center gap-1 px-3 py-1 cursor-pointer !border !border-gray-500 rounded-md p-7 custom_btn"
                  onClick={handleInsert}
                >
                  <img src={insertIcon} alt="" className="h-[14px] w-auto" />
                  Insert
                </div>
                <div className=" flex items-center gap-1 px-3 py-1 cursor-pointer  bg-[#3B82F6] text-white rounded-md">
                  <img
                    src={regenerateIcon}
                    alt=""
                    className="h-[14px] w-auto"
                  />
                  Regenerate
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
