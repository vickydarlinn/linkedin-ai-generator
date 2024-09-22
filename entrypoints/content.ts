import "./style.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/messaging/*", "*://*.google.com/*"],

  main(ctx) {
    console.log("This is LinkedIn message URL");

    const observer = new MutationObserver((mutations) => {
      const messageInputSelector = "div.msg-form__contenteditable"; // Selector for LinkedIn message input
      const messageInput = document.querySelector(messageInputSelector);
      const emptyParagraph = document.querySelector(
        "div.msg-form__placeholder"
      );

      if (messageInput) {
        console.log("Message input found!");
        observer.disconnect(); // Stop observing once the input is found

        // Create the button element
        const button = document.createElement("button");
        button.textContent = "Send";
        button.className = "custom-send-button"; // Add a class for styling if needed

        // Add click event to the button
        button.addEventListener("click", handleClick);

        // Insert the button after the input element
        messageInput.parentNode?.insertBefore(button, messageInput.nextSibling);

        function handleClick() {
          console.log("Button clicked");

          // Create modal structure
          const modal = document.createElement("div");
          modal.className = "custom-modal";
          modal.innerHTML = `
            <div class="modal-overlay">
              <div class="custom-modal-content">
                <div class="messages">
                  <!-- Messages will be added here -->
                </div>
                <input type="text" class="prompt-input" placeholder="Your Prompt">
                <button class="close-modal btn">Close Modal</button>
                <button class="btn generate">Generate</button>
                <button class="btn regenerate" style="display: none;">Regenerate</button>
                <button class="btn insert" style="display: none;">Insert</button>
              </div>
            </div>
          `;
          document.body.appendChild(modal);

          const promptInput = modal.querySelector(
            ".prompt-input"
          ) as HTMLInputElement | null;
          const generateBtn = modal.querySelector(
            ".generate"
          ) as HTMLButtonElement | null;
          const regenerateBtn = modal.querySelector(
            ".regenerate"
          ) as HTMLButtonElement | null;
          const insertBtn = modal.querySelector(
            ".insert"
          ) as HTMLButtonElement | null;
          const messageContainer = modal.querySelector(
            ".messages"
          ) as HTMLDivElement | null;

          // Ensure promptInput exists before adding event listeners
          if (promptInput) {
            promptInput.addEventListener("input", () => {
              if (promptInput.value.trim() !== "") {
                generateBtn!.style.display = "inline-block"; // Show the generate button
              } else {
                generateBtn!.style.display = "none"; // Hide the generate button
              }
            });
          }

          // Generate message and add it to the messages list
          if (generateBtn) {
            generateBtn.addEventListener("click", () => {
              const userInput = promptInput!.value.trim();

              if (userInput && messageContainer) {
                const userMessage = document.createElement("p");
                userMessage.className = "message right";
                userMessage.textContent = userInput;
                messageContainer.appendChild(userMessage);

                const result =
                  "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
                const generatedMessage = document.createElement("p");
                generatedMessage.className = "message left";
                generatedMessage.textContent = result;
                messageContainer.appendChild(generatedMessage);

                // Clear the input after generating the message
                promptInput!.value = ""; // Clear input field

                // Show Regenerate and Insert buttons, hide Generate
                generateBtn!.style.display = "none";
                regenerateBtn!.style.display = "inline-block";
                insertBtn!.style.display = "inline-block";
              }
            });
          }

          // Regenerate button adds another generated message
          // if (regenerateBtn) {
          //   regenerateBtn.addEventListener("click", () => {
          //     const result = "Regenerated result."; // Simulate regenerated result
          //     if (messageContainer) {
          //       const regeneratedMessage = document.createElement("p");
          //       regeneratedMessage.className = "message left";
          //       regeneratedMessage.textContent = result;
          //       messageContainer.appendChild(regeneratedMessage);
          //     }
          //   });
          // }

          // Insert the generated text into the message input
          if (insertBtn) {
            insertBtn.addEventListener("click", () => {
              const generatedText =
                messageContainer?.querySelector(".message.left:last-child")
                  ?.textContent || "";
              if (messageInput) {
                if (emptyParagraph) {
                  emptyParagraph.className = "display-none"; // Hide placeholder
                }

                messageInput.innerHTML = `<p>${generatedText}</p>`;
                modal.remove(); // Close the modal
              }
            });
          }

          // Close modal
          const closeModal = modal.querySelector(
            ".close-modal"
          ) as HTMLButtonElement | null;
          closeModal?.addEventListener("click", () => {
            modal.remove(); // Remove modal from the DOM
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
