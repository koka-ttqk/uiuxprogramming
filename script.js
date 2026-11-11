const serviceName = "WordMate";
let isSubscribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "의 문의 사항 전달이 완료되었습니다.";
    }
    
    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscirbe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent = 
        makeSubscribeMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "전달 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscirbe);

const themeButton = document.querySelector("#themeButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 모드" : "다크 모드";

    themeButton.setAttribute("aria-pressed", String(isDark));
}

themeButton.addEventListener("click", handleThemeClick);


/* 모바일 햄버거 메뉴 */
const menuButton = document.querySelector("#menuButton");
const headerNav = document.querySelector("#header-nav");

/* 메뉴 열기 및 닫기 */
function handleMenuClick() {
    const isOpen = headerNav.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");

    const menuIcon = menuButton.querySelector(".menu-icon");
    const menuText = menuButton.querySelector(".menu-text");
    menuText.textContent = isOpen ? "닫기" : "메뉴";
    menuIcon.textContent = isOpen ? "✕" : "☰";
}

menuButton.addEventListener("click", handleMenuClick);

/* 메뉴 선택 후 자동 닫기 */
const headerLinks = document.querySelectorAll(".header-nav a");

/* 현재 위치 메뉴 표시 */
/* 스크롤 위치에 따라 현재 메뉴 표시 */
function updateActiveMenu() {
    const header = document.querySelector(".site-header");
    const position = header.getBoundingClientRect().bottom + 80;

    let currentId = "about";

    /* 메뉴에 연결된 영역만 확인 */
    headerLinks.forEach(function (link) {
        const targetId = link.getAttribute("href");
        const section = document.querySelector(targetId);

        if (!section || section.hidden) return;

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= position) {
            currentId = section.id;
        }
    });

    /* 페이지 맨 아래에서는 마지막 메뉴 강조 */
    const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 5;

    if (isAtBottom) {
        currentId = "subscribe";
    }

    /* 현재 메뉴 강조 및 접근성 속성 적용 */
    headerLinks.forEach(function (link) {
        const isCurrent =
            link.getAttribute("href") === "#" + currentId;

        link.classList.toggle("is-active", isCurrent);

        if (isCurrent) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

/* 스크롤할 때 현재 메뉴 갱신 */
let scrollScheduled = false;

window.addEventListener("scroll", function () {
    if (scrollScheduled) return;

    scrollScheduled = true;

    requestAnimationFrame(function () {
        updateActiveMenu();
        scrollScheduled = false;
    });
});

/* 페이지 최초 접속 및 새로고침 */
window.addEventListener("load", updateActiveMenu);

/* 메뉴 이동 및 뒤로 가기 */
window.addEventListener("hashchange", function () {
    requestAnimationFrame(updateActiveMenu);
});

window.addEventListener("popstate", function () {
    requestAnimationFrame(updateActiveMenu);
});

/* 초기 메뉴 상태 표시 */
updateActiveMenu();

/* 메뉴 선택 후 모바일 메뉴 닫기 */
headerLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        headerNav.classList.remove("is-open");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
        menuButton.querySelector(".menu-icon").textContent = "☰";
        menuButton.querySelector(".menu-text").textContent = "메뉴";
    });
});

/* PC 화면으로 변경하면 메뉴 상태 초기화 */
window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) {
        headerNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "메뉴 열기");
        menuButton.querySelector(".menu-icon").textContent = "☰";
        menuButton.querySelector(".menu-text").textContent = "메뉴";
    }
});

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = "#" + clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});


/* 영어 단어 학습 설정 */
const learningFlow = document.querySelector("#learning-flow");
const learningForm = document.querySelector("#learning-form");
const flowSteps = learningFlow.querySelectorAll(".step");
const progressItems = learningFlow.querySelectorAll(".progress__item");

const titleInput = document.querySelector("#learning-title-input");
const titleCount = document.querySelector("#title-count");
const titleError = document.querySelector("#title-error");
const countInput = document.querySelector("#word-count");
const countError = document.querySelector("#count-error");
const countNext = document.querySelector("#count-next");

const levelRange = document.querySelector("#level-range");
const levelValue = document.querySelector("#level-value");
const exampleOption = document.querySelector("#example-option");
const exampleOptions = document.querySelector("#example-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");

