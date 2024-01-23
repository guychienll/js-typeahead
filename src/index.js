import './reset.scss';
import './styles.scss';
import { debounce } from './utils';
import { getAutoCompleteOptions } from './api';
import { KEYS } from './constants';
import { renderSpinner } from './components/Spinner';

const autoCompleteSectionScrollObserver = new IntersectionObserver(
    (entries) => {
        const [{ intersectionRatio, target }] = entries;
        if (intersectionRatio < 1) {
            document.querySelector('#auto-complete').scroll({
                top: target.offsetTop,
                left: 0,
                behavior: 'smooth',
            });
            autoCompleteSectionScrollObserver.unobserve(target);
        }
    },
    {
        root: document.querySelector('#auto-complete'),
    },
);

function handleAutoCompleteSelect(e, currentIndex) {
    let _currentIndex = currentIndex;
    const autoCompleteSection = document.querySelector('#auto-complete');
    const isEnterKey = e.key === KEYS.ENTER;
    const isArrowDownKey = e.key === KEYS.ARROW_DOWN;
    const isArrowUpKey = e.key === KEYS.ARROW_UP;

    if (!isEnterKey && !isArrowDownKey && !isArrowUpKey) {
        return _currentIndex;
    }

    if (isEnterKey) {
        autoCompleteSection.classList.add('hidden');
        return _currentIndex;
    }

    if (_currentIndex <= 0 && isArrowUpKey) {
        return _currentIndex;
    }

    if (
        _currentIndex >= autoCompleteSection.children.length - 1 &&
        isArrowDownKey
    ) {
        return _currentIndex;
    }

    _currentIndex = isArrowDownKey ? _currentIndex + 1 : _currentIndex - 1;
    e.target.value = autoCompleteSection.children[_currentIndex].textContent;

    Array.from(autoCompleteSection.children)
        .entries()
        .forEach(([index, item]) => {
            const isActive = _currentIndex === index;
            if (isActive) {
                item.classList.add('active');
                autoCompleteSectionScrollObserver.observe(item);
            } else {
                item.classList.remove('active');
                autoCompleteSectionScrollObserver.unobserve(item);
            }
        });

    return _currentIndex;
}
const renderAutoCompleteSuggestions = (e, suggestions) => {
    const autoCompleteSection = document.querySelector('#auto-complete');
    while (autoCompleteSection.firstChild) {
        autoCompleteSection.removeChild(autoCompleteSection.firstChild);
    }
    suggestions.forEach((suggestion) => {
        const listItem = document.createElement('li');
        listItem.textContent = suggestion;
        listItem.addEventListener('click', () => {
            e.target.value = suggestion;
            autoCompleteSection.classList.add('hidden');
        });
        autoCompleteSection.appendChild(listItem);
    });
};

const renderInput = () => {
    let index = -1;

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('input-wrapper');
    const inputId = 'input';

    document.addEventListener('click', (e) => {
        if (!inputWrapper.contains(e.target)) {
            index = -1;
            document.querySelector('#auto-complete').classList.add('hidden');
        }
    });

    const autoCompleteSection = document.createElement('ul');
    autoCompleteSection.id = 'auto-complete';

    const label = document.createElement('label');
    label.textContent = 'Fruit';
    label.htmlFor = inputId;

    const input = document.createElement('input');
    input.id = inputId;
    input.autocomplete = 'off';
    input.placeholder = 'Enter a Fruit';

    const handleChange = debounce(async (e) => {
        index = -1;
        autoCompleteSection.classList.remove('hidden');
        try {
            const spinner = renderSpinner();
            autoCompleteSection.innerHTML = '';
            autoCompleteSection.appendChild(spinner);
            const suggestions = await getAutoCompleteOptions(e.target.value);
            renderAutoCompleteSuggestions(e, suggestions);
        } catch (err) {
            console.error(err);
        }
    }, 300);

    input.addEventListener('input', handleChange);
    input.addEventListener('focus', handleChange);
    input.addEventListener('keyup', (e) => {
        index = handleAutoCompleteSelect(e, index);
    });

    inputWrapper.appendChild(label);
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(autoCompleteSection);

    return inputWrapper;
};

function renderForm() {
    const form = document.createElement('form');
    form.appendChild(renderInput());

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e.target.elements.input.value);
    });

    return form;
}

document.body.appendChild(renderForm());
document.querySelector('#auto-complete').classList.add('hidden');
