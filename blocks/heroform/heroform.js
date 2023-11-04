const stringToId = str => str.replace(/\W/g, '_').toLowerCase()
const isEmail = /^[^\s@]+@(?<provider>[^\s@]+)\.[^\s@]+$/

const ctaOnClick = event => {
    const nameNode = document.getElementById('name')
    const emailNode = document.getElementById('email')
    const tosNode = document.getElementById('i_agree_to_the_terms_and_conditions')
    
    const name = nameNode.value.trim()
    const email = emailNode.value.trim()
    const tos = tosNode.checked

    clearErrors()

    if (!name) {
        appendError(nameNode, "Name is required")
    }
    
    if (!email || !email.match(isEmail)) {
        appendError(emailNode, "A valid email is required")
    }

    if (!tos) {
        appendError(tosNode.parentElement, "You must agree to the terms and conditions")
    }

    if (!document.querySelector('.heroform .validation-error')) {
        const { provider } = isEmail.exec(email).groups
        openModal(name, provider)
    }
}

const clearErrors = () => {
    document.querySelectorAll('.heroform .validation-error').forEach(error => {
        error.parentElement.removeChild(error)
    })
}

const appendError = (previousSibling, errorMessage) => {
    const error = document.createElement('p')
    error.classList.add('validation-error')
    error.innerText = errorMessage
    previousSibling.insertAdjacentElement('afterend', error)
}

const openModal = (userName, emailProvider) => {
    const modal = document.getElementById('modal_form-complete_block')
    const lightbox = document.getElementById('modal_form-complete_lightbox')
    const name = document.getElementById('user-name')
    const provider = document.getElementById('email-provider')
    const open = lightbox.dataset.open !== "true"
    
    name.innerText = userName
    provider.innerText = emailProvider
    lightbox.dataset.open = open
    modal.dataset.open = open
    document.body.style.overflow = open ? 'hidden' : 'unset'
}

export default function decorate(block) {
    
    const [copy, form] = block.firstElementChild.children
    copy.classList.add('copy')
    form.classList.add('form')

    // Transform form tables into inputs
    form.querySelectorAll('table').forEach(table => {
        const [name, placeholder] = table.querySelectorAll('td')
        const container = document.createElement('div')
        const label = document.createElement('label')
        const input = document.createElement('input')
        const id = stringToId(name.innerText)

        label.innerText = name.innerText 
        label.setAttribute('for', id)

        input.setAttribute('id', id)
        input.setAttribute('type', 'text')
        input.setAttribute('placeholder', placeholder.innerText)

        container.appendChild(label)
        container.appendChild(input)
        form.replaceChild(container, table)    
    })

    // Transform form lists into check boxes
    form.querySelectorAll('ul').forEach(list => {
        const item = list.firstElementChild
        const container = document.createElement('div')
        const input = document.createElement('input')
        const label = document.createElement('label')
        const id = stringToId(item.innerText)

        input.setAttribute('type', 'checkbox')
        input.setAttribute('id', id)

        label.setAttribute('for', id)
        label.innerHTML = item.innerHTML

        container.classList.add('checkbox')
        container.appendChild(input)
        container.appendChild(label)

        const links = label.querySelectorAll('a')
        links.forEach(link => {
            link.setAttribute('target', '_blank')
            link.addEventListener('click', event => event.stopPropagation())
        })

        form.replaceChild(container, list)
    })

    // Transform a single form sixth-level heading into the CTA
    const h6 = form.querySelector('h6')
    if (h6) {
        const button = document.createElement('button')
        
        button.classList.add('cta')
        button.innerText = h6.innerText 
        button.addEventListener('click', ctaOnClick)

        form.replaceChild(button, h6)
    }

    // Add a wrapper around the form contents to support the layout
    const formContentWrapper = document.createElement('div')
    formContentWrapper.append(...form.childNodes)
    form.replaceChildren()
    form.appendChild(formContentWrapper)
}