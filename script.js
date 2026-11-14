const sentenceEl = document.querySelector("#sentence");
const input = document.querySelector("#input");
const wpmEl = document.querySelector("#wpm");
const accuracyEl = document.querySelector("#accuracy");
const timeEl = document.querySelector("#time");
// const resultEl = document.querySelector("#result");
const restartBtn = document.querySelector("#restart");

const sentences = [
    // Passage 1: Indian Administration
    `The administration of a country requires proper planning, effective coordination and responsible decision making. Government departments perform various functions to maintain law and order, provide public services and implement welfare programmes. Officials must ensure that rules are followed and public resources are used efficiently. Transparency and accountability are essential for building public confidence in administrative institutions.`,

    // Passage 2: Education and Development
    `Education plays an important role in the social and economic development of a nation. It enables individuals to acquire knowledge, develop practical skills and understand their responsibilities towards society. Educational institutions should provide equal opportunities to all students and encourage creativity, discipline and independent thinking. A well educated population contributes significantly to national progress and prosperity.`,

    // Passage 3: Environmental Protection
    `Environmental protection has become a major concern throughout the world. Increasing pollution, deforestation and the excessive use of natural resources have created serious challenges. Governments, industries and citizens must work together to reduce waste and conserve energy. Planting trees, protecting wildlife and adopting renewable sources of energy can help maintain ecological balance and secure a healthier future.`,

    // Passage 4: Digital India
    `Digital technology has transformed the way people communicate, learn and conduct business. Online services have made it easier to access information, complete transactions and submit applications. Digital platforms also help government departments maintain records and deliver services more efficiently. However, protecting personal information and improving digital literacy are necessary to ensure that technological progress benefits every section of society.`,

    // Passage 5: Economic Growth
    `Economic growth depends on several factors, including investment, productivity, infrastructure and the availability of skilled workers. Small businesses generate employment and contribute to local development, while large industries support production and international trade. A stable economic environment encourages investment and innovation. Responsible financial management and effective policies can help create sustainable opportunities for future generations.`,

    // Passage 6: Science and Technology
    `Scientific research has contributed greatly to improvements in healthcare, agriculture, transportation and communication. Modern technology enables researchers to analyse information, solve complex problems and develop innovative solutions. Although technological advancement offers numerous benefits, it also requires careful consideration of ethical issues and public safety. Scientific knowledge should be used responsibly to improve the quality of human life.`,

    // Passage 7: Public Health
    `Public health is essential for the overall well being of a population. Clean drinking water, proper sanitation, balanced nutrition and regular physical activity help prevent many diseases. Health awareness programmes encourage people to adopt safer habits and seek medical assistance when necessary. Governments must strengthen healthcare facilities, train qualified personnel and ensure that essential medical services remain accessible to all citizens.`,

    // Passage 8: Banking and Financial Awareness
    `The banking system plays a significant role in the economic development of a country. Banks accept deposits, provide loans and facilitate payments between individuals and organisations. Digital banking has made financial transactions faster and more convenient. Customers should protect their passwords, avoid sharing confidential information and verify the authenticity of messages before responding to financial requests or clicking unfamiliar links.`,

    // Passage 9: Discipline and Time Management
    `Discipline and time management are important qualities for achieving success in competitive examinations. Candidates should prepare a practical study schedule and devote sufficient time to every subject. Regular revision helps strengthen understanding, while mock tests provide an opportunity to evaluate performance. Identifying weaknesses and correcting repeated mistakes can improve confidence, accuracy and efficiency during the actual examination.`,

    // Passage 10: National Development
    `The progress of a nation depends on the collective efforts of its citizens and institutions. Agriculture, industry, education and scientific research all contribute to economic and social development. Public participation strengthens democratic processes and encourages responsible governance. By promoting equality, protecting natural resources and creating employment opportunities, a country can improve living standards and build a more secure and prosperous future.`
];

let currentText = "";
let startTime = null;
let timerId = null;
let finished = false;


// Pick random sentence
function getRandomSentence(){
    const index = Math.floor(Math.random() * sentences.length);
    return sentences[index];
}


// Show sentence as seperate characters
function loadSentence(){
    sentenceEl.innerHTML = "";

    currentText = getRandomSentence();

    currentText.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        sentenceEl.appendChild(span);
    })

    sentenceEl.querySelectorAll("span")[0].classList.add("current");
}


// Calculates stats
function updateStats(){
    if (startTime === null) return;

    const typed = input.value;
    const seconds = (Date.now() - startTime) / 1000;
    const minutes = seconds / 60;

    let correctCount = 0;
    for (let i = 0; i < typed.length; i++){
        if(typed[i] === currentText[i]){
            correctCount++;
        }
    }

    let wpm = 0;
    if(minutes > 0){
        wpm = (typed.length / 5) / minutes;
    }

    let accuracy = 100;
    if(typed.length > 0){
        accuracy = (correctCount / typed.length) * 100;
    }

    timeEl.textContent = Math.floor(seconds);
    wpmEl.textContent = Math.round(wpm);
    accuracyEl.textContent = Math.round(accuracy);
}


// Handle typing
input.addEventListener("input", () => {
    if(finished) return;

    if(startTime === null){
        startTime = Date.now();
        timerId = setInterval(updateStats, 1000);
    }

    const typed = input.value;
    const spans = sentenceEl.querySelectorAll("span");

    spans.forEach((span, index) => {
        const typedChar = typed[index];

        span.classList.remove("correct", "incorrect", "current");

        if (typedChar !== undefined) {
            span.classList.add(typedChar === currentText[index] ? "correct" : "incorrect");
        }
    });

    if(typed.length < spans.length){
        spans[typed.length].classList.add("current");
    }

    updateStats();

    if (typed.length >= currentText.length){
        finished = true;
        clearInterval(timerId);
        input.disabled = true;
        updateStats();

        let resultDisplay = "You Typed " + wpmEl.textContent + " Word Per Minute With " + accuracyEl.textContent + "% Accuracy";
        
        // alert(resultDisplay)
        
        Swal.fire({
            title: resultDisplay,
            icon: "success",
            width: "300px",
            padding: "16px",
            color: "#334155",
            background: "#f8fafc",
            confirmButtonText: "OK",
            confirmButtonColor: "#0d9488",
            customClass: {
                title: "small-alert-title",
                popup: "small-alert-popup",
                confirmButton: "small-alert-button"
            }
        });
    }
});


// Restart Typing
function restart(){
    clearInterval(timerId);
    startTime = null;
    timerId = null;
    finished = false;

    input.value = "";
    input.disabled = false;
    input.focus();

    wpmEl.textContent = 0;
    accuracyEl.textContent = 100;
    timeEl.textContent = 0;
    // resultEl.textContent = "";

    loadSentence();
}


restartBtn.addEventListener("click", restart);


// Start typing
loadSentence();