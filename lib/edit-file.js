/** ---------------------------------------------------------------------------
 * @module    edit-file
 * @description Provides a function to open a file with editor named in either
 * VISUAL or EDITOR enviromment variable
 * @author  kevinmu <kevin.mulholland@bbc.co.uk>
 * @licence MIT
 */

// make sure we are checking for basic coding errors

'use strict';
'use esversion: 6';

const childProcess = require('child_process');
const shell = require('shelljs');
const debug = require('debug')('edit-file');

/** ---------------------------------------------------------------------------
 * find the linenumber where we have a match, expected that this data
 * contains newlines
 *
 * @function     _findLineNumber
 * @private
 * @param      {string}  data    string of file data that may contains a match
 * @param      {String|RegExp}  re      regular expression to match on
 * @returns     {number}          the linenumber of any match, 0 if no match
 */
function _findLineNumber (data, re) {
  let counter = 0;
  let matched = 0;

  if (re) {
    for (const line of data.split(/\n/)) {
      counter++;
      if (line.match(re)) {
        matched++;
        break;
      }
    }
  }

  // ensure 0 if no match
  return matched ? counter : 0;
}

/**
 * ---------------------------------------------------------------------------
 * open a file using the editor menitoned in the VISUAL or EDITOR enviromment
 * values
 *
 * @method     editFile
 * @param      {String}  fileName   The file name
 * @param      {Regexp}  re         Regular expression to determine line number
 *                               to open on
 * @param      {<type>}  openAfter  optional number of extra lines add to the matched linenumber
 */
function editFile (fileName, re, openAfter) {
  // open file in prefered editor, fallback to vi
  const editor = process.env.VISUAL || process.env.EDITOR || 'vi';
  const args = [];
  const out = shell.cat(fileName) || '';
  let linenumber = _findLineNumber(out, re);
  if (openAfter) {
    linenumber += openAfter;
  }
  // some editors allow us to open on specific lines but they have different ways of doing it
  switch (editor) {
    case 'subl':
      debug('sublime-text editor');
      args.push(`${fileName}:${linenumber}`);
      break;
    case 'vi':
    case 'vim':
      debug('vi/vim editor');
      args.push(`+${linenumber}`, fileName);
      break;
    default:
      debug('unexpected editor ' + editor);
      args.push(fileName);
      break;
  }
  // we need to open in the terminal with the current TTY/tty
  const child = childProcess.spawn(editor, args, {
    stdio: 'inherit'
  });

  child.on('exit', function (e, code) {
    // stdout("finished");
  });
}

// -----------------------------------------------------------------------------
// just a single function to export so no need for the object

module.exports = editFile;
