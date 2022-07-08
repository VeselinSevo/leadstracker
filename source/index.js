const textInput = document.querySelector('#input-el')
const saveButton = document.querySelector('#input-btn')
const deleteAllButton = document.querySelector('#delete-all-btn')
const saveTabButton = document.querySelector('#savetab-btn')
let savedText = document.querySelector('#saved-text')
let leadsDiv = document.querySelector('#leads-div')
let leads = []
const LeadStorage = {
    addLead(text) {
        leads.push(text)
        localStorage.setItem("leads", JSON.stringify(leads))
    },

    getLeads() {
        return JSON.parse(localStorage.getItem("leads"))
    },

    updateLead(idx, text) {
        leads[idx] = text
        localStorage.setItem("leads", JSON.stringify(leads))
    },

    deleteLead(idx) {
        leads.splice(idx, 1)
        localStorage.setItem("leads", JSON.stringify(leads))
    }
}
const leadsFromLocalStorage = LeadStorage.getLeads()

if(leadsFromLocalStorage) {
    leads = leadsFromLocalStorage
    displayLeads()
}

saveButton.addEventListener('click', this.saveLead)

deleteAllButton.addEventListener('click', this.deleteAll)

saveTabButton.addEventListener('click', function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        LeadStorage.addLead(tabs[0].url)
        displayLeads()
    })
})

function saveLead() {
    let lead = textInput.value
    if(lead != "") {
    LeadStorage.addLead(lead)
    }
    displayLeads()
}

function displayLeads() {
    if (leads.length > 0 && leads[0] != '') {
        leadsDiv.classList.add('list-border');
    } else {
        leadsDiv.classList.remove('list-border');
    }

    // resets div to empty
        leadsDiv.innerHTML = "";
        
        leads.forEach((lead, idx) => {
        // getting and storing elements
        const elDiv = document.createElement('div')
        const elLead = document.createElement('li')
        const elAhrefLead = document.createElement('a')
        const btnDelete = document.createElement('button')
        const btnEdit = document.createElement('button')

        // adding features to elLead
        elLead.addEventListener('click', copyLead.bind(null, elLead))
        
        // adding features to elAhrefLead and adding a href to elLead
        elAhrefLead.textContent = lead
        elAhrefLead.href = lead
        elLead.appendChild(elAhrefLead)

        // adding features to btnDelete 
        btnDelete.innerText = "Delete"
        btnDelete.addEventListener('click', deleteLead.bind(null, idx, elDiv))
    
        // adding features to btnEdit
        btnEdit.innerText = "Edit"
        btnEdit.addEventListener('click', () => {
            btnEdit.disabled = true;
            editLead.call(null, idx, elDiv, elLead);
        })

        // appending parent div with new elements
        elDiv.appendChild(elLead)
        elDiv.appendChild(btnDelete)
        elDiv.appendChild(btnEdit)

        // reseting input value to default
        textInput.value = ''

        // appending parent div with div
        leadsDiv.appendChild(elDiv)
        })

    function editLead(idx, elDiv, elLead) {
        const inputEl = convertTo('input', elDiv, elLead)
        inputEl.classList.add('lead-input')
        inputEl.addEventListener('keyup', (event) => {
            if(event.key !== 'Enter'){
                return
            }
            LeadStorage.updateLead(idx, inputEl.value)
            displayLeads()
        })
        inputEl.addEventListener('focusout', () => {
            LeadStorage.updateLead(idx, inputEl.value)
            displayLeads()
        })
    }

    /**
     * 
     * @param {'input' | 'li'} type Type to convert into
     * @param {HTMLElement} parentEl Parent of the targeted element
     * @param {HTMLLIElement} target Element to convert
     * @returns 
     */
    function convertTo(type, parentEl, target) {
        let newElement = null
        if(type === 'input') {
            const inputValue = target.textContent
            newElement = document.createElement('input')
            newElement.value = inputValue

            newElement.focus()
        } else {
            const inputValue = target.value;
            newElement = document.createElement('li');
            newElement.textContent = inputValue;
        }

        parentEl.removeChild(target);
        parentEl.prepend(newElement);

        return newElement;
    }

    function deleteLead(idx, elDiv) {
        leadsDiv.removeChild(elDiv)
        LeadStorage.deleteLead(idx)
        displayLeads()
        const html = document.getElementsByTagName("html")[0]
        html.style.height = "1px"
    }

    function copyLead(text) {
        var copyText = text
        navigator.clipboard.writeText(copyText.textContent)
        alert("Copied the text: " + copyText.textContent);
    }
}

function deleteAll() {
    if(leads == 0){
        window.confirm('Nothing here to delete')
    } else {
        if (!window.confirm('Are you sure you want to delete all items')) {
            return;
        }
        leads = []
        localStorage.clear()
        displayLeads()
    }
}