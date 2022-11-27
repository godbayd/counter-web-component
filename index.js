customElements.define('x-counter', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }) 
        this.render()
        this.bindListeners()
    }
    
    set count(val) {
        this.setAttribute('count', Number(val))
    }
    
    set step(val) {
        this.setAttribute('count', Number(val))
    }
    
    get count() {
        const val = this.getAttribute('count')
        return Number(val)
    }
    
    get step() {
        const val = this.getAttribute('step')
        return val && Number(val)
    }
    
    static get observedAttributes() {
        return [
            'step',
            'count',
            'button-size',
            'text-size'
        ] 
    }
    
    get $display() { return this.shadowRoot.querySelector('.number-display') }
    get $decBtn() { return this.shadowRoot.querySelector('button[data-direction="dec"]') }
    get $incBtn() { return this.shadowRoot.querySelector('button[data-direction="inc"]') }
    get $container() { return this.shadowRoot.querySelector('.container') }
    
    attributeChangedCallback(name, oldVal, newVal) {
        if (!['count', 'step', 'text-size'].includes(name)) return
        if (newVal === oldVal) return
        if (name === 'text-size') {
            this.$container.style.fontSize = newVal
        }
        if (name === 'count') {
            if (!/^\d+$/.test(newVal)) return
            this.count = newVal
            this.updateDisplay()
        }
        if (name === 'step') {
            if (!/^\d+$/.test(newVal)) return
            this.step = newVal
        }
    }
    
    buildNumberDisplay() {
        const $display = document.createElement('div')
        $display.classList.add('number-display')
        $display.innerText = '0'
        return $display
    }
    
    updateDisplay() {
        this.$display.innerText = this.count
    }
    
    updateCount(direction) {
        const newCount = direction === 'inc' 
            ? this.count + this.step
            : this.count - this.step
        this.count = newCount
        this.updateDisplay()
    }
    
    dispatchCount() {
        this.shadowRoot.dispatchEvent(new CustomEvent('count', {
            bubbles: true, // bubble up to parent
            composed: true, // needed to pass shadow root
            detail: { // supply listener with relevent data
                count: this.count,
            }
        }))
    }
    
    bindListeners() {
        this.shadowRoot.addEventListener('click', e => {
            e.preventDefault()
            if (e.target.matches('button')) {
                const { direction } = e.target.dataset
                this.updateCount(direction)
                this.dispatchCount()
            }
        })
    }
    
    buildButton(direction) {
        const $btn = document.createElement('button')
        $btn.setAttribute('data-direction', direction)
        $btn.innerText = direction === 'inc' ? '+' : '-'
        return $btn
    }
    
    styles() {
        const $style = document.createElement('style')
        $style.innerText = `
        :host {
            --black: rgb(30, 30, 30);
            --white: rgb(225, 225, 225);
            box-sizing: border-box;
        }
        .container {
            align-items: center;
            display: flex;
            font-size: 100%;
            gap: 1em;
        }
        .number-display {
            flex: 1;
            font-family: sans-serif;
            text-align: center;
            font-size: 1em;
        }
        button {
            background-color: var(--black);
            border-radius: 0.4em;
            border: none;
            color: var(--white);
            cursor: pointer;
            min-width: 1.7em;
            min-height: 1.7em;
            font-family: courier new, monospace;
            font-size: 1em;
        }
        `;
        return $style
    }
    render(textSize) {
        this.shadowRoot.innerHTML = ''
        const $container = document.createElement('div')
        $container.classList.add('container')
        $container.append(
            this.styles(),
            this.buildButton('dec'),
            this.buildNumberDisplay(),
            this.buildButton('inc')
        )
        this.shadowRoot.append($container)
    }
})
