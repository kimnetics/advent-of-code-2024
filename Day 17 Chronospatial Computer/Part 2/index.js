import fs from 'fs'

let registerA
let registerB
let registerC

let program
let programString
let programLength

let output

let lowestRegisterA = BigInt(9223372036854775807)

function getComboOperandValue (operand) {
  switch (operand) {
    case '0':
      return BigInt(0)
    case '1':
      return BigInt(1)
    case '2':
      return BigInt(2)
    case '3':
      return BigInt(3)
    case '4':
      return registerA
    case '5':
      return registerB
    case '6':
      return registerC
    default:
      console.error(`Invalid operand: ${operand}`)
  }
}

function handleInstruction (opcode, operand) {
  switch (opcode) {
    // adv (division, stored in register A)
    case '0':
      registerA = registerA / BigInt(2) ** getComboOperandValue(operand)
      return -1
    // bxl (bitwise XOR, literal operand)
    case '1':
      registerB = registerB ^ BigInt(parseInt(operand))
      return -1
    // bst (modulo 8, stored in register B)
    case '2':
      registerB = getComboOperandValue(operand) % BigInt(8)
      return -1
    // jnz (jump if not zero)
    case '3':
      if (registerA !== BigInt(0)) {
        return parseInt(operand)
      }
      return -1
    // bxc (bitwise XOR, register C)
    case '4':
      registerB = registerB ^ registerC
      return -1
    // out (output)
    case '5':
      output += getComboOperandValue(operand) % BigInt(8)
      return -1
    // bdv (division, stored in register B)
    case '6':
      registerB = registerA / BigInt(2) ** getComboOperandValue(operand)
      return -1
    // cdv (division, stored in register C)
    case '7':
      registerC = registerA / BigInt(2) ** getComboOperandValue(operand)
      return -1
    default:
      console.error(`Invalid opcode: ${opcode}`)
  }
}

function executeProgram (currentRegisterA) {
  registerA = currentRegisterA
  registerB = BigInt(0)
  registerC = BigInt(0)

  output = ''

  // Execute program.
  let instructionPointer = 0
  while (instructionPointer < programLength) {
    const jump = handleInstruction(program[instructionPointer], program[instructionPointer + 1])
    if (jump < 0) {
      instructionPointer += 2
    } else {
      instructionPointer = jump
    }
  }
}

// Credit for this function goes to Martin Zikmund https://www.youtube.com/watch?v=6xraml0-Oqo
function findLowest (currentRegisterA, index) {
  if (index === -1) {
    lowestRegisterA = (lowestRegisterA < currentRegisterA) ? lowestRegisterA : currentRegisterA
    return
  }

  for (let i = 0; i < 8; i++) {
    const nextRegisterA = currentRegisterA * BigInt(8) + BigInt(i)
    executeProgram(nextRegisterA)
    if (programString.slice(-output.length) === output) {
      findLowest(nextRegisterA, index - 1)
    }
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')

  const parser = /.+: (.+)/

  // Parse program context.
  let match
  match = input[0].match(parser)
  registerA = BigInt(parseInt(match[1]))
  //
  match = input[1].match(parser)
  registerB = BigInt(parseInt(match[1]))
  //
  match = input[2].match(parser)
  registerC = BigInt(parseInt(match[1]))
  //
  match = input[4].match(parser)
  program = match[1].split(',')
  programLength = program.length
  programString = program.join('')

  // Find lowest value for register A.
  findLowest(BigInt(0), programLength - 1)
  console.log(lowestRegisterA)
} catch
  (err) {
  console.error('Error reading file: ', err)
}
