import Screen from './screen'
import State from '../state'
import Input from './input'
import Keyboard from './keyboard'
import Typeof from '../util/typeof'
import CliWidth from 'cli-width'
import StringWidth from 'string-width'
import ScreenManager from './screenmanager'
import Readline from './readline'
import Colors from '../colors'

let RenderEngine = {
  rl: Readline,
  screenManager: new ScreenManager(Readline),
  lastOutput: [],
  action: undefined,
  listeners: {},
  exitOnFirstRender: undefined,
  previousActionDidExitOnFirstRender: undefined,
  lastRenderWasWithScreenManager: false,

  /*
    Setups
   */
  setupListeners() {
    this.listeners = {
      keyboardDidFireChar: RenderEngine.keyboardDidFireChar.bind(this),
      keyboardDidFireEvent: RenderEngine.keyboardDidFireEvent.bind(this)
    }
  },

  setup() {
    this.setupListeners()
  },

  start() {
    // Start the whole process.
    this.listen()
    this.render()
  },

  finished() {
    Screen.exit(RenderEngine.exitOnFirstRender ? false : true)
  },

  setAction() {
    if (!State.actions.queue[0]) {
      RE.finished()
      return
    }

    let item = State.actions.queue.splice(0, 1)[0]
    RE.action = new item.action()
    RE.action.props = item.args || []
    RE.action.input = new Input()
    if (RE.action.componentDidMount) {
      RE.action.componentDidMount()
    }
  },

  listen() {
    Keyboard.on('char', this.listeners.keyboardDidFireChar)
    Keyboard.on('backspace', this.keyboardDidFireChar)
    Keyboard.on('event', this.keyboardDidFireEvent)
  },

  keyboardDidFireEvent(event) {
    if (!RenderEngine.action) { return; }
    if (RenderEngine.action && RenderEngine.action.userInputDidFireEvent) {
      RenderEngine.action.userInputDidFireEvent(event)
    }
    RenderEngine.render(RenderEngine.action)
  },
  keyboardDidFireChar(char) {
    if (!RenderEngine.action) { return; }
    if (!char) { char = -1; } // -1 means backspace!

    if (RenderEngine.action && RenderEngine.action.userInputDidUpdate) {
      RenderEngine.action.userInputDidUpdate(char)
    }

    if (char === -1) {
      RenderEngine.action.input.pop()
    } else {
      RenderEngine.action.input._data.push(char)
    }
    RenderEngine.render(RenderEngine.action)
  },
  removeAction() {
    if (!this.action) { return; }
    if (this.action.componentDidUnmount) {
      this.action.componentDidUnmount()
    }
    this.previousActionDidExitOnFirstRender = this.exitOnFirstRender ? true : false
    this.exitOnFirstRender = undefined
    this.lastOutput = []
    this.action = undefined
  },

  render(action) {
    if (action !== this.action) {
      return
    }

    if (!RE.action) {
      RE.setAction()
    }

    if (!RE.action) {
      this.finished()
      return
    }

    // Render new output
    let output = RE.action.render()
    if (Typeof(output, 'string')) {
      output = [output]
    }

    if (!Typeof(output, 'array')) {
      output = [output.toString()]
    }

    RE.lastOutput = output

    let exit = false
    if (!RE.action.componentShouldExit) {
      exit = true
    }else if (RE.action.componentShouldExit() === true) {
      exit = true
    }

    if (exit && this.exitOnFirstRender === undefined) {
      this.exitOnFirstRender = true
    } else {
      this.exitOnFirstRender = false
    }

    if (this.exitOnFirstRender === true) {
      if (this.previousActionDidExitOnFirstRender === false) {
        process.stdout.write('\n')
      }
      process.stdout.write(Colors.blur(output.join('\n')) + '\n')
      RE.lastRenderWasWithScreenManager = false
    } else if (exit) {
      RE.screenManager.render(output.join('\n'))
      // console.log(output.length)
      if (!RE.lastRenderWasWithScreenManager) {
        console.log(' ')
      }
      RE.lastRenderWasWithScreenManager = false
    // Readline.output.write('\n\n')
    // Readline.output.write('OUTPUT')
    // Readline.output.write(output.join('\n'))
    // process.stdout.write(output.join('\n'))
    } else {
      RE.screenManager.render(output.join('\n'))
      RE.lastRenderWasWithScreenManager = true
    }

    if (exit) {
      RE.removeAction()
      RE.render()
    }
  }
}

var RE = RenderEngine
RE.setup()

export default RenderEngine