const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");

const summaryTitle = document.querySelector("#summary-title");
const summaryCount = document.querySelector("#summary-count");
const summaryLevel = document.querySelector("#summary-level");
const summaryExample = document.querySelector("#summary-example");
const submitStatus = document.querySelector("#submit-status");

const savedSettingsList = document.querySelector("#saved-settings-list");
const settingsEmptyMessage = document.querySelector("#settings-empty-message");

/* 학습 설정 필터 */
const settingsFilterButtons = document.querySelectorAll(".settings-filter");
const settingsResultCount = document.querySelector("#settings-result-count");

let selectedLevel = "전체";

const levelValues = ["초급", "중급", "고급"];
const storageKey = "wordmate-learning-settings";

const formData = {
    title: "",
    count: "",
    level: "중급",
    example: false,
    exampleType: "together"
};

let savedSettings = [];
let isSubmitting = false;

/* 학습 설정 필터 선택 */
settingsFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedLevel = button.dataset.level;

        settingsFilterButtons.forEach(function (item) {
            const isSelected = item === button;

            item.classList.toggle("is-active", isSelected);
            item.setAttribute("aria-pressed", String(isSelected));
        });

        renderSavedSettings();
    });
});

/* 단계 표시 */
function showStep(index) {
    flowSteps.forEach(function (step, i) {
        step.hidden = i !== index;
    });

    progressItems.forEach(function (item, i) {
        item.classList.toggle("is-active", i === index && i < 3);
    });
}


/* 입력 상태 표시 */
function showFieldError(input, errorElement, message, isValid = false) {
    errorElement.textContent = message;

    input.classList.toggle("has-error", message !== "" && !isValid);
    input.classList.toggle("is-valid", isValid);

    errorElement.classList.toggle("is-valid", isValid);

    input.setAttribute("aria-invalid", String(message !== "" && !isValid));
}

/* 학습 설정 이름 검증 */
function validateTitle() {
    const value = titleInput.value.trim();

    if (value.length < 2 || value.length > 30) {
        showFieldError(
            titleInput,
            titleError,
            "학습 설정 이름을 2~30자로 입력해 주세요."
        );
        return false;
    }

    showFieldError(
        titleInput,
        titleError,
        "학습 설정 이름이 올바르게 입력되었습니다.",
        true
    );

    formData.title = value;
    return true;
}

/* 단어 개수 검증 */
function validateCount() {
    const value = countInput.value.trim();
    const count = Number(value);

    if (
        value === "" ||
        !Number.isInteger(count) ||
        count < 1 ||
        count > 20
    ) {
        showFieldError(
            countInput,
            countError,
            "단어 개수는 1~20 사이의 정수로 입력해 주세요."
        );
        return false;
    }

    showFieldError(
        countInput,
        countError,
        "학습할 단어 개수가 올바르게 입력되었습니다.",
        true
    );

    formData.count = count;
    return true;
}

/* 실시간 입력 확인 */
titleInput.addEventListener("input", function () {
    titleCount.textContent = titleInput.value.length + " / 30자";
    validateTitle();
});

countInput.addEventListener("input", function () {
    validateCount();
});

/* 1단계 → 2단계 */
countNext.addEventListener("click", function () {
    const titleValid = validateTitle();
    const countValid = validateCount();

    if (!titleValid || !countValid) {
        if (!titleValid) {
            titleInput.focus();
        } else {
            countInput.focus();
        }
        return;
    }

    showStep(1);
});

/* 난이도 변경 */
levelRange.addEventListener("input", function () {
    levelValue.value = levelValues[Number(levelRange.value)];
});

/* 예문 학습 조건부 입력 */
exampleOption.addEventListener("change", function () {
    const checked = exampleOption.checked;

    exampleOptions.hidden = !checked;
    exampleOptions.disabled = !checked;
    exampleOption.setAttribute("aria-expanded", String(checked));
});

/* 2단계 이동 */
optionPrev.addEventListener("click", function () {
    showStep(0);
});

