let result = [];
function selectText() {
  if(document.selection){ //For IE
    return  document.selection.createRange().text;
  } else {
    return  window.getSelection().toString();
  }
}

document.onmouseup = function (e) {
  console.log(e,selectText());
  let text = selectText().trim();
  if (text.length > 0 && !result.includes(text)) {
    result.push(text);
    console.log(result);
    window.chrome.extension.sendMessage({
      type: 'add'
    })

  }
}


// window.chrome.tabs.executeScript(null, {
//   code:"console.log(window.getSelection().toString());"
// })



// let opts = {
//   init: false,
//   mouseDownTarget: null,
//   mouseStartX : 0,
//   mouseStartY: 0,
//   timerId: {
//     w1 : 0,
//     w2: 0,
//     w3 : 0,
//     w4 : 0,
//   },
// };
//-----------------------------------------------------------------------------
// window.localStorage is available, but doesn't appear to be initialized
// when accessed from content scripts so I'm using message passing and a
// background page to get the info.
//-----------------------------------------------------------------------------
// window.chrome.extension.sendMessage(
//   { "type" : "config" },
//   function (resp) {
//     console.log(resp)
//     opts.init = true;
//     document.body.addEventListener("mouseup", autoCopyW, false);
//     document.body.addEventListener(
//       "mousedown",
//       function (e) {
//         //debug("StartX = " + e.x + " -- StartY = " + e.y);
//         opts.mouseStartX = e.x;
//         opts.mouseStartY = e.y;
//         opts.mouseDownTarget = e.target;
//       },
//       false
//     );
//   }
// );

// function debug(text, standalone) {
//   if (opts.enableDebug) {
//     if (!standalone) {
//       console.debug("Auto-Copy (debug): " + text);
//     } else {
//       console.debug(text);
//     }
//   }
// }

// function autoCopyW(e) {
//   var x;
//   var y;
//   var mouseTravel = false;
//   debug(
//     "Mouse coords: " + e.x + " - " + e.y + " - " + opts.mouseStartX + " - " +
//       opts.mouseStartY
//   );
//   debug(
//     "Keyboard modifiers: alt=" + e.altKey + " - ctrl=" + e.ctrlKey +
//       " - shift=" + e.shiftKey
//   );
//   if (opts.mouseStartX && opts.mouseStartY) {
//     x = Math.abs(e.x - opts.mouseStartX);
//     y = Math.abs(e.y - opts.mouseStartY);
//     opts.mouseStartX = 0;
//     opts.mouseStartY = 0;
//     if (x > 3 || y > 3) {
//       debug("Detected mouse drag");
//       mouseTravel = true;
//     }
//   }

//   debug("Click count: " + e.detail + " - mouse travel? " + mouseTravel);

//   if (opts.pasteOnMiddleClick && e.button === 1) {
//     debug("paste requested, calling autoCopy immediately");
//     autoCopyW2(e);
//   } else if (mouseTravel && e.detail === 1) {
//     debug("calling autoCopy immediately");
//     autoCopyW2(e);
//   } else if (!mouseTravel && e.detail === 1) {
//     debug("ignoring click.  No mouse travel and click count is one.");
//     return;
//   } else if (mouseTravel && e.detail >= 2) {
//     debug("double click and drag -- calling autoCopy immediately");
//     autoCopyW2(e);
//   } else if (!mouseTravel && e.detail >= 3) {
//     debug("triple click detected -- calling autoCopy immediately");
//     clearTimeout(opts.timerId.w1);
//     opts.timerId.w1 = 0;
//     autoCopyW2(e);
//   } else if (!mouseTravel && e.detail == 2) {
//     //-------------------------------------------------------------------------
//     // We have to wait before calling auto copy when two clicks are 
//     // detected to see if there is going to be a triple click.
//     //-------------------------------------------------------------------------
//     debug("timerId? " + opts.timerId.w1);
//     if (!opts.timerId.w1) {
//       debug(
//         "Setting timer to call autoCopy -- need to wait and see if there " +
//         "is a triple click."
//       );
//       opts.timerId.w1 = setTimeout(function () {
//         opts.timerId.w1 = 0;
//         autoCopyW2(e);
//       }, 500);
//     }
//   }
// }

