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
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick(event) {
    console.log("click:", event.currentTarget.id);
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput(event) {
    console.log("input:", nicknameInput.value.length);
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    console.log("change:", agreeCheck.checked);
}

agreeCheck.addEventListener("change", handleAgreeChange);