optionNext.addEventListener("click", function () {
    formData.level = levelValues[Number(levelRange.value)];
    formData.example = exampleOption.checked;

    const selectedExample = document.querySelector(
        'input[name="example-type"]:checked'
    );

    formData.exampleType = selectedExample.value;

    summaryTitle.textContent = formData.title;
    summaryCount.textContent = formData.count + "개";
    summaryLevel.textContent = formData.level;

    summaryExample.textContent = formData.example
        ? (formData.exampleType === "together"
            ? "뜻과 예문 함께 보기"
            : "뜻 확인 후 예문 보기")
        : "미포함";

    showStep(2);
});

/* 3단계 → 2단계 */
summaryPrev.addEventListener("click", function () {
    showStep(1);
});

/* 저장한 학습 설정 불러오기 */
function loadSavedSettings() {
    try {
        const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
        savedSettings = Array.isArray(data) ? data : [];
    } catch (error) {
        savedSettings = [];
    }

    renderSavedSettings();
}

/* 저장한 학습 설정 카드 표시 */
function renderSavedSettings() {
    savedSettingsList.replaceChildren();

    /* 선택한 난이도에 맞는 설정만 가져오기 */
    const filteredSettings = savedSettings.filter(function (setting) {
        return selectedLevel === "전체" || setting.level === selectedLevel;
    });

    /* 현재 표시되는 결과 개수 */
    settingsResultCount.textContent =
        "현재 " + filteredSettings.length +
        "개의 학습 설정이 표시되고 있습니다.";

    /* 전체 목록이 없는 경우와 필터 결과가 없는 경우 구분 */
    if (savedSettings.length === 0) {
        settingsEmptyMessage.textContent =
            "아직 저장된 학습 설정이 없습니다. 새로운 학습 설정을 만들어 보세요.";
    } else if (filteredSettings.length === 0) {
        settingsEmptyMessage.textContent =
            selectedLevel + " 난이도로 저장된 학습 설정이 없습니다. 다른 난이도를 선택해 보세요.";
    }

    settingsEmptyMessage.hidden = filteredSettings.length > 0;

    filteredSettings.forEach(function (setting) {
        const card = document.createElement("article");
        card.className = "saved-setting-card";

        const title = document.createElement("h3");
        title.textContent = setting.title;

        const description = document.createElement("p");
        description.textContent =
            setting.level + " · " + setting.count +
            "개 · 예문 학습 " +
            (setting.example ? "포함" : "미포함");

        const actions = document.createElement("div");
        actions.className = "saved-setting-actions";

        const startButton = document.createElement("button");
        startButton.type = "button";
        startButton.textContent = "이 설정으로 학습하기";

        startButton.addEventListener("click", function () {
            formData.title = setting.title;
            formData.count = setting.count;
            formData.level = setting.level;
            formData.example = setting.example;
            formData.exampleType = setting.exampleType;

            isStudyConfigured = true;
            startStudy();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "삭제";
        deleteButton.className = "delete-setting";

        deleteButton.addEventListener("click", function () {
            const updated = savedSettings.filter(function (item) {
                return item.id !== setting.id;
            });

            try {
                localStorage.setItem(storageKey, JSON.stringify(updated));
                savedSettings = updated;
                renderSavedSettings();
            } catch (error) {
                alert("설정을 삭제하지 못했습니다.");
            }
        });

        actions.append(startButton, deleteButton);
        card.append(title, description, actions);
        savedSettingsList.appendChild(card);
    });
}


/* 폼 제출 및 저장 */
learningForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (isSubmitting) return;

    const titleValid = validateTitle();
    const countValid = validateCount();

    if (!titleValid || !countValid) {
        showStep(0);

        if (!titleValid) {
            titleInput.focus();
        } else {
            countInput.focus();
        }

        return;
    }

    isSubmitting = true;
    finishButton.disabled = true;
    finishButton.textContent = "저장 중...";
    submitStatus.textContent = "학습 설정을 저장하고 있습니다...";

    const newSetting = {
        id: Date.now().toString(),
        title: formData.title,
        count: formData.count,
        level: formData.level,
        example: formData.example,
        exampleType: formData.exampleType
    };

    setTimeout(function () {
        try {
            const updated = [...savedSettings, newSetting];

            localStorage.setItem(storageKey, JSON.stringify(updated));

            savedSettings = updated;
            isStudyConfigured = true;

            renderSavedSettings();
            showStep(3);

            studyReadyMessage.textContent =
                formData.level + " 난이도의 영어 단어 " +
                formData.count + "개를 학습할 수 있습니다.";

            studyReadyButton.textContent = "오늘의 단어 학습 시작하기";
            submitStatus.textContent = "";

        } catch (error) {
            submitStatus.textContent =
                "저장에 실패했습니다. 브라우저 저장 공간을 확인한 후 다시 시도해 주세요.";

        } finally {
            isSubmitting = false;
            finishButton.disabled = false;
            finishButton.textContent = "학습 설정 저장하기";
        }
    }, 600);
});

