import ReactDOM from "react-dom/client";
import App from "./App";
import "../../assets/main.css";
import { ContentScriptContext } from "wxt/client";

// Inject the React App
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main(ctx) {
    console.log("outside called");
    const editPattern = new MatchPattern("*://*.linkedin.com/messaging/*");
    console.log(location);
    if (editPattern.includes(location)) {
      console.log("i called inside if");

      editMain(ctx);
    }
    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl, oldUrl }) => {
      console.log("hello ji");
      console.log(newUrl, oldUrl);
      if (editPattern.includes(location)) {
        console.log("i called inside inside if");
        editMain(ctx);
      }
    });
  },
});

function editMain(ctx: ContentScriptContext) {
  // Your "/edit" code here
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
