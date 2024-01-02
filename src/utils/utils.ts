import readline from 'readline'

const trueRegex = /^true$/i

export function isTrue(value: string | null | undefined): boolean {
  if (!value) return false
  return trueRegex.test(value)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function promptForInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise<string>(resolve => {
    rl.question(question, userInput => {
      rl.close()
      resolve(userInput)
    })
  })
}
