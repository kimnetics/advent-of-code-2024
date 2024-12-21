import fs from 'fs'

let registerA
let registerB
let registerC

let output = []

function getComboOperandValue (operand) {
  switch (operand) {
    case '0':
      return 0
    case '1':
      return 1
    case '2':
      return 2
    case '3':
      return 3
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
      registerA = Math.floor(registerA / 2 ** getComboOperandValue(operand))
      return -1
    // bxl (bitwise XOR, literal operand)
    case '1':
      registerB = registerB ^ parseInt(operand)
      return -1
    // bst (modulo 8, stored in register B)
    case '2':
      registerB = getComboOperandValue(operand) % 8
      return -1
    // jnz (jump if not zero)
    case '3':
      if (registerA !== 0) {
        return parseInt(operand)
      }
      return -1
    // bxc (bitwise XOR, register C)
    case '4':
      registerB = registerB ^ registerC
      return -1
    // out (output)
    case '5':
      output.push(getComboOperandValue(operand) % 8)
      return -1
    // bdv (division, stored in register B)
    case '6':
      registerB = Math.floor(registerA / 2 ** getComboOperandValue(operand))
      return -1
    // cdv (division, stored in register C)
    case '7':
      registerC = Math.floor(registerA / 2 ** getComboOperandValue(operand))
      return -1
    default:
      console.error(`Invalid opcode: ${opcode}`)
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')

  const parser = /.+: (.+)/

  // Parse program context.
  let match
  match = input[0].match(parser)
  registerA = parseInt(match[1])
  //
  match = input[1].match(parser)
  registerB = parseInt(match[1])
  //
  match = input[2].match(parser)
  registerC = parseInt(match[1])
  //
  match = input[4].match(parser)
  const program = match[1].split(',')
  const programLength = program.length

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

  console.log(output.join(','))
} catch
  (err) {
  console.error('Error reading file: ', err)
}
