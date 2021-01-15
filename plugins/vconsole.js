import VConsole from 'vconsole'
const vConsole = process.env.nodeEnv === 'testing' ? new VConsole() : ''
export default vConsole