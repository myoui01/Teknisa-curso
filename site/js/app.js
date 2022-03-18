/* Olá monitores :)

A quantidade exagerada de comentários é apenas pra facilitar meu entendimento do código, já que não tenho muita prática com Javascript. ^^

/*conta o número de cards visíveis e imprime o resultado*/

function preRender(){
    let countVisibleCards = getCountVisibleCards();
    updateResults(countVisibleCards);
}

function getCountVisibleCards(){
    return Array.from(document.getElementsByClassName("card")).filter((card) => !card.getElementsByClassName.display || card.getElementsByClassName.display !=="none").length;
}

function updateResults(count) {
    document.getElementById("countResult").textContent = count;
}

/*define um intervalo de n mil milisegundos após o usuário parar de digitar o input, limpa o intervalo e faz a validação da existência do container e seus elementos*/

function filter() {
    let {search, operation, languages} = getFilterProperties();
    let interval = setInterval((_) => {
        let[containerEl] = document.getElementsByClassName("container");
        let changedText = search !== getSearchValue();
        if(!changedText) clearInterval(interval);
        if(containerEl && containerEl.children && !changedText) {
            let visibleCards = updateVisibleCards(containerEl,search,operation, languages);
            updateResults(visibleCards);
        }
    }, 10000);
}

function getFilterProperties() {
    let search = getSearchValue();
    let[radio] = getSelectedRadio();
    let operation = radio.id == "1" ? "AND" : "OR";
    /*
    let operation
    if(radio.id == "1"){
        operation = 'AND';
    }else{
        operation = 'OR'
    } */
    let languages = Array.from(getSelectedLanguages()).map((lang) => lang.name);
    return {
        search,
        operation,
        languages,
    }
}

/*retorna o valor inserido no input*/

function getSearchValue(){
    let inputSearchEl = document.getElementById("nameSearch");
    return inputSearchEl.value;
}

/*retorna os inputs declarados como radio*/

function getSelectedRadio(){
    return Array.from(document.querySelectorAll('header input[type="radio"]:checked'));
}

/*retorna os inputs declarados como checkbox*/

function getSelectedLanguages(){
    return Array.from(document.querySelectorAll('header input[type="checkbox"]:checked'));
}

/*utiliza-se o "for" para realizar uma iteração (loop) entre os componentes presentes no card, acessando o valor dentro dos elementos, para verificar se condiz com a busca*/

function updateVisibleCards(containerEl, search, operation, selectedLanguages){
    let visibleCards = 0;
    Array.from(containerEl.children).forEach((cardEl) => {
        let [titleEl] = cardEl.getElementsByClassName("card-title");
        let cardLanguages = Array.from(cardEl.getElementsByClassName("iconLanguage")).map((image) => image.name);

        
        /*verifica a disposição das linguagens presentes nos cards
        de acordo com a opção selecionada "AND" ou "OR"
        */


        if(titleEl) {
            let isMatchName = isMatchByName(titleEl.textContent, search);
            if(!isMatchName && operation == "AND"){
                hideCard(cardEl);
            } else if(isMatchName && operation == "OR") {
                showCard(cardEl);
                visibleCards++;
            } else if(isMatchName && operation == "AND"){
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage) {
                    showCard(cardEl);
                    visibleCards++;
                } else{
                    hideCard(cardEl);
                }
            } else if (!isMatchName && operation == "OR") {
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage){
                    showCard(cardEl);
                    visibleCards++;
                } else {
                    hideCard(cardEl);
                }
            }
        }
    });
    return visibleCards;
}

/*verifica se o texto digitado no search-box está em uso no card ao manter todos os caracteres em lower case, para facilitar a procura*/

function isMatchByName(textCard, textInput) {
    return textCard.toLowerCase().includes(textInput.toLowerCase());
}

/*verifica se as linguagens do checkbox estão presentes no card*/
/*cardLanguages.some = interrompe a execução ao encontrar o que procura*/

function isMatchByLanguage(cardLanguages, selectedLanguages){
    return cardLanguages.some(cardLang => selectedLanguages.includes(cardLang));
}


/*altera a visibilidade do card, após informações filtradas utilizando o CSS*/

function hideCard(card) {
    card.style.display = "none";
};

function showCard(card) {
    card.style.display = "flex";
}

/*contante em html pra mudar o template pro modal*/

