import "./reset.scss";
import "./styles.scss";
import { debounce } from "./utils";
import { getAutoCompleteOptions } from "./api";
import { KEYS } from "./constants";
import { renderSpinner } from "./components/Spinner";

const renderAutoCompleteSuggestions = (e, suggestions) => {
  const autoCompleteSection = document.querySelector("#auto-complete");
  autoCompleteSection.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion;
    listItem.addEventListener("click", () => {
      e.target.value = suggestion;
      autoCompleteSection.classList.add("hidden");
    });
    autoCompleteSection.appendChild(listItem);
  });
};

const renderInput = () => {
  let index = -1;

  const inputWrapper = document.createElement("div");
  inputWrapper.classList.add("input-wrapper");
  const inputId = "input";

  document.addEventListener("click", (e) => {
    if (!inputWrapper.contains(e.target)) {
      index = -1;
      document.querySelector("#auto-complete").classList.add("hidden");
    }
  });

  const autoCompleteSection = document.createElement("ul");
  autoCompleteSection.id = "auto-complete";

  const label = document.createElement("label");
  label.textContent = "Fruit";
  label.htmlFor = inputId;

  const input = document.createElement("input");
  input.id = inputId;
  input.autocomplete = "off";
  input.placeholder = "Enter a Fruit";

  const handleChange = debounce(async function (e) {
    index = -1;
    autoCompleteSection.classList.remove("hidden");
    try {
      const spinner = renderSpinner();
      autoCompleteSection.innerHTML = "";
      autoCompleteSection.appendChild(spinner);
      const suggestions = await getAutoCompleteOptions(e.target.value);
      renderAutoCompleteSuggestions(e, suggestions);
    } catch (e) {
      console.error(e);
    }
  }, 300);

  input.addEventListener("input", handleChange);
  input.addEventListener("focus", handleChange);
  input.addEventListener("keyup", (e) => {
    index = handleAutoCompleteSelect(e, index);
  });

  inputWrapper.appendChild(label);
  inputWrapper.appendChild(input);
  inputWrapper.appendChild(autoCompleteSection);

  return inputWrapper;
};

function renderForm() {
  const form = document.createElement("form");
  form.appendChild(renderInput());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.target.elements["input"].value);
  });

  return form;
}

document.body.appendChild(renderForm());

const autoCompleteSectionScrollObserver = new IntersectionObserver(
  (entries) => {
    const [{ intersectionRatio, target }] = entries;
    if (intersectionRatio < 1) {
      document.querySelector("#auto-complete").scroll({
        top: target.offsetTop,
        left: 0,
        behavior: "smooth",
      });
      autoCompleteSectionScrollObserver.unobserve(target);
    }
  },
  {
    root: document.querySelector("#auto-complete"),
  }
);

function handleAutoCompleteSelect(e, idx) {
  const autoCompleteSection = document.querySelector("#auto-complete");

  const isEnter = e.code === KEYS.ENTER;
  const isArrowDown = e.code === KEYS.ARROW_DOWN;
  const isArrowUp = e.code === KEYS.ARROW_UP;

  const accessibleKeys = isArrowDown || isArrowUp || isEnter;

  if (!accessibleKeys) {
    return idx;
  }

  if (isEnter) {
    autoCompleteSection.classList.add("hidden");
    return idx;
  }

  if (idx <= 0 && isArrowUp) {
    return idx;
  }

  if (idx >= autoCompleteSection.children.length - 1 && isArrowDown) {
    return idx;
  }

  if (isArrowDown) {
    idx++;
  } else {
    idx--;
  }

  e.target.value = autoCompleteSection.children[idx].textContent;

  Array.from(autoCompleteSection.children).forEach((item, i) => {
    const isActive = idx === i;
    if (isActive) {
      autoCompleteSection.children[idx].classList.add("active");
      autoCompleteSectionScrollObserver.observe(
        autoCompleteSection.children[idx]
      );
    } else {
      item.classList.remove("active");
      autoCompleteSectionScrollObserver.unobserve(
        autoCompleteSection.children[i]
      );
    }
  });

  return idx;
}
