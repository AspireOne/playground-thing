import { genRandomUuid, logWarn } from "./utils";
import { marked } from "marked";
import hljs from "highlight.js";

/** Applies markdown and code highlighting for all openai textboxes. */
export const applyMarkdown = (markdownArea: HTMLTextAreaElement) => {
  // Get id.
  const id = markdownArea.dataset.renderedId || genRandomUuid();
  markdownArea.dataset.renderedId = id;

  // Convert markdown to HTML.
  const renderedHtml = marked.parse(markdownArea.value);

  // Remove old rendered HTML if it exists.
  if (markdownArea.dataset.renderedId) {
    document.getElementById(markdownArea.dataset.renderedId)?.remove();
  }

  // Create a container for the rendered HTML.
  const renderedContainer = document.createElement("div");
  renderedContainer.classList.add("rendered-markdown");
  renderedContainer.id = id;
  renderedContainer.innerHTML = renderedHtml;

  // Insert the rendered HTML.
  const parent = markdownArea.parentElement;
  if (!parent) {
    logWarn("No parent element found for markdown area.", markdownArea);
    return;
  }
  parent.insertBefore(renderedContainer, markdownArea);

  // Hide the real textarea.
  markdownArea.style.display = "none";

  applySyntaxHighlighting();

  let lastClickTime = 0;
  // When textarea clicked, revert it.
  let isDragging = false;

  parent.addEventListener("mousedown", () => {
    isDragging = false;
  });

  parent.addEventListener("mousemove", () => {
    isDragging = true;
  });

  parent.addEventListener("mouseup", (event) => {
    const wasDragging = isDragging;
    isDragging = false;
    // Get the current time
    const currentTime = new Date().getTime();
    // Check if the time difference between the last and current click is less than 500ms
    if (currentTime - lastClickTime < 500 && !wasDragging) {
      document.getElementById(id)?.remove();
      markdownArea.style.display = "";
      markdownArea.dataset.renderedId = undefined;
      // make the textarea stretch, otherwise it will be very small.
      markdownArea.style.height = "100%";
      // add "." to it's text content.
      markdownArea.value += ".";
      // now remove it.
      markdownArea.value = markdownArea.value.slice(0, -1);
    }
    // Store the timestamp of current click
    lastClickTime = currentTime;
  });
};

function applySyntaxHighlighting() {
  // biome-ignore lint/complexity/noForEach: off.
  document.querySelectorAll("pre").forEach((block) => {
    hljs.highlightElement(block);
  });
}
