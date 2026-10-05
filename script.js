const serviceName = "WordMate";
let isSubcribed = false;
let submitCount = 0;

function makeSubcribeMessage(email, subcribed) {
    if (subcribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }
    
    return "이메일을 입력한 뒤 신청해주세요.";
}

console.log(typeof serviceName);
console.log(typeof isSubcribed);
console.log(typeof submitCount);

console.log(makeSubcribeMessage("", false));
console.log(makeSubcribeMessage("learner@example.com", true));