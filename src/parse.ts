import { getFreezeObj } from "./utils"

let errorMsg

const error = (zeroth, wunth) => {
  errorMsg = {
    id: '(error)',
    zeroth,
    wunth,
  }
  throw 'fail'
}

const PRIMORDIAL_VAL = [
  'abs',
  'array',
  'array?',
  'bit and',
  'bit mask',
  'bit or',
  'bit shift down',
  'bit shift up',
  'bit xor',
  'boolean?',
  'char',
  'code',
  'fraction',
  'function?',
  'integer',
  'integer?',
  'length',
  'neg',
  'not',
  'number',
  'number?',
  'null',
  'record',
  'record?',
  'stone',
  'stone?',
  'text',
  'text?',
  'false',
  'true'
]

const primordial = ((ids: string[]) => {
  const result = Object.create(null)
  ids.forEach(id => {
    result[id] = getFreezeObj({
      id,
      alphameric: true,
      readonly: true,
    })
  })
  return getFreezeObj(result)
})(PRIMORDIAL_VAL)


let theTokenGenerator
let prevToken
let token
let nextToken

let nowFunction
let loop

const THE_END = getFreezeObj({
  id: '(end)',
  precedence: 0,
  colunmNr: 0,
  colunmTo: 0,
  lineNo: 0,
})

const advance(id) => {
  if (id !== undefined && id !== token.id) {
    return error(token, `expected ${id}`)
  }
  prevToken = token
  token = nextToken
  nextToken = theTokenGenerator() || THE_END;
}