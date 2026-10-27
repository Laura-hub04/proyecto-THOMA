/*!
 * Hype Hashtag Navigation
 * Copyright (2024) Max Ziebell, (https://maxziebell.de). MIT-license
 */

/*
 * Version-History
 * 1.0.0 Initial creation
 */

// Ensure the extension isn't redefined
if ("HypeHashtagNavigation" in window === false) {
	window['HypeHashtagNavigation'] = (function () {

		// Define default settings for the extension
		var _default = {
			ignoreSymbol: '🚫', // Symbol to ignore scene when navigating to a scene
			resetSymbol: '🔄'  // Symbol to reset hash when navigating to a scene
		};
		
		var _hypeDoc; // <--- Added this line

		/**
		 * Set or update a default value for the extension.
		 * 
		 * @param {String|Object} key - The default's key or an object with multiple defaults.
		 * @param {*} [value] - The new value for the default, if key is a string.
		 */
		function setDefault(key, value) {
			if (typeof key === 'object') {
				_default = Object.assign(_default, key);
			} else {
				_default[key] = value;
			}
		}

		/**
		 * Get the current value of a default.
		 * 
		 * @param {String} [key] - The key of the default to get. If omitted, all defaults are returned.
		 * @returns {*} The default value(s).
		 */
		function getDefault(key) {
			return key ? _default[key] : _default;
		}

		// Hype Document Load handler
		function HypeDocumentLoad(hypeDocument, element, event) {
			_hypeDoc = hypeDocument; // <--- Added this line

			// Get the hash value
			var hash = decodeURIComponent(window.location.hash.substring(1)); // Remove the '#' character and decode the hash
			if (hash) {
				// Navigate to the scene specified by the hash
				hypeDocument.showSceneNamed(hash, hypeDocument.kSceneTransitionInstant);
			}
		}

		// Hype Scene Load handler
		function HypeSceneLoad(hypeDocument, element, event) {
			// Set the hash based on the current scene
			var sceneName = hypeDocument.currentSceneName();
			if (!sceneName.includes(_default.ignoreSymbol)) {
				if (sceneName.includes(_default.resetSymbol)) {
					history.replaceState(null, '', window.location.href.split('#')[0]);
				} else {
					// Changed this line:
					history.pushState(null, '', '#' + encodeURIComponent(sceneName));
				}
			}
		}

		// Added this block:
		window.addEventListener('popstate', function (event) {
			if (_hypeDoc) {
				var hash = decodeURIComponent(window.location.hash.substring(1));
				if (hash) {
					_hypeDoc.showSceneNamed(hash, _hypeDoc.kSceneTransitionInstant);
				}
			}
		});

		// Register event listeners
		if ("HYPE_eventListeners" in window === false) {
			window.HYPE_eventListeners = Array();
		}
		window.HYPE_eventListeners.push({"type": "HypeDocumentLoad", "callback": HypeDocumentLoad});
		window.HYPE_eventListeners.push({"type": "HypeSceneLoad", "callback": HypeSceneLoad});

		// Public API for the extension
		return {
			version: '1.0.0',
			setDefault: setDefault,
			getDefault: getDefault
		};

	})();
}