// function autoCopyW2(e) {
//   if (opts.copyDelay && opts.copyDelayWait >= 0) {
//     debug("Copy delay in effect, waiting " + opts.copyDelayWait + " seconds");
//     let duration = parseFloat(opts.copyDelayWait) * 1000;
//     debug("Copy delay: timerId? " + opts.timerId.w2);
//     if (opts.timerId.w2) {
//       debug("Copy delay: clearing timer");
//       clearTimeout(opts.timerId.w2);
//     }
//     debug("Copy delay: setting timer to call autoCopy");
//     opts.timerId.w2 = setTimeout(function () {
//       opts.timerId.w2 = 0;
//       autoCopy(e);
//     }, duration);
//   } else {
//     debug("Copy delay disabled");
//     autoCopy(e);
//   }
// }

// function autoCopy(e) {
//   var rv;
//   var el;
//   var s;
//   var text;
//   // var nodeTypes       = { 'input' : false, 'editable' : false };
//   var inputElement    = false;
//   var editableElement = false;
//   var duration;

//   if (
//     opts.mouseDownTarget &&
//     opts.mouseDownTarget.nodeName &&
//     (opts.mouseDownTarget.nodeName === "INPUT" ||
//     opts.mouseDownTarget.nodeName === "TEXTAREA")
//   ) {
//     debug("Mouse down on input element");
//     inputElement = true;
//   }

//   if (opts.mouseDownTarget && opts.mouseDownTarget.isContentEditable) {
//     debug("Mouse down on content editable element");
//     editableElement = true;
//   }

//   if (opts.enableDebug) {
//     console.debug(opts, true);
//   }

//   debug(
//     "Use modifier to " + opts.ctrlState + " extension? " + opts.ctrlToDisable + 
//     "; modifier key: " + opts.ctrlToDisableKey
//   );

//   if (opts.pasteOnMiddleClick && e.button === 1) {
//     el = e.target;
//     debug("autoCopy: detected paste on middle click");

//     if (
//       ((e.target.nodeName === "INPUT"
//         || e.target.nodeName === "TEXTAREA")
//       && e.target.type !== "checkbox"
//       && e.target.type !== "radio"
//       && !e.target.disabled
//       && !e.target.readOnly)
//       || e.target.contentEditable === "true"
//     ) {
//       rv = document.execCommand('paste');
//       debug("paste rv:" + rv);

//       //-----------------------------------------------------------------------
//       // This is fallback for browsers that don't support execCommand in the
//       // content script
//       //-----------------------------------------------------------------------
//       if (!rv) {
//         try {
//           window.chrome.extension.sendMessage(
//             {
//               "type" : "paste",
//               "text" : text
//             },
//             function(text) {
//               var p1;
//               var p2;
//               // var start;
//               // var end;

//               if (
//                 e.target.nodeName === "INPUT"
//                   || e.target.nodeName === "TEXTAREA"
//               ) {
//                 p1 = el.value.substring(0,el.selectionStart);
//                 p2 = el.value.substring(el.selectionEnd);

//                 el.value = p1 + text + p2;
//               } else if (e.target.contentEditable === "true") {
//                 el.innerHTML = el.innerHTML + text;
//               }
//             }
//           );
//         } catch (ex) {
//           debug("Caught exception: " + ex);
//         }
//       }
//     } else {
//       debug(
//         e.target.nodeName + " is not editable, cannot perform paste"
//       );
//     }
//     return;
//   }

//   if (!opts.enableForContentEditable && editableElement) {
//     debug("Extension is not enabled for content editable elements");
//     return;
//   }

//   if (!opts.enableForTextBoxes && inputElement) {
//     debug("Extension is not enabled for text boxes");
//     return;
//   }

//   s    = window.getSelection();
//   debug("selection collapsed? " + s.isCollapsed);
//   text = s.toString();
//   debug("selection collapsed? " + s.isCollapsed + " - length: " + text.length);
//   if (!inputElement && s.isCollapsed) {
//     debug("No selection, ignoring click");
//     return;
//   } else if (inputElement && text.length <= 0) {
//     //-------------------------------------------------------------------------
//     // Chrome is showing collapsed when an input element has selected text.
//     //-------------------------------------------------------------------------
//     debug("(input element) No selection, ignoring click");
//     return;
//   }

