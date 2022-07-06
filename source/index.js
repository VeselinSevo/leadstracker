const textInput = document.querySelector('#input-el')
const saveButton = document.querySelector('#input-btn')
const deleteAllButton = document.querySelector('#delete-all-btn')
const saveTabButton = document.querySelector('#savetab-btn')
let savedText = document.querySelector('#saved-text')
let leadsDiv = document.querySelector('#leads-div')
let leads = []
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("leads"))

if(leadsFromLocalStorage) {
    leads = leadsFromLocalStorage
    displayLeads()
}

saveButton.addEventListener('click', this.saveLead)

deleteAllButton.addEventListener('click', this.deleteAll)

saveTabButton.addEventListener('click', function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        leads.push(tabs[0].url)
        localStorage.setItem("leads", JSON.stringify(leads))
        displayLeads()
    })
})


function saveLead() {
    let lead = textInput.value
    if(lead != "") {
    leads.push(lead)
    }
    localStorage.setItem("leads", JSON.stringify(leads))
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
        const btnDelete = document.createElement('button')
        const btnEdit = document.createElement('button')

        // adding features to elLead
        elLead.textContent = lead
        elLead.addEventListener('click', copyLead.bind(null, elLead))
        
        // adding features to btnDelete 
        btnDelete.innerText = "Delete"
        btnDelete.addEventListener('click', deleteLead.bind(null, idx, elDiv))
    
        // adding features to btnEdit
        btnEdit.innerText = "Edit"
        btnEdit.addEventListener('click', deleteLead.bind(null, idx, elDiv))

        // appending parent div with new elements
        elDiv.appendChild(elLead)
        elDiv.appendChild(btnDelete)
        elDiv.appendChild(btnEdit)

        // reseting input value to default
        textInput.value = ''

        // appending parent div with div
        leadsDiv.appendChild(elDiv)
        })

    function deleteLead(idx, elDiv) {
        leadsDiv.removeChild(elDiv)
        leads.splice(idx, 1)
        localStorage.setItem("leads", JSON.stringify(leads))
        displayLeads()
        const html = document.getElementsByTagName("html")[0]
        html.style.height = "1px"
        console.log(html.style.height)
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