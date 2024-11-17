const resultEl = document.getElementById('result')
const clipBoard = document.getElementById('clipboard')
const copyPass = document.getElementById('copy')
const passCopied = document.getElementById('copied')
const slider = document.getElementById('slider')
const value = document.getElementById('value')
const includeUpper = document.getElementById('uppercase')
const includeLower = document.getElementById('lowercase')
const includeNumbers = document.getElementById('numbers')
const includeSymbols = document.getElementById('symbols')
const passState = document.getElementById('strength')
const passIndex = document.getElementById('index')
const getOption = document.querySelectorAll('.setting input')
const errorEl = document.getElementById('error')
const generatePass = document.getElementById('generate-btn')

document.addEventListener("DOMContentLoaded", () => {
    updateSlider()
    clipBoard.classList.add('disabled')
    value.innerHTML = slider.value
    
});

const strengthMap = {
    1:{label:"Too weak", className: "too-weak"},
    2:{label:"Weak", className: "weak"},
    3:{label:"Medium", className : "medium"},
    4:{label:"strong", className : "strong"}
}
const randomFunc = {
    upper: getRandomUpper,
    lower: getRandomLower,
    number: getRandomNumber,
    symbol: getRandomSymbol
}

let includeOptions = 0



slider.addEventListener('input', updateValue)
includeUpper.addEventListener('change', includeUpperCaseLatterInput)
includeLower.addEventListener('change',includeLowerCaseLatterInput)
includeNumbers.addEventListener('change', includeNumbersInput)
includeSymbols.addEventListener('change', includeSymbolsInput)
getOption.forEach((option) =>{
    option.addEventListener('change', getIndex)
})
generatePass.addEventListener('click', () =>{
    const length = +slider.value
    const hasUpper = includeUpper.checked
    const hasLower = includeLower.checked
    const hasNumber = includeNumbers.checked
    const hasSymbols = includeSymbols.checked


    resultEl.innerText = generatePassword(hasUpper,hasLower,hasNumber,hasSymbols,length)
    
})
clipBoard.addEventListener('click', () => {
	const textarea = document.createElement('textarea');
	const password = resultEl.innerText;
	
	if(!password) { return; }
    copyPass.style.display = "none"
    passCopied.style.display = "flex"
    setTimeout(()=>{
        passCopied.style.display = "none"
        copyPass.style.display = "flex"
    },2000)
	
	textarea.value = password;
	document.body.appendChild(textarea);
	navigator.clipboard.writeText(textarea.value)
	textarea.remove();

	
});


function updateValue() {
    value.innerText = parseInt(slider.value)
    updateSlider()
}
function updateSlider() {
    let sliderValue = (slider.value / slider.max) * 100
    slider.style.background = `linear-gradient(to right, #a4ffaf ${sliderValue - 1}%,#18171f ${sliderValue - 1}%)`
}

function generatePassword(lower, upper, number, symbol, length) {
	let generatedPassword = '';
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
	
    let message = []
	if(typesCount === 0 ) {

        message.push('At least one option must be selected')
        errorEl.innerText = message
        clipBoard.classList.add('disabled')
		return ""
	}else if(length < 8){
        message.push('Password must be at least 8 characters')
        errorEl.innerText = message
        clipBoard.classList.add('disabled')
        return ""
    }
    else{
        clipBoard.classList.remove('disabled')
        resultEl.style.opacity = "100%"
        errorEl.innerText = ''
    }
	
	for(let i=0; i<length; i+=typesCount) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
            
            
		});
	}
	
	const finalPassword = generatedPassword.slice(0, length);
    
	
	return finalPassword;
}


function getRandomUpper(){
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}
function getRandomLower(){
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}
function getRandomNumber(){
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}
function getRandomSymbol(){
    const symbols = '!@#$%^&*(){}[]=<>/,.'
    return symbols[Math.floor(Math.random() * symbols.length)]
}




function includeUpperCaseLatterInput(e){
    if(e.target.checked){
        includeOptions += 1
        passState.textContent = strengthMap[includeOptions].label
    }else{
        includeOptions -=1
        includeOptions > 0 ? (passState.textContent = strengthMap[includeOptions].label):(passState.textContent = "")
    }
}
function includeLowerCaseLatterInput(e){
    if(e.target.checked){
        includeOptions += 1
        passState.textContent = strengthMap[includeOptions].label
    }else{
        includeOptions -=1
        includeOptions > 0 ? (passState.textContent = strengthMap[includeOptions].label):(passState.textContent = "")
    }
}
function includeNumbersInput(e){
    if(e.target.checked){
        includeOptions += 1
        passState.textContent = strengthMap[includeOptions].label
    }else{
        includeOptions -= 1
        includeOptions > 0 ? (passState.textContent = strengthMap[includeOptions].label):(passState.textContent = "")
    }
}
function includeSymbolsInput(e){
    if(e.target.checked){
        includeOptions += 1
        passState.textContent = strengthMap[includeOptions].label
    }else{
        includeOptions -= 1
        includeOptions > 0 ? (passState.textContent = strengthMap[includeOptions].label):(passState.textContent = "")
    }
}
function getIndex(e){
    if(e.target.checked){
        for(let i=0; i<includeOptions; i++){
            passIndex.children[i].classList = [
                strengthMap[includeOptions].className
            ]
        }
    }else{
        passIndex.children[includeOptions].classList = []
        for(let i=0; i<includeOptions; i++){
            passIndex.children[i].classList = [
                strengthMap[includeOptions].className
            ]
        }
    }
}