/* 새로운 학습 설정 만들기 */
restartButton.addEventListener("click", function () {
    learningForm.reset();

    formData.title = "";
    formData.count = "";
    formData.level = "중급";
    formData.example = false;
    formData.exampleType = "together";

    titleCount.textContent = "0 / 30자";
    showFieldError(titleInput, titleError, "");
    showFieldError(countInput, countError, "");

    levelValue.value = "중급";
    exampleOptions.hidden = true;
    exampleOptions.disabled = true;
    exampleOption.setAttribute("aria-expanded", "false");

    submitStatus.textContent = "";
    showStep(0);
    titleInput.focus();
});

/* 페이지를 열면 저장된 설정 표시 */
loadSavedSettings();
showStep(0);


const wordLearning = document.querySelector("#word-learning");
const studyComplete = document.querySelector("#study-complete");

const studyWord = document.querySelector("#study-word");
const studyMeaning = document.querySelector("#study-meaning");
const studyExample = document.querySelector("#study-example");
const studyTranslation = document.querySelector("#study-translation");

const showMeaning = document.querySelector("#show-meaning");
const showExample = document.querySelector("#show-example");
const exampleArea = document.querySelector("#study-example-area");
const exampleContent = document.querySelector("#study-example-content");

const studyPrev = document.querySelector("#study-prev");
const studyNext = document.querySelector("#study-next");

const studyProgressText = document.querySelector("#study-progress-text");
const studyProgressBar = document.querySelector("#study-progress-bar");
const studySettings = document.querySelector("#study-settings");

const studySettingsDialog = document.querySelector("#study-settings-dialog");

const studyReady = document.querySelector("#study-ready");
const studyReadyMessage = document.querySelector("#study-ready-message");
const studyReadyButton = document.querySelector("#study-ready-button");
const studyContent = document.querySelector("#study-content");

let isStudyConfigured = false;

let selectedWords = [];
let currentWordIndex = 0;
let revealedWords = [];

studyReadyButton.addEventListener("click", function () {
    if (!isStudyConfigured) {
        learningFlow.scrollIntoView({ behavior: "smooth" });
        showStep(0);
        titleInput.focus();
    } else {
        startStudy();
    }
});

// 난이도에 맞는 단어를 무작위로 선택
function selectRandomWords() {
    const levelKeys = {
        "초급": "beginner",
        "중급": "intermediate",
        "고급": "advanced"
    };

    const level = levelKeys[formData.level];
    const words = [...wordData[level]];

    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }

    return words.slice(0, formData.count);
}

// 학습 화면 표시
function renderWord() {
    const currentWord = selectedWords[currentWordIndex];

    studyWord.textContent = currentWord.word;
    studyMeaning.textContent = currentWord.meaning;
    studyExample.textContent = currentWord.example;
    studyTranslation.textContent = currentWord.translation;

    const revealed = revealedWords[currentWordIndex];

    studyMeaning.hidden = !revealed;
    showMeaning.hidden = revealed;

    exampleArea.hidden = !formData.example || !revealed;

    const showTogether = formData.exampleType === "together";

    exampleContent.hidden = !revealed || !showTogether;
    showExample.hidden = !revealed || showTogether;

    studyProgressText.textContent =
        `${currentWordIndex + 1} / ${selectedWords.length}`;

    studyProgressBar.max = selectedWords.length;
    studyProgressBar.value = currentWordIndex + 1;

    studyPrev.disabled = currentWordIndex === 0;

    studyNext.textContent =
        currentWordIndex === selectedWords.length - 1
            ? "학습 완료하기"
            : "다음 단어";
}

