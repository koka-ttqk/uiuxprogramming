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
finishButton.addEventListener("click", () => showStep(3));
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