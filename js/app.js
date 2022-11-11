const progress = document.querySelector('#progress')


/**
 * 
 * @param {Element} element 
 */
const none = (element) => {
    element.style.display = 'none'
}

/**
 * 
 * @param {Element} element 
 */
const block = (element) => {
    element.style.display = 'block'
}

/**
 * 
 * @param {Element} element 
 */
const hidden = (element) => {
    element.visibility = 'hidden'
}


/**
 * 
 * @param {Element} element 
 */
const visible = (element) => {
    element.visibility = 'visible'
}

// on met progres en none
none(progress)



