
/**
 * 
 * @param {string} tag 
 * @param {Object} attributes 
 * @returns {HTMLElement}
 */
function createElement(tag, attributes){
    const element = document.createElement(tag)
    for (const attribute in attributes) {
        const value = attributes[attribute]
        element.setAttribute(attribute, value)
    }

    return element
}

class edges {

    /**
     * @type {HTMLSelectElement}
     */
    #to = document.querySelector('#to')

    /**
     * @type {HTMLSelectElement}
     */
    #from = document.querySelector('select#from')

    #form = document.querySelector("#add")

    #id = 1

    #name = 'u'

    /**
     * 
     * @param {vis} nodes 
     * @param {vis} edges 
     */
    constructor(nodes, edges) {
        this.nodes = nodes
        this.edges = edges

        this.onsubmit = this.onsubmit.bind(this)
        this.#form.addEventListener("click", this.onsubmit)
    }

    /**
     * Permet d'ajouter les relations entre deux sommets
     * 
     * @param {string} to 
     * @param {string} from 
     */
    add(to, from) {
        this.edges.add({
            id: `${this.#name}${this.#id}`,
            from,
            to,
            arrows: 'to'
        })
        this.#id += 1
    }

    /**
     * 
     * Permet de créer des options pour facilité les choix
     * 
     * @param {string} id 
     * @param {string} label 
     * @returns 
     */
    create(id, label) {
        const create = document.createElement("option")
        create.value = id
        create.innerHTML = label

        return create
    }

    /**
     * Permet de générer les options en parcourant le tableau de nodes
     */
    generator() {
        const nodesArray = this.nodes.get()
        for (let index = 0; index < nodesArray.length; index++) {
            const element = nodesArray[index];
            this.#from.options.add(this.create(element.id, element.label))
            this.#to.options.add(this.create(element.id, element.label))
        }
    }

    /**
     * 
     * @param {Event} e 
     */
    onsubmit(e) {
        e.preventDefault()
        const from = this.#from.value
        const to = this.#to.value
        if (to != "" && from != "") {
            this.add(to, from)
        }
    }
}

class nodes {


    /**
     * @property {Vis}
     */
    #nodes = new vis.DataSet()

    #edges = new vis.DataSet()

    #options = {}

    #len = 0

    /**
     * @type {Object}
     */
    successors = {}

    /**
     * @type {Object}
     */
    predecessors = {}

    /**
     * @type {Object}
     */
    neighbors = {}

    /**
     * @type {Object}
     */
    interiorHalfDegree = {}

    /**
     * @type {Object}
     */
    degrees = {}
    


    /**
     * @type {Object}
     */
    upperHalfDegree = {}

    #names = [
        'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z'
    ]


    constructor(len) {
        this.view = document.querySelector(".view")
        this.#len = len
    }

    /**
     * Permet de réinitia
     */
    reset() {
        this.#nodes = new vis.DataSet()
        this.#edges = new vis.DataSet()
    }

    /**
     * Permet de chercher les options du graphe (prédécesseurs, successeurs, voisins, degres, ...)
     */
    options() {
        const edgesArrray = this.#edges.get()
        const nodesArrray = this.#nodes.get()

        nodesArrray.forEach(node => {
            edgesArrray.forEach(element => {
                if (node.id == element.from) {
                    this.addSuccessor(element.from, element.to)
                    this.addPredessor(element.to, element.from)

                    if (element.from == element.to) {
                        this.addNeighborsTo(element.from, element.to)
                    } else {
                        this.addNeighborsFrom(element.to, element.from)
                        this.addNeighborsTo(element.from, element.to)
                    }
                }    
            });
        });
       
    }

    degres() {

        const nodesArrray = this.#nodes.get()

        nodesArrray.forEach(node => {
            const successor = this.successors[node.id]
            console.log(successor);
            if (successor != undefined) {
                this.interiorHalfDegree[node.id] = successor.length
            } else {
                this.interiorHalfDegree[node.id] = 0
            }
        });

        nodesArrray.forEach(node => {
            const predecessor = this.predecessors[node.id]
            if (predecessor != undefined) {
                this.upperHalfDegree[node.id] = predecessor.length
            } else {
                this.upperHalfDegree[node.id] = 0
            }
        });

        nodesArrray.forEach(node => {
            const predecessor = this.upperHalfDegree[node.id]
            const successor = this.interiorHalfDegree[node.id]
            this.degrees[node.id] = (successor + predecessor)
        });
    }

    /**
     * 
     * Permet d'ajouter le successeur de x dans le tableau
     * 
     * @param {string} key 
     * @param {string} value 
     */
    addSuccessor(key, value) {
        if (this.successors[key] != undefined) {
            let exist = this.successors[key]
            exist.push(value)
            this.successors[key] = exist
        } else {
            this.successors[key] = [value]
        }
    }

    /**
     * 
     * @param {string} key 
     * @param {string} value 
     */
    addPredessor(key, value) {
        if (this.predecessors[key] != undefined) {
            let exist = this.predecessors[key]
            exist.push(value)
            this.predecessors[key] = exist
        } else {
            this.predecessors[key] = [value]
        }
    }

    addNeighborsTo(key, value) {
        if (this.neighbors[key] !== undefined) {
            let exist = this.neighbors[key]
            exist.push(value)
            this.neighbors[key] = exist
        } else {
            this.neighbors[key] = [value]
        }
    }

    addNeighborsFrom(key, value) {
        if (this.neighbors[key] !== undefined) {
            let exist = this.neighbors[key]
            exist.push(value)
            this.neighbors[key] = exist
        } else {
            this.neighbors[key] = [value]
        } 
    }

    add() {
        for (let index = 0; index < this.#len; index++) {
            const name = this.#names[index];
            try {
                this.#nodes.add({
                    id: name,
                    label: name
                })
            } catch (error) {
                this.#nodes.update({
                    id: name,
                    label: name
                })
            }
        }
    }

    addEdge (data) {
        this.#edges.add(data)
    }

    get nodes() {
        return this.#nodes
    }

    get edges() {
        return this.#edges
    }


    state() {
        return {
            nodes:this.#nodes, edges:this.#edges
        }
    }

    /**
     * Permet d'ajouter les résultats dans le DOM
     */
    push() {
        const network = new vis.Network(this.view, this.state() , this.#options)
    }
    
}

