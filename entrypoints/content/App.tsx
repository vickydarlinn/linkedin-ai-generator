import { useEffect, useState } from "react";
import generatorIcon from "../../assets/generator.png";
import "./style.css";

import Modal from "./Modal";

type Message = {
  text: string;
  type: "user" | "bot";
};

// Main App Component in TypeScript
export default function App() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const button = document.createElement("img");
  button.src = generatorIcon;
  button.className = "custom-send-button";

  button.style.display = "none"; // Initially hidden

  // Using mousedown event instead of click to prevent textInput from losing focus
  button.addEventListener("mousedown", (e) => {
    console.log("clicked");
    e.stopPropagation(); // Prevent click event from bubbling and triggering other actions
    setModalOpen(true);
  });

  // MutationObserver setup inside useEffect
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      const messageInput = document.querySelector<HTMLDivElement>(
        "div.msg-form__contenteditable"
      );

      if (messageInput) {
        // Check for 'data-artdeco-is-focused' attribute in messageInput
        const isFocused = messageInput.getAttribute("data-artdeco-is-focused");

        // Toggle button display based on whether the input is focused
        if (isFocused) {
          button.style.display = "block"; // Show button
        } else {
          button.style.display = "none"; // Hide button
        }

        // Insert the button after the message input if not already inserted
        if (!messageInput.contains(button)) {
          messageInput.appendChild(button);
        }
      }
    });

    // Start observing changes to the body (to detect changes in the input)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true, // Needed to detect changes in the attributes of the message input
      attributeFilter: ["data-artdeco-is-focused"], // Only observe changes to this attribute
    });

    return () => observer.disconnect();
  }, []);

  // Handle inserting generated text into LinkedIn input
  const handleInsert = (messages: Message[]) => {
    const lastGeneratedMessage = messages[messages.length - 1].text;
    const placeHolderMessage = document.querySelector<HTMLDivElement>(
      "div.msg-form__placeholder"
    );

    const messageInput = document.querySelector<HTMLDivElement>(
      "div.msg-form__contenteditable"
    );
    if (placeHolderMessage) {
      placeHolderMessage.style.display = "none";
    }
    if (messageInput) {
      messageInput.innerHTML = `<p>${lastGeneratedMessage}</p>`;
    }

    setModalOpen(false); // Close the modal
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onInsert={handleInsert}
      />
    </>
  );
}
