const converter = require('xml-js');

export function convertXMLToJSON(data: string) {
  console.log('Parsing XML')
  try {
    data = data
      .replace(/<br \/>/g, '')
      .replace(/<\/b>/g, '')
      .replace(/<\/br>/g, '')
      .replace(/<br\/>/g, '')
      .replace(/<\/ br>/g, '')
      .replace(/<b>/g, '')
      .replace(/<br>/g, '')
      .replace(/0D/g, '0 D')
      .replace(/TancatD/g, 'Tancat D')
    let res = converter.xml2js(data, {
      compact: true,
      trim: true,
    })
    res = res.response.row.map((biblioteca: any) => {
      biblioteca.propietats = parsePropiedades(biblioteca.propietats._text)
      return biblioteca
    })
    return res;
  } catch (error: any) {
    throw Error(error)
  }
}

function parsePropiedades(propiedades: any) {
  propiedades = propiedades.trim().split('|')
  const res: any = []
  let currentPropKey = ''
  propiedades.forEach((propiedad: any, index: number) => {
    if (index % 2 === 0) {
      currentPropKey = propiedad
    } else {
      if (currentPropKey === 'Serveis') {
        propiedad = propiedad.split(',')
      }
      if (currentPropKey.includes('Horari')) {
        propiedad = propiedad
          .replace(/ D/g, '*_--_*D')
          .replace(/.H/g, '.*_--_*H')
          .split('*_--_*')
      }
      res.push({ [currentPropKey]: propiedad })
    }
  })

  return res;
}
