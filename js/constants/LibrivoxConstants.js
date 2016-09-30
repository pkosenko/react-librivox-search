// This files is now defunct. It was build with the original Flux 
// examples in mind.  Now changed to Redux.  Action types are now defined
// at the top of the action.js file.


/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * LibrivoxConstants
 *
 * 'keymirror' is supposed to create object whose keys values are identical
 * to the key names {key1:key1}.  This can be done manually.
 * 
 * Moved action types over into librivox-actions.js file
 *
 */

// These are key signatures for the flux actions.

var keyMirror = require('keymirror');

// not sure why these are all initially nulled out
// and other constants modules do not use keymirror -- they simply 
// repeat the key name as the value.

module.exports = keyMirror({
  SAVE_LIBRIVOX_DATA: null,
  UPDATE_LIBRIVOX_DATA: null
});
