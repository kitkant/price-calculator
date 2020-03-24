const DAY_STRING = ['день','дня','дней']
const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates:  [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [ 500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadLineDay: [[2, 7], [3, 10], [7, 14]],
    deadLinePersont: [20, 17, 15]
};
const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    adapt = document.getElementById('adapt'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    desktopTemp = document.getElementById('desktopTemplates'),
    typeSite = document.querySelector('.type-site'),
    editable = document.getElementById('editable'),
    maxDeadLine = document.querySelector('.max-deadline'),
    rangeDeadLine = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    adaptValue = document.querySelector('.adapt_value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    switcherindicator = document.querySelector('.switcher__indicator'),
    calcDescription = document.querySelector('.calc-description'),
    metrikaYandex = document.getElementById('metrikaYandex'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset')


function dopOptionsString() {
    let str = '';
    if ( metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked) {
        str += 'Подключим';

        if (metrikaYandex.checked) {
            str += ' Яндекс Метрику';

            if (analyticsGoogle.checked && sendOrder.checked) {
                str += ', Гугл Аналитику и отправку заявок на почту.'
                return
            }
            if (analyticsGoogle.checked || sendOrder.checked) {
                str += ' и'
            }
            if (analyticsGoogle.checked) {
                str += ' Гугл Аналитику';

                if (sendOrder.checked) {
                    str += ' и'
                }

                if (sendOrder.checked) {
                    str += ' отправку заявок на почту'
                }
                str += '.'


            }
        }
    }

    return str;
}
function declOfNum(n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}
function showElement(elem) {
    elem.style.display = 'block'
}

function hideElement(elem) {
    elem.style.display = 'none'
}
function  renderTextContent(total, site, maxDay, minDay) {
    typeSite.textContent = site;
    totalPriceSum.textContent = total;
    maxDeadLine.textContent = declOfNum(maxDay,DAY_STRING);
    rangeDeadLine.min = minDay;
    rangeDeadLine.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadLine.value, DAY_STRING)

    calcDescription.textContent = `
    Сделаем ${site} ${adapt.checked ? ', адаптированный под мобильные устройства и планшеты': ""}.
    ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.': '' }
    ${dopOptionsString()}    
    `
}
function priceCalculation(elem = {} ) {
    let result = 0,
        index = 0,
        option= [],
        site = '',
        maxDeadLineDay = DATA.deadLineDay[index][1],
        minDeadLineDay = DATA.deadLineDay[index][0],
        overPercent = 0;


    if( elem.name === 'whichSite'){
        for(const item of formCalculate.elements){
            if(item.type === 'checkbox'){
                item.checked = false
            }
        }
        hideElement(fastRange)
    }
    for(const item of formCalculate.elements){
        if( item.name === 'whichSite' && item.checked){
            minDeadLineDay = DATA.deadLineDay[index][0]
            maxDeadLineDay = DATA.deadLineDay[index][1]
            index = DATA.whichSite.indexOf(item.value)
            site = item.dataset.site
        } else if(item.classList.contains('calc-handler') && item.checked){
                option.push(item.value)
        }else if(item.classList.contains('want-faster') && item.checked){
            const overDay = maxDeadLineDay - rangeDeadLine.value;
            overPercent = overDay * (DATA.deadLinePersont[index]/100)

        }

    }
    result += DATA.price[index];
    option.forEach(function (key) {
        if(typeof DATA[key] === "number" ){
            if(DATA[key] === DATA.sendOrder){
                result += DATA[key]

            } else {
                result += DATA.price[index] * DATA[key] / 100

            }
        } else {
            if (key === 'desktopTemplates'){
                result += DATA.price[index] * DATA.desktopTemplates[index] / 100
            } else {
                result += DATA[key][index]
                console.log(result, key, index)
            }
        }
    })

    if( !adapt.checked){
        document.getElementById('mobileTemplates').disabled = true
        document.getElementById('mobileTemplates').checked = false
        adaptValue.textContent = 'Нет'
    } else if(adapt.checked){
        document.getElementById('mobileTemplates').disabled = false
        adaptValue.textContent = 'Да'
    }
    if( desktopTemp.checked)
    {
        desktopTemplatesValue.textContent = 'Да'
    } else{
        desktopTemplatesValue.textContent = 'Нет'
    }
    editable.checked ? editableValue.textContent = 'Да' : editableValue.textContent = 'Нет'
    mobileTemplates.checked ? mobileTemplatesValue.textContent = "Да" : mobileTemplatesValue.textContent = "Нет"

    result += result * overPercent
    renderTextContent(result, site, maxDeadLineDay, minDeadLineDay)


}
function handlerCallBackForm(event) {
    const target = event.target;
    console.log(event);

    if ( target.classList.contains('want-faster')){
        target.checked ? showElement(fastRange) : hideElement(fastRange)
        priceCalculation(target)
    }

    if ( target.classList.contains('calc-handler')){
        priceCalculation(target)
    }

}
function moveBackTotal() {
    if (document.documentElement.getBoundingClientRect().bottom >= document.documentElement.clientHeight){
        totalPrice.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPrice);
        window.addEventListener('scroll', moveTotal)
        window.removeEventListener('scroll', moveBackTotal)
    }
}
function moveTotal(){
    if (document.documentElement.getBoundingClientRect().bottom <= document.documentElement.clientHeight){
        totalPrice.classList.add('totalPriceBottom');
        endButton.before(totalPrice);
        window.removeEventListener('scroll', moveTotal)
        window.addEventListener('scroll', moveBackTotal)
    }
}
startButton.addEventListener('click', function () {
    showElement(mainForm);
    hideElement(firstScreen);
    window.addEventListener('scroll', moveTotal)
});

endButton.addEventListener('click', function () {
    for (const elem of formCalculate.elements) {
        if (elem.tagName === 'FIELDSET'){
            hideElement(elem)
        }
    }
    cardHead.textContent = 'Заявка на разработку сайта';
    hideElement(totalPrice)
    showElement(total)
});
formCalculate.addEventListener('change', handlerCallBackForm);
priceCalculation()



