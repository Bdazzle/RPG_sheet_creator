

export const radioFill = (max: number[], curr: number, name: string, CSSClass: string) => {
    if (name && name !== '0') {
        name = name.split(' ').join('')
        max.forEach(num => {
            if (num <= curr) {
                document.querySelectorAll(`.${name + num}inner`).forEach(element => {
                    element.classList.remove(`unselected-${CSSClass}`)
                });
            } else if (num > curr) {
                document.querySelectorAll(`.${name + num}inner`).forEach(element => {
                    element.classList.add(`unselected-${CSSClass}`)
                });
            }
        })
    }
}