//   try {
//     debug(
//       "copy as link: " + opts.copyAsLink + "; Modifier to copy as link: " +
//       opts.altToCopyAsLink + "; modifier key: " + opts.altToCopyAsLinkModifier
//     );
//      if (opts.copyAsPlainText) {
//       debug("performing copy as plain text");
//       copyAsPlainText({ 'event' : e });
//     } else if (opts.includeUrl) {
//       debug("performing copy with comment");
//       //-----------------------------------------------------------------------
//       // This is needed to clear the clipboard contents. Otherwise, we'll keep
//       // adding to what's on the clipboard in background.js
//       //-----------------------------------------------------------------------
//       rv = document.execCommand("copy");
//       if (opts.trimWhitespace) {
//         debug("Falling back to plain text copy (0x1)");
//         opts.copyAsPlainText = true;
//         copyAsPlainText({ 'event' : e });
//         opts.copyAsPlainText = false;
//       } else if (rv) {
//         // text = includeComment({
//         //   'text'  : text,
//         //   'merge' : false,
//         //   'event' : e
//         // });
//         debug("Got comment: " + text);
//         window.chrome.extension.sendMessage({
//           "type"    : "includeComment",
//           "comment" : text,
//           "opts"    : opts
//         });
//       } else {
//         debug("Falling back to plain text copy (0x2)");
//         opts.copyAsPlainText = true;
//         copyAsPlainText({ 'event' : e });
//         opts.copyAsPlainText = false;
//       }
//     } else {
//       debug("executing copy");
//       //-----------------------------------------------------------------------
//       // This is needed to clear the clipboard contents. Otherwise, we'll keep
//       // adding to what's on the clipboard in background.js
//       //-----------------------------------------------------------------------
//       rv = document.execCommand("copy");
//       debug("copied: " + rv);
//       if (opts.trimWhitespace || !rv) {
//         debug("Falling back to plain text copy (0x3)");
//         opts.copyAsPlainText = true;
//         copyAsPlainText({ 'event' : e });
//         opts.copyAsPlainText = false;
//       }
//     }
//     // alertOnCopy(e);
//   } catch (ex) {
//     debug("Caught exception: " + ex);
//   }

//   if (opts.removeSelectionOnCopy) {
//     debug("Removing selection");
//     s.removeAllRanges();
//   }

//   if (opts.clearClipboard) {
//     if (opts.timerId.w4) {
//       clearTimeout(opts.timerId.w4);
//       opts.timerId.w4 = 0;
//     }

//     duration = parseFloat(opts.clearClipboardWait) * 1000;
//     debug("Setting timer to clear clipboard: " + duration);
//     opts.timerId.w4 = setTimeout(function () {
//       opts.timerId.w4 = 0;
//       debug("Clearing clipboard");
//       window.chrome.extension.sendMessage({
//         "type" : "clearClipboard",
//       });
//     }, duration);
//   }

//   return;
// }

// function copyAsPlainText(params) {
//   console.log(params)
//   var s;
//   var text;
//   try {
//     s = window.getSelection();
//     text = s.toString();

//     //-------------------------------------------------------------------------
//     // Don't execute the copy if nothing is selected.
//     //-------------------------------------------------------------------------
//     if (text.length <= 0) {
//       debug("Selection was empty");
//       return;
//     }

//     if (opts.trimWhitespace) {
//         debug("Trimming selectection");
//         text = text.replace(/^\s+|\s+$/g, '');
//         text = text.replace(/[\n\r]+$/g, '');
//     }

//     debug("Got selectection: " + text);

//     // if (opts.includeUrl) {
//     //   text = includeComment({
//     //     'text' : text, 'merge' : true, 'event' : params.event
//     //   });
//     // }

//     debug("Sending copy as plain text: " + text);
//     window.chrome.extension.sendMessage({
//       "type" : "reformat",
//       "text" : text
//     });
//   } catch (ex) {
//     debug("Caught exception: " + ex);
//   }
// }