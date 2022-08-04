import { getFreezeObj } from "./utils";

const RX_UNICODE_ESCAPEMENT = /\\u\{([0-9A-F]{4,6})\}/g

const RX_CRLF = /\n|\r\n?/;


const RX_TOKEN = /todo/;

const tokenize = (source: string, comment = false) => {
  const lines = Array.isArray(source) ? source : source.split(RX_CRLF)
  let lineNo = 0
  let line: string = lines[0]
  RX_TOKEN.lastIndex = 0

  const tokenGenerator = () => {
    if (line === undefined) {
      return
    }
    let columnNr = RX_TOKEN.lastIndex
    if (columnNr >= line.length) {
      RX_TOKEN.lastIndex = 0
      lineNo += 1
      line = line[lineNo]
      return line === undefined ? undefined : tokenGenerator()
    }
    let captives = RX_TOKEN.exec(line)
    if (!captives) {
      return {
        id: "(error)",
        lineNo,
        columnNr,
        String: line.slice(columnNr),
      }
    }
    if (captives[1]) {
      return tokenGenerator()
    }

    const columnTo = RX_TOKEN.lastIndex

    if (captives[2]) {
      return comment ? {
        id: "(comment)",
        comment: captives[2], 
        lineNo,
        columnNr,
        columnTo,
      } : tokenGenerator()
    }
    if (captives[3]) {
      return {
        id: captives[3],
        alphameric: true,
        lineNo,
        columnNr,
        columnTo,
      }
    }
    if (captives[4]) {
      return {
        id: "(number)",
        readonly: true,
        number: Number(captives[4]),
        text: captives[4],
        lineNo,
        columnNr,
        columnTo,
      }
    }
    if (captives[5]) {
      return {
        id: "(text)",
        readonly: true,
        text: JSON.parse(captives[5].replace(
          RX_UNICODE_ESCAPEMENT,
          (_ignore, code) => {
            return String.fromCodePoint(parseInt(code, 16))
          }
        )),
        lineNo,
        columnNr,
        columnTo,
      }
    }
    if (captives[6]) {
      return {
        id: captives[6],
        lineNo,
        columnNr,
        columnTo,
      }
    }
  }

  return tokenGenerator
}


export default getFreezeObj(tokenize) 