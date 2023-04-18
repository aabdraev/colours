const nodes = document.querySelectorAll(".node")
const popup = document.querySelector(".popup")
const visible = document.querySelector(".visible")

document.addEventListener("keydown", (e) => {
    e.preventDefault()
    if (e.code.toLowerCase() === "space" || e.code.toLowerCase() === "f5") {
        setRandomColours()
    }
})

document.addEventListener("click", (e) => {
    const type = e.target.dataset.type

    if (type === "lock") {
        const btn = e.target.tagName.toLowerCase() === "i"
            ? e.target
            : e.target.children[0]

        btn.classList.toggle("fa-lock-open")
        btn.classList.toggle("fa-lock")
    } else if (type === "copy") {
        copyToClipBoard(e.target.textContent)

        let x = e.clientX - 50
        let y = e.clientY

        popup.style.left = x + "px"
        popup.style.top = y + "px"

        handleOpen()
        setTimeout(() => {
            handleClose()
        }, 1500)
    }
})

const generateRandomColour = () => {
    const hexCodes = "0123456789abcdef"
    let colour = ""

    for (let i = 0; i < 6; i++) {
        colour += hexCodes[Math.floor(Math.random() * hexCodes.length)]
    }

    return "#" + colour
}

const setRandomColours = (isInitial) => {
    const colours = isInitial
        ? getColoursFromHash()
        : []

    nodes.forEach((node, index) => {
        const isLocked = node.querySelector("i").classList.contains("fa-lock")
        const text = node.querySelector("h2")
        const button = node.querySelector("button")

        if (isLocked) {
            colours.push(text.textContent)
            return
        }

        const colour = isInitial
            ? colours[index]
                ? colours[index]
                : generateRandomColour()
            : generateRandomColour()

        if (!isInitial) {
            colours.push(colour)
        }

        text.textContent = colour
        node.style.background = colour

        setContentColour(text, colour)
        setContentColour(button, colour)

        updateColoursHash(colours)
    })
}

const setContentColour = (text, colour) => {
    const luminance = chroma(colour).luminance()

    text.style.color = luminance >= 0.5
        ? "black"
        : "white"
}

const copyToClipBoard = (text) => {
    return navigator.clipboard.writeText(text)
}

const updateColoursHash = (colours = []) => {
    document.location.hash = colours.map(item => item.substring(1)).join("-")
}

const getColoursFromHash = () => {
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1)
            .split("-")
            .map(item => "#" + item)
    }
    return []
}

const handleOpen = () => {
    popup.style.display = "block"

}

const handleClose = () => {
    popup.style.display = "none"
}

setRandomColours(true)