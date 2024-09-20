import "./style.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/messaging/*"],

  main(ctx) {
    console.log("This is LinkedIn message URL");
  },
});