class views {

    
    /**
     * 
     * @param {nodes} instance 
     */
    constructor(instance){
        this.instance = instance

        this.successor = document.querySelector("#response-successor")
        this.predecessor = document.querySelector("#response-predecessor")
        this.neighbors = document.querySelector("#response-neighbors")
        this.degreeinf = document.querySelector("#response-degreeinf")
        this.degreeext = document.querySelector("#response-degreeext")
        this.degree = document.querySelector("#response-degree")
        this.on = document.querySelector('#on')
        this.onSubmit = this.onSubmit.bind(this)
        this.on.addEventListener('click',this.onSubmit)

        

    }

    /**
     * 
     * @param {Event} e 
     */
     onSubmit(e) {
        e.preventDefault()
        this.instance.options()
        this.instance.degres()
        this.appendSuccessor()
        this.appendPredecessor()
        this.appendNeighbors()
        this.appendDegreeInf()
        this.appendDegreeExt()
        this.appendDegree()
    }


    /**
     * 
     * @param {HTMLElement} element 
     * @param {HTMLElement} parent 
     */
    appendTo(element, parent) {
        parent.append(element)
    }

    create(elements) {
        const ul = createElement('ul')
        elements.forEach(element => {
            const li = createElement('li')
            li.innerText = element
            ul.append(li)
        });
        return ul
    }

    appendSuccessor() {
        for (const key in this.instance.successors) {
            const successors = this.instance.successors[key]

            const content = createElement('div', {class: 'content'})
            const title = createElement('h6')
            title.innerText = `${key} : `
            const creates = this.create(successors)

            content.append(title)
            content.append(creates)
            content.append(creates)
            this.appendTo(content, this.successor)
        }
    }

    appendPredecessor() {
        for (const key in this.instance.predecessors) {
            const predecessor = this.instance.predecessors[key]

            const content = createElement('div', {class: 'content'})
            const title = createElement('h6')
            title.innerText = `${key} : `
            const creates = this.create(predecessor)

            content.append(title)
            content.append(creates)
            this.appendTo(content, this.predecessor)
        }
    }

    appendNeighbors() {
        for (const key in this.instance.neighbors) {
            const n = this.instance.neighbors[key]
            const content = createElement('div', {class: 'content'})
            const title = createElement('h6')
            title.innerText = `${key} : `
            const creates = this.create(n)

            content.append(title)
            content.append(creates)
            this.appendTo(content, this.neighbors)
            
        }
    }

    appendDegreeInf() {
        for (const key in this.instance.interiorHalfDegree) {
            const n = this.instance.interiorHalfDegree[key]
            const content = createElement('div', {class: 'content'})
            const title = createElement('h6')
            title.innerText = `${key} : `
            const create = this.create([n])

            content.append(title)
            content.append(create)
            this.appendTo(content, this.degreeinf)
        }
    }

    appendDegreeExt() {
        for (const key in this.instance.upperHalfDegree) {
            const n = this.instance.upperHalfDegree[key]
            const content = createElement('div', {class: 'content'})
            const title = createElement('h6')
            title.innerText = `${key} : `
            const create = this.create([n])

            content.append(title)
            content.append(create)
            this.appendTo(content, this.degreeext)
        }
    }

    appendDegree() {
        for (const key in this.instance.degrees) {
            const n = this.instance.degrees[key]
            const content = createElement('div', {class: 'content'})
            const title = createElement('h6')
            title.innerText = `${key} : `
            const create = this.create([n])

            content.append(title)
            content.append(create)
            this.appendTo(content, this.degree)
        }
    }



}

const init = (number) => {

    //  l'instance de node (sommes)
    let node = new nodes(number)

    node.reset()
    //  on ajoute les nodes
    node.add()

    //  instance de edge pour les relations
    let edge = new edges(node.nodes, node.edges)

    // generator de options
    edge.generator()

    node.addEdge(edge.edges)

    node.push()

    let view = new views(node)
}

const input =  document.querySelector("#length")
const submit =  document.querySelector("#create")
if (input && submit) {

    /**
     * 
     * @param {Event} e 
     */
    const onSubmit = function (e) {
        e.preventDefault()
        value = input.value
        if (value != "") {
            init(parseInt(value))
            this.innerHTML = 'récommencer'
            this.setAttribute('type', 'reset')
        }
    }

    submit.addEventListener("click", onSubmit)

}

