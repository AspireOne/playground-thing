import { applyMarkdown } from "./applyMarkdown";
import { genRandomUuid, log, logErr, logWarn } from "./utils";

const msgList: {
  [key: string]: string;
} = {};
let noChangeCount = 12;
let speed = "slow";
let appLoopInterval: number;

export function runAppLoop() {
  if (!appLoopInterval) appLoopInterval = setInterval(runAppLoop, 2000);

  log("checking for A.I. messages that changed.");
  let anyAiMessageChanged = false;

  // biome-ignore lint: off
  document.querySelectorAll(".chat-pg-message").forEach((message) => {
    // This is the html as of now (it gets updated sometimes):
    /*<div class="chat-pg-message"><div class="chat-message-role"><div class="chat-message-subheading subheading"><span class="chat-message-role-text">user</span></div></div><div class="text-input-with-focus"><div class="rendered-markdown" id="undefined"><p>dfdsfsdf</p>
      </div><textarea class="text-input text-input-md text-input" rows="1" tabindex="0" placeholder="Enter a user message here." style="height: 100%; display: none;" data-id="7p1sxmhspzflycufeivghc" data-rendered-id="undefined">dfdsfsdf</textarea></div><div class="chat-message-button-container"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24" class="chat-message-remove-button"><path fill-rule="evenodd" d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-3 9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"></path></svg></div></div>
    */

    const textarea = message.querySelector("textarea");
    const role = message.querySelector(".chat-message-role-text");
    const isNew = !textarea?.dataset.id;
    const isUser = role?.textContent === "user";
    if (!textarea) {
      logErr("No textarea found in message.", message);
      return;
    }
    if (!role) logWarn("No role found in message.", message);

    // If it is an user message, skip it.
    if (isUser && isNew) initNewUserMessage(textarea);
    if (isUser) return;

    // if the textarea already has an id (e.g. it was already processed), do not init.
    if (isNew) {
      initNewAiMessage(textarea);
      anyAiMessageChanged = true;
    } else {
      const changed = msgList[textarea.dataset.id!].length !== textarea.value.length;
      if (!changed) return;
      updateAiMessage(textarea as any);
      anyAiMessageChanged = true;
    }
  });

  updateSpeed(anyAiMessageChanged);
}

function updateSpeed(anyMessageChanged: boolean) {
  if (anyMessageChanged) {
    noChangeCount = 0;
    if (speed === "slow") {
      log("Generation detected, speeding up interval of updating markdown.");
      speed = "fast";
      clearInterval(appLoopInterval);
      appLoopInterval = setInterval(runAppLoop, 200);
    }
  }
  // if nothing changed
  else {
    ++noChangeCount;
    if (noChangeCount >= 12 && speed === "fast") {
      log("No generation detected, slowing down interval of updating markdown.");
      speed = "slow";
      clearInterval(appLoopInterval);
      appLoopInterval = setInterval(runAppLoop, 2000);
    }
  }
}

function addUserMsgSaveCursorHook(area: HTMLTextAreaElement) {
  // save the cursor position when the textarea's cursor position changes.
  area.addEventListener("input", () => {
    const cursorPos = area.selectionStart;
    area.dataset.cursorPos = cursorPos.toString();
  });

  area.addEventListener("blur", () => {
    log("Saving user message cursor position.");
    const cursorPos = area.selectionStart;
    area.dataset.cursorPos = cursorPos.toString();
  });
}

function addUserMsgRestoreCursorHook(area: HTMLTextAreaElement) {
  area.addEventListener("focus", () => {
    const cursorPos = area.dataset.cursorPos;
    if (cursorPos) {
      area.selectionStart = parseInt(cursorPos);
      area.selectionEnd = parseInt(cursorPos);
    }
  });
}

function initNewUserMessage(area: HTMLTextAreaElement) {
  log("Initializing new user message.");
  area.dataset.id = genRandomUuid();
  area.dataset.cursorPos = "0";

  addUserMsgSaveCursorHook(area);
  addUserMsgRestoreCursorHook(area);
}

function updateAiMessage(area: HTMLTextAreaElement & { dataset: { id: string } }) {
  // if the value is different, update it (so that we can compare it next time).
  msgList[area.dataset.id] = area.value;
  // if the textarea is not focused, apply markdown.
  if (document.activeElement !== area) applyMarkdown(area);
}

function initNewAiMessage(area: HTMLTextAreaElement) {
  log("Initializing new A.I. message.");
  area.dataset.id = genRandomUuid();
  msgList[area.dataset.id] = area.value;

  area.addEventListener("blur", () => {
    log("Applying markdown to A.I. message after a blur.");
    applyMarkdown(area);
  });

  if (document.activeElement !== area) applyMarkdown(area);
}
