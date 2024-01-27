import { injectStyles } from "./styles";
import { log, logErr } from "./utils";
import { runAppLoop } from "./appLoop";

type Action = {
  func: () => void;
  description: string;
};

const actions: Action[] = [
  { func: injectStyles, description: "Global styles injection." },
  {
    func: () => prefillSystemPrompt("You are an expert programmer."),
    description: "System prompt prefill.",
  },
  //{func: () => prefillTemperature(0.75), description: "Temperature prefill."},
  //{func: setOutputTokensToMax, description: "Set output tokens to max."},
  { func: addCopyHookToPre, description: "Add copy hook to pre tags." },
  { func: addTextboxRefocusHook, description: "Add textbox refocus hook." },
  //{func: overwriteScrollToBehavior, description: "Overwrite scroll behavior."},
  { func: runAppLoop, description: "Main app loop." },
];

let initialized = false;
function initialize() {
  if (initialized) return;
  initialized = true;

  log("Initializing...");
  for (const { description, func } of actions) {
    try {
      func();
      log("Success:", description);
    } catch (e) {
      logErr(`Failed to execute action '${description}': ${e}`);
    }
  }
}

/** Initialize the playground when the page is loaded. */
document.addEventListener("DOMContentLoaded", () => setTimeout(initialize, 2000));
window.addEventListener("load", () => setTimeout(initialize, 2000));

/** Sets the output tokens slider to the max value. */
function setOutputTokensToMax() {
  // Select based on valuemax 4096 of gpt-3.5.
  const slider = document.querySelector('.rc-slider-handle[aria-valuemax="4096"]');
  if (!slider) throw new Error("Slider not found");

  const maxValue = slider.getAttribute("aria-valuemax");
  if (maxValue) slider.setAttribute("aria-valuenow", maxValue);
  else throw new Error("Max temperature value not found");
}

/** Prefills the temperature slider with the given value. */
function prefillTemperature(value: number) {
  const slider = document.querySelector('.rc-slider-handle[aria-valuemax="2"]');
  if (!slider) throw new Error("Slider not found");
  slider.setAttribute("aria-valuenow", `${value}`);
  const sliderHandle = document.querySelector(".rc-slider-handle");
}

/** Prefills the system prompt with the given text. */
function prefillSystemPrompt(prompt: string) {
  const promptDiv = document.querySelector(".chat-pg-instructions");
  const promptTextarea = promptDiv?.querySelector("textarea");
  if (!promptTextarea) {
    throw new Error("Prompt element not found");
  }

  promptTextarea.value = prompt;
  for (const ev of ["input", "keydown", "keypress", "keyup", "onchange"]) {
    promptTextarea.dispatchEvent(new Event(ev, { bubbles: true }));
  }
}

/** Adds a hook to focus on input textbox when switching back to playground. */
function addTextboxRefocusHook() {
  window.addEventListener("focus", () => {
    const allMessages = document.querySelectorAll(".chat-pg-message");
    const userMessages = Array.from(allMessages).filter(
      (m) => m.querySelector(".chat-message-role-text")?.textContent === "user",
    );

    const lastUserMessage = userMessages?.length >= 1 && userMessages[userMessages.length - 1];

    if (!lastUserMessage) {
      throw new Error("No last user message found. This should not happen");
    }

    log("Refocusing user message", lastUserMessage);

    const textarea = lastUserMessage.querySelector("textarea");
    if (!textarea) {
      throw new Error("No textarea found in last user message. This should not happen");
    }
    textarea.focus();
  });
}

/** Adds a hook to all pre tags to copy their content to clipboard when clicked. */
function addCopyHookToPre() {
  document.addEventListener("click", async (e) => {
    const element = e.target as HTMLPreElement | undefined;
    if (!element) {
      throw new Error("No element clicked.");
    }

    if (element.tagName !== "PRE" || !element!.matches("pre")) {
      throw new Error("Element clicked is not a pre tag.");
    }

    e.stopPropagation();
    const content = element.textContent;
    if (!content) {
      throw new Error("No content to copy from pre element.");
    }
    await navigator.clipboard.writeText(content);
  });
}

/** Overwrites the default scroll behavior to only scroll when the user is near the bottom. */
function overwriteScrollToBehavior() {
  const element = document.querySelector(".chat-pg-exchange-container");

  if (!element) {
    throw new Error("No element to overwrite scroll behavior.");
    return;
  }

  const originalScrollTopDescriptor = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "scrollTop",
  );

  const isNearBottom = (element: Element) => {
    const currY = element.scrollTop;
    const maxY = element.scrollHeight - element.clientHeight - 1;
    return maxY - currY < 100;
  };

  Object.defineProperty(element, "scrollTop", {
    set: (value) => {
      if (isNearBottom(element)) {
        //originalScrollTopDescriptor.set.call(this, value);
        // make the scroll smooth
        element!.scrollTo({
          top: value,
          behavior: "smooth",
        });
      }
    },
    get: () => {
      // @ts-ignore
      return originalScrollTopDescriptor?.get?.call(this);
    },
  });
}
