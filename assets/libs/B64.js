const keyStr =
  'ABCDEFGHIJKLMNOP' +
  'QRSTUVWXYZabcdef' +
  'ghijklmnopqrstuv' +
  'wxyz0123456789+/' +
  '=';

module.exports = encode64;

function encode64(input) {
  if (input !== undefined && input != null && input != '') {
    input = input + '';
    input = input
      .replace(/\xe1/g, '||a||')
      .replace(/\xe9/g, '||e||')
      .replace(/\xed/g, '||i||')
      .replace(/\xf3/g, '||o||')
      .replace(/\xfa/g, '||u||')
      .replace(/\xc1/g, '||A||')
      .replace(/\xc9/g, '||E||')
      .replace(/\xcd/g, '||I||')
      .replace(/\xd3/g, '||O||')
      .replace(/\xda/g, '||U||')
      .replace(/\xf1/g, '||n||')
      .replace(/\xd1/g, '||N||')
      .replace(/\xa1/g, '||!||')
      .replace(/\xbf/g, '||?||')
      .replace(/\xdc/g, '||UU||')
      .replace(/\xfc/g, '||uu||')
      .replace(/\./g, '||.||');
    let output = '';
    let chr1,
      chr2,
      chr3 = '';
    let enc1,
      enc2,
      enc3,
      enc4 = '';
    let i = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);

      chr1 = chr2 = chr3 = '';
      enc1 = enc2 = enc3 = enc4 = '';
    } while (i < input.length);

    return output;
  } else {
    return input;
  }
}

export default encode64;

function decode64(input) {
  let output = '';
  let chr1,
    chr2,
    chr3 = '';
  let enc1,
    enc2,
    enc3,
    enc4 = '';
  let i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  const base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    alert(
      'There were invalid base64 characters in the input text.\n' +
        'Valid base64 characters are A-Z, a-z, 0-9,  + ,  / , and  = \n' +
        'Expect errors in decoding.',
    );
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  output = output
    .replace(/\|\|a\|\|/g, '\xe1')
    .replace(/\|\|e\|\|/g, '\xe9')
    .replace(/\|\|i\|\|/g, '\xed')
    .replace(/\|\|o\|\|/g, '\xf3')
    .replace(/\|\|u\|\|/g, '\xfa')
    .replace(/\|\|A\|\|/g, '\xc1')
    .replace(/\|\|E\|\|/g, '\xc9')
    .replace(/\|\|I\|\|/g, '\xcd')
    .replace(/\|\|O\|\|/g, '\xd3')
    .replace(/\|\|U\|\|/g, '\xda')
    .replace(/\|\|n\|\|/g, '\xf1')
    .replace(/\|\|N\|\|/g, '\xd1')
    .replace(/\|\|\!\|\|/g, '\xa1')
    .replace(/\|\|\?\|\|/g, '\xbf')
    .replace(/\|\|UU\|\|/g, '\xdc')
    .replace(/\|\|uu\|\|/g, '\xfc')
    .replace(/\|\|\.\|\|/g, '.');

  return output;
}

