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
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기"
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentlength = Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentlength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed 
        ? "학습 설정을 시작할 수 있습니다"
        : "준비 완료를 체크하면 학습 설정을 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

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

const learningFlow = document.querySelector("#learning-flow");
const flowSteps = learningFlow.querySelectorAll(".step");
const progressItems = learningFlow.querySelectorAll(".progress__item");
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
const summaryCount = document.querySelector("#summary-count");
const summaryLevel = document.querySelector("#summary-level");
const summaryExample = document.querySelector("#summary-example");
const levelValues = ["초급", "중급", "고급"];

const formData = {
    count: "", level: "중급", review: false, exampleType: "together"
};


function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const learningDialog = document.querySelector("#learning-dialog");
const learningCancel = document.querySelector("#learning-cancel");
const learningConfirm = document.querySelector("#learning-confirm");

function revokeLearningReady() {
    agreeCheck.checked = false;
    learningFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    learningDialog.showModal();
});
learningCancel.addEventListener("click", () => {
    learningDialog.close();
    revokeLearningReady();
});
learningDialog.addEventListener("cancel", revokeLearningReady);
learningConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    learningDialog.close();
    learningFlow.hidden = false;
    showStep(0);
    learningFlow.scrollIntoView({ behavior: "smooth" });
    countInput.focus();
});

function validateCount() {
    const value = countInput.value.trim();
    if (!value || !Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 20) {
        countError.textContent = "1~20 사이의 정수를 입력해 주세요.";
        countInput.classList.add("has-error");
        countInput.focus();
        return false;
    }
    countError.textContent = "";
    countInput.classList.remove("has-error");
    formData.count = Number(value);
    return true;
}

countNext.addEventListener("click", () => {
    if (!validateCount()) return;
    showStep(1);
});

levelRange.addEventListener("input", () => {
    levelValue.value = levelValues[levelRange.value];
});
exampleOption.addEventListener("change", () => {
    exampleOptions.hidden = !exampleOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.level = levelValues[levelRange.value];
    formData.example = exampleOption.checked;
    const exampleType = document.querySelector(
        'input[name="example-type"]:checked'
    );

    formData.exampleType = exampleType.value;

    summaryCount.textContent = formData.count + "개";
    summaryLevel.textContent = formData.level;

    summaryExample.textContent = formData.example
        ? (formData.exampleType === "together"
            ? "뜻과 예문 함께 보기"
            : "뜻 확인 후 예문 보기")
        : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => {
    isStudyConfigured = true;

    showStep(3);

    studyReadyMessage.textContent =
        `학습 설정이 완료되었습니다. ${formData.level} 난이도의 영어 단어 ${formData.count}개를 학습할 수 있습니다.`;

    studyReadyButton.textContent = "오늘의 단어 학습 시작하기";
});

restartButton.addEventListener("click", () => {
    formData.count = "";
    formData.level = "중급";
    formData.example = false;
    formData.exampleType = "together";

    countInput.value = "";
    countError.textContent = "";
    countInput.classList.remove("has-error");
    levelRange.value = "1";
    levelValue.value = "중급";

    exampleOption.checked = false;
    exampleOptions.hidden = true;

    document.querySelector(
        'input[name="example-type"][value="together"]'
    ).checked = true;

    summaryCount.textContent = "";
    summaryLevel.textContent = "";
    summaryExample.textContent = "";

    showStep(0);
});

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

studyReadyButton.addEventListener("click", () => {
    if (!isStudyConfigured) {
        document.querySelector("#event-practice")
            .scrollIntoView({ behavior: "smooth" });

        agreeCheck.focus();
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

    learningFlow.hidden = true;
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

    learningFlow.hidden = false;

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
    studyContent.hidden = true;
    studyComplete.hidden = false;

    document.querySelector("#study-complete-message").textContent =
        `${selectedWords.length}개의 영어 단어 학습을 완료했습니다.`;

    studyComplete.scrollIntoView({ behavior: "smooth" });
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