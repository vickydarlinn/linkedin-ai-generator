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
          browser.runtime.sendMessage({ message: Date.now() });
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
