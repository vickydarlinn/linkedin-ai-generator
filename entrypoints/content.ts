import "./style.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/messaging/*", "*://*.google.com/*"],

  main(ctx) {
    console.log("This is LinkedIn message URL");

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver((mutations) => {
      const messageInputSelector = "div.msg-form__contenteditable"; // Selector for LinkedIn message input
      const messageInput = document.querySelector(messageInputSelector);

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
            <div class="custom-modal-content" >
              <span class="close-button">&times;</span>
              <h2>Modal Title</h2>
              <p>This is the content inside the modal.</p>
              <button class="close-modal">Close Modal</button>
            </div>
          </div>
          `;
          // Append modal to body
          document.body.appendChild(modal);

          // Close modal on click of close button
          const closeModalButton = modal.querySelector(".close-button");
          closeModalButton?.addEventListener("click", () => {
            modal.remove(); // Remove modal from the DOM
          });

          const closeModal = modal.querySelector(".close-modal");
          closeModal?.addEventListener("click", () => {
            modal.remove(); // Remove modal from the DOM
          });

          console.log("Sending message through button");
        }
      }
    });

    // Start observing changes in the DOM
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