// 학습 시작
function startStudy(useNewWords = true) {
    if (useNewWords) {
        selectedWords = selectRandomWords();
    }

    currentWordIndex = 0;
    revealedWords = Array(selectedWords.length).fill(false);

    studyComplete.hidden = true;

    studyReady.hidden = true;
    studyContent.hidden = false;

    studySettings.textContent =
        `${formData.level} · ${selectedWords.length}개 · 예문 학습 ${
            formData.example ? "포함" : "미포함"
        }`;

    renderWord();

    wordLearning.scrollIntoView({ behavior: "smooth" });
}

// 뜻 확인
showMeaning.addEventListener("click", () => {
    revealedWords[currentWordIndex] = true;
    renderWord();
});

// 예문 확인
showExample.addEventListener("click", () => {
    exampleContent.hidden = false;
    showExample.hidden = true;
});

// 이전 단어
studyPrev.addEventListener("click", () => {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        renderWord();
    }
});

// 다음 단어
studyNext.addEventListener("click", () => {
    if (currentWordIndex < selectedWords.length - 1) {
        currentWordIndex++;
        renderWord();
    } else {
        checkUnfinishedWords();
    }
});

// 설정 완료 후 학습 시작
document.querySelector("#begin-study").addEventListener("click", () => {
    startStudy();
});

// 같은 단어 다시 학습
document.querySelector("#study-repeat").addEventListener("click", () => {
    startStudy(false);
});

// 새로운 단어 학습
document.querySelector("#study-new").addEventListener("click", () => {
    startStudy(true);
});

// 학습 설정 초기화 화면으로 이동
function returnToSettings() {
    isStudyConfigured = false;

    studyContent.hidden = true;
    studyReady.hidden = false;
    studyComplete.hidden = true;

    studyReadyMessage.textContent =
        "학습을 시작하려면 먼저 학습 조건을 설정해 주세요.";

    studyReadyButton.textContent = "학습 설정하기";

    restartButton.click();

    learningFlow.scrollIntoView({ behavior: "smooth" });
}

document.querySelector("#study-reset").addEventListener("click", returnToSettings);

// 현재 설정 확인
document.querySelector("#study-settings-button").addEventListener("click", () => {
    document.querySelector("#study-settings-summary").textContent =
        `단어 ${formData.count}개 / 난이도 ${formData.level} / 예문 학습 ${
            formData.example
                ? (formData.exampleType === "together"
                    ? "뜻과 예문 함께 보기"
                    : "뜻 확인 후 예문 보기")
                : "미포함"
        }`;

    studySettingsDialog.showModal();
});

// 설정 변경 취소: 기존 학습 유지
document.querySelector("#study-settings-cancel").addEventListener("click", () => {
    studySettingsDialog.close();
});

// 설정 변경: 기존 학습 종료 후 재설정
document.querySelector("#study-settings-change").addEventListener("click", () => {
    studySettingsDialog.close();
    returnToSettings();
});

const unfinishedDialog = document.querySelector("#unfinished-dialog");
const unfinishedMessage = document.querySelector("#unfinished-message");

const reviewUnfinished = document.querySelector("#review-unfinished");
const finishAnyway = document.querySelector("#finish-anyway");

function completeStudy() {
    studyReady.hidden = true;
    studyContent.hidden = true;
    studyComplete.hidden = false;

    document.querySelector("#study-complete-message").textContent =
        `${selectedWords.length}개의 영어 단어 학습을 완료했습니다.`;

    wordLearning.scrollIntoView({ behavior: "smooth" });
}

function checkUnfinishedWords() {
    const unfinishedCount = revealedWords.filter(
        revealed => !revealed
    ).length;

    if (unfinishedCount > 0) {
        unfinishedMessage.textContent =
            `총 ${selectedWords.length}개 중 ${unfinishedCount}개의 단어를 아직 확인하지 않았습니다.`;

        unfinishedDialog.showModal();
    } else {
        completeStudy();
    }
}

reviewUnfinished.addEventListener("click", () => {
    unfinishedDialog.close();

    const firstUnfinishedIndex = revealedWords.findIndex(
        revealed => !revealed
    );

    if (firstUnfinishedIndex !== -1) {
        currentWordIndex = firstUnfinishedIndex;
        renderWord();

        wordLearning.scrollIntoView({ behavior: "smooth" });
    }
});

finishAnyway.addEventListener("click", () => {
    unfinishedDialog.close();
    completeStudy();
});