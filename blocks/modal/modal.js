const placeholderToSpan = (node, placeholder, id) => {
    const text = node.innerText
    const parts = text.split(placeholder)
    const span = document.createElement('span')

    span.setAttribute('id', id)
    node.innerText = ""
    node.appendChild(document.createTextNode(parts[0]))
    node.appendChild(span)
    node.appendChild(document.createTextNode(parts[1]))
}

export default function decorate(block) {
    const content = block.firstElementChild
    const modal = content.firstElementChild
    const lightbox = document.createElement('div')
    const closeBtn = document.createElement('button')
    const heading = modal.querySelector('h1')
    const copy = modal.querySelector('p:last-of-type')

    const modalId = block.className.replaceAll(' ', '_')
    const lightboxId = modalId.replace('_block', '_lightbox')

    const closeModal = () => {
        const name = document.getElementById('name')
        const email = document.getElementById('email')
        const tos = document.getElementById('i_agree_to_the_terms_and_conditions')

        lightbox.dataset.open = false 
        modal.dataset.open = false
        document.body.style.overflow = 'unset'

        name.value = ""
        email.value = "" 
        tos.checked = false
    }

    modal.setAttribute('id', modalId)
    modal.classList.add('modal-content')
    closeBtn.classList.add('close-modal')
    closeBtn.innerText = 'x'
    lightbox.setAttribute('id', lightboxId)
    lightbox.classList.add('lightbox')
    content.appendChild(lightbox)
    modal.appendChild(closeBtn)

    placeholderToSpan(heading, "__name__", "user-name")
    placeholderToSpan(copy, "__email-provider__", "email-provider")

    lightbox.addEventListener('click', closeModal)
    closeBtn.addEventListener('click', closeModal)
}