const modalTemplate = `
      <div class="modal">
        <button class="fechar">x</button>
        <div class="profilePictureModal">
            <img class="image" name ="image-profile" src="__DEV_IMAGE__" alt="desenvolvedor" />
        </div>
        <div class="profileDescriptionModal">
            <div style="display: flex; flex-direction: column">
                <h2 class="card-title" name="devname">__DEV_NAME__</h2>
                <span name="age">__DEV_AGE__</span>
                <span name="description">__DEV_DESCRIPTION__</span>
                <span name="description">__DEV_DESCRIPTION_ABILITY__</span>
                <h3>Contato</h3>
                <span name="mail">Email: <a href="#">__DEV_MAIL__</a></span>
                <span name="git">Github: <a href="#">__DEV_GIT__</a></span>
                <span name="phone">Telefone:__DEV_PHONE__</span>
            </div>
            <div class="languages">
            <h3>Linguagens</h3>
                __DEV_LANGUAGES__
            </div>
        </div>
      </div>
`;

/* vai pegar o template html do modal e substituir as informações */

Array.from(document.querySelectorAll('.card')).forEach(card => {
    card.addEventListener('click', () => iniciaModal('modal-profile', event.currentTarget.id));
});

function iniciaModal(modalId, cardId) {
    fillModal(getUserInfo(cardId));
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add("mostrar");
        modal.addEventListener("click", (e) => {
            if(e.target.id == modalId || e.target.className == "fechar"){
                modal.classList.remove("mostrar");
            }
        })
    }
}

/* pega informações do usuário através da função getTextContentByName */

function getUserInfo(id){
    let cardUser = document.getElementById(id);
    let userData = {};
    if(cardUser) {
        userData = ['age', 'mail', 'phone', 'github', 'username', 'description', 'descriptionAbility'].reduce((acc,name) => {
            acc[name] = getTextContentByName(cardUser,name);
            return acc;
            return userData;
        }, {});
    }
}

/* retorna texto contido no elemento, cujo nome está sendo passado como paramêtro */

function getTextContentByName(el, name, defaultValue = ""){
    let element = el.querySelector(`*[name=${name}]`);
    return element ? element.textContent : defaultValue; 

}

/* implementa mais um reduce para retornar a experiência do usuário contida no card 
e retorna a imagem vinculada ao desenvolvedor em questão */

userData.languages =
Array.from(cardUser.querySelectorAll(".languages > iconLanguage")).reduce(function(acc,el) {
    let nameLanguage = el.name;
    acc[nameLanguage] = `${el.getAttribute('experience')}`;
    return acc;
}, {});

/* cria um objeto que armazena todas as linguagens exibidas */

function getDescriptionLanguage() {
    let description = {
        js: "Javascript",
        php: "Php",
        java: "Java",
        python: "Python",
    };
    return description;
}

/* recebe os dados armazenados como paramêtro e função para pegar a descrição das 
imagens dos desenvolvedores */

function fillModal(userInfo){
    let descriptionLanguages = getDescriptionLanguage();

    /* utilizando o template literal, usa-se o html e substitui com as informações necessárias 
    acerca das linguagens*/

    languages = Object.keys(userInfo.languages).map( langCode => {
        return `
            <div class="languageDescription">
                <div class="language-name">
                    <img name="${langCode}" class="iconLanguage" src="images/${langCode}.png" alt="language" />
                    <span>${descriptionLanguages[langCode]}</span>
                </div>
                <div class="modal-experience">
                    <span>${userInfo.languages[langCode]} Anos</span>
                </div>
            </div>
        `;
    }).join('\n');

    modal = modalTemplate;
    modal = modal.replaceAll('_DEV_IMAGE_', userInfo.picture);
    modal = modal.replaceAll('_DEV_NAME_', userInfo.username);
    modal = modal.replaceAll('_DEV_AGE_', userInfo.age);
    modal = modal.replaceAll('_DEV_DESCRIPTION_', userInfo.description);
    modal = modal.replaceAll('_DEV_DESCRIPTION_ABILITY_', userInfo.descriptionAbility);
    modal = modal.replaceAll('_DEV_MAIL_', userInfo.mail);
    modal = modal.replaceAll('_DEV_PHONE_', userInfo.phone);
    modal = modal.replaceAll('_DEV_GIT_', userInfo.github);
    modal = modal.replaceAll('_DEV_LANGUAGES_', languages);
    document.querySelector('#modal-profile').innerHTML = modal;
};