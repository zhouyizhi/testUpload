var ac_main =
webpackJsonpac__name_([1],{

/***/ "./node_modules/JsBarcode/bin/JsBarcode.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _barcodes = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/index.js");

var _barcodes2 = _interopRequireDefault(_barcodes);

var _merge = __webpack_require__("./node_modules/JsBarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _linearizeEncodings = __webpack_require__("./node_modules/JsBarcode/bin/help/linearizeEncodings.js");

var _linearizeEncodings2 = _interopRequireDefault(_linearizeEncodings);

var _fixOptions = __webpack_require__("./node_modules/JsBarcode/bin/help/fixOptions.js");

var _fixOptions2 = _interopRequireDefault(_fixOptions);

var _getRenderProperties = __webpack_require__("./node_modules/JsBarcode/bin/help/getRenderProperties.js");

var _getRenderProperties2 = _interopRequireDefault(_getRenderProperties);

var _optionsFromStrings = __webpack_require__("./node_modules/JsBarcode/bin/help/optionsFromStrings.js");

var _optionsFromStrings2 = _interopRequireDefault(_optionsFromStrings);

var _ErrorHandler = __webpack_require__("./node_modules/JsBarcode/bin/exceptions/ErrorHandler.js");

var _ErrorHandler2 = _interopRequireDefault(_ErrorHandler);

var _exceptions = __webpack_require__("./node_modules/JsBarcode/bin/exceptions/exceptions.js");

var _defaults = __webpack_require__("./node_modules/JsBarcode/bin/options/defaults.js");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The protype of the object returned from the JsBarcode() call


// Help functions
var API = function API() {};

// The first call of the library API
// Will return an object with all barcodes calls and the data that is used
// by the renderers


// Default values


// Exceptions
// Import all the barcodes
var JsBarcode = function JsBarcode(element, text, options) {
	var api = new API();

	if (typeof element === "undefined") {
		throw Error("No element to render on was provided.");
	}

	// Variables that will be pased through the API calls
	api._renderProperties = (0, _getRenderProperties2.default)(element);
	api._encodings = [];
	api._options = _defaults2.default;
	api._errorHandler = new _ErrorHandler2.default(api);

	// If text is set, use the simple syntax (render the barcode directly)
	if (typeof text !== "undefined") {
		options = options || {};

		if (!options.format) {
			options.format = autoSelectBarcode();
		}

		api.options(options)[options.format](text, options).render();
	}

	return api;
};

// To make tests work TODO: remove
JsBarcode.getModule = function (name) {
	return _barcodes2.default[name];
};

// Register all barcodes
for (var name in _barcodes2.default) {
	if (_barcodes2.default.hasOwnProperty(name)) {
		// Security check if the propery is a prototype property
		registerBarcode(_barcodes2.default, name);
	}
}
function registerBarcode(barcodes, name) {
	API.prototype[name] = API.prototype[name.toUpperCase()] = API.prototype[name.toLowerCase()] = function (text, options) {
		var api = this;
		return api._errorHandler.wrapBarcodeCall(function () {
			var newOptions = (0, _merge2.default)(api._options, options);
			newOptions = (0, _optionsFromStrings2.default)(newOptions);
			var Encoder = barcodes[name];
			var encoded = encode(text, Encoder, newOptions);
			api._encodings.push(encoded);

			return api;
		});
	};
}

// encode() handles the Encoder call and builds the binary string to be rendered
function encode(text, Encoder, options) {
	// Ensure that text is a string
	text = "" + text;

	var encoder = new Encoder(text, options);

	// If the input is not valid for the encoder, throw error.
	// If the valid callback option is set, call it instead of throwing error
	if (!encoder.valid()) {
		throw new _exceptions.InvalidInputException(encoder.constructor.name, text);
	}

	// Make a request for the binary data (and other infromation) that should be rendered
	var encoded = encoder.encode();

	// Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
	// Convert to [1-1, 1-2, 2, 3-1, 3-2]
	encoded = (0, _linearizeEncodings2.default)(encoded);

	// Merge
	for (var i = 0; i < encoded.length; i++) {
		encoded[i].options = (0, _merge2.default)(options, encoded[i].options);
	}

	return encoded;
}

function autoSelectBarcode() {
	// If CODE128 exists. Use it
	if (_barcodes2.default["CODE128"]) {
		return "CODE128";
	}

	// Else, take the first (probably only) barcode
	return Object.keys(_barcodes2.default)[0];
}

// Sets global encoder options
// Added to the api by the JsBarcode function
API.prototype.options = function (options) {
	this._options = (0, _merge2.default)(this._options, options);
	return this;
};

// Will create a blank space (usually in between barcodes)
API.prototype.blank = function (size) {
	var zeroes = "0".repeat(size);
	this._encodings.push({ data: zeroes });
	return this;
};

// Initialize JsBarcode on all HTML elements defined.
API.prototype.init = function () {
	// Should do nothing if no elements where found
	if (!this._renderProperties) {
		return;
	}

	// Make sure renderProperies is an array
	if (!Array.isArray(this._renderProperties)) {
		this._renderProperties = [this._renderProperties];
	}

	var renderProperty;
	for (var i in this._renderProperties) {
		renderProperty = this._renderProperties[i];
		var options = (0, _merge2.default)(this._options, renderProperty.options);

		if (options.format == "auto") {
			options.format = autoSelectBarcode();
		}

		var text = options.value;

		var Encoder = _barcodes2.default[options.format.toUpperCase()];

		var encoded = encode(text, Encoder, options);

		render(renderProperty, encoded, options);
	}
};

// The render API call. Calls the real render function.
API.prototype.render = function () {
	if (!this._renderProperties) {
		throw new _exceptions.NoElementException();
	}

	if (Array.isArray(this._renderProperties)) {
		for (var i = 0; i < this._renderProperties.length; i++) {
			render(this._renderProperties[i], this._encodings, this._options);
		}
	} else {
		render(this._renderProperties, this._encodings, this._options);
	}

	return this;
};

API.prototype._defaults = _defaults2.default;

// Prepares the encodings and calls the renderer
function render(renderProperties, encodings, options) {
	encodings = (0, _linearizeEncodings2.default)(encodings);

	for (var i = 0; i < encodings.length; i++) {
		encodings[i].options = (0, _merge2.default)(options, encodings[i].options);
		(0, _fixOptions2.default)(encodings[i].options);
	}

	(0, _fixOptions2.default)(options);

	var Renderer = renderProperties.renderer;
	var renderer = new Renderer(renderProperties.element, encodings, options);
	renderer.render();

	if (renderProperties.afterRender) {
		renderProperties.afterRender();
	}
}

// Export to browser
if (typeof window !== "undefined") {
	window.JsBarcode = JsBarcode;
}

// Export to jQuery
/*global jQuery */
if (typeof jQuery !== 'undefined') {
	jQuery.fn.JsBarcode = function (content, options) {
		var elementArray = [];
		jQuery(this).each(function () {
			elementArray.push(this);
		});
		return JsBarcode(elementArray, content, options);
	};
}

// Export to commonJS
module.exports = JsBarcode;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/Barcode.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Barcode = function Barcode(data, options) {
	_classCallCheck(this, Barcode);

	this.data = data;
	this.text = options.text || data;
	this.options = options;
};

exports.default = Barcode;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // This is the master class, it does require the start code to be
// included in the string

var CODE128 = function (_Barcode) {
	_inherits(CODE128, _Barcode);

	function CODE128(data, options) {
		_classCallCheck(this, CODE128);

		// Fill the bytes variable with the ascii codes of string
		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data.substring(1), options));

		_this.bytes = [];
		for (var i = 0; i < data.length; ++i) {
			_this.bytes.push(data.charCodeAt(i));
		}

		// Data for each character, the last characters will not be encoded but are used for error correction
		// Numbers encode to (n + 1000) -> binary; 740 -> (740 + 1000).toString(2) -> "11011001100"
		_this.encodings = [// + 1000
		740, 644, 638, 176, 164, 100, 224, 220, 124, 608, 604, 572, 436, 244, 230, 484, 260, 254, 650, 628, 614, 764, 652, 902, 868, 836, 830, 892, 844, 842, 752, 734, 590, 304, 112, 94, 416, 128, 122, 672, 576, 570, 464, 422, 134, 496, 478, 142, 910, 678, 582, 768, 762, 774, 880, 862, 814, 896, 890, 818, 914, 602, 930, 328, 292, 200, 158, 68, 62, 424, 412, 232, 218, 76, 74, 554, 616, 978, 556, 146, 340, 212, 182, 508, 268, 266, 956, 940, 938, 758, 782, 974, 400, 310, 118, 512, 506, 960, 954, 502, 518, 886, 966, /* Start codes */668, 680, 692, 5379];
		return _this;
	}

	// The public encoding function


	CODE128.prototype.encode = function encode() {
		var encodingResult;
		var bytes = this.bytes;
		// Remove the startcode from the bytes and set its index
		var startIndex = bytes.shift() - 105;

		// Start encode with the right type
		if (startIndex === 103) {
			encodingResult = this.nextA(bytes, 1);
		} else if (startIndex === 104) {
			encodingResult = this.nextB(bytes, 1);
		} else if (startIndex === 105) {
			encodingResult = this.nextC(bytes, 1);
		}

		return {
			text: this.text == this.data ? this.text.replace(/[^\x20-\x7E]/g, "") : this.text,
			data:
			// Add the start bits
			this.getEncoding(startIndex) +
			// Add the encoded bits
			encodingResult.result +
			// Add the checksum
			this.getEncoding((encodingResult.checksum + startIndex) % 103) +
			// Add the end bits
			this.getEncoding(106)
		};
	};

	CODE128.prototype.getEncoding = function getEncoding(n) {
		return this.encodings[n] ? (this.encodings[n] + 1000).toString(2) : '';
	};

	// Use the regexp variable for validation


	CODE128.prototype.valid = function valid() {
		// ASCII value ranges 0-127, 200-211
		return this.data.search(/^[\x00-\x7F\xC8-\xD3]+$/) !== -1;
	};

	CODE128.prototype.nextA = function nextA(bytes, depth) {
		if (bytes.length <= 0) {
			return { "result": "", "checksum": 0 };
		}

		var next, index;

		// Special characters
		if (bytes[0] >= 200) {
			index = bytes[0] - 105;

			// Remove first element
			bytes.shift();

			// Swap to CODE128C
			if (index === 99) {
				next = this.nextC(bytes, depth + 1);
			}
			// Swap to CODE128B
			else if (index === 100) {
					next = this.nextB(bytes, depth + 1);
				}
				// Shift
				else if (index === 98) {
						// Convert the next character so that is encoded correctly
						bytes[0] = bytes[0] > 95 ? bytes[0] - 96 : bytes[0];
						next = this.nextA(bytes, depth + 1);
					}
					// Continue on CODE128A but encode a special character
					else {
							next = this.nextA(bytes, depth + 1);
						}
		}
		// Continue encoding of CODE128A
		else {
				var charCode = bytes[0];
				index = charCode < 32 ? charCode + 64 : charCode - 32;

				// Remove first element
				bytes.shift();

				next = this.nextA(bytes, depth + 1);
			}

		// Get the correct binary encoding and calculate the weight
		var enc = this.getEncoding(index);
		var weight = index * depth;

		return {
			"result": enc + next.result,
			"checksum": weight + next.checksum
		};
	};

	CODE128.prototype.nextB = function nextB(bytes, depth) {
		if (bytes.length <= 0) {
			return { "result": "", "checksum": 0 };
		}

		var next, index;

		// Special characters
		if (bytes[0] >= 200) {
			index = bytes[0] - 105;

			// Remove first element
			bytes.shift();

			// Swap to CODE128C
			if (index === 99) {
				next = this.nextC(bytes, depth + 1);
			}
			// Swap to CODE128A
			else if (index === 101) {
					next = this.nextA(bytes, depth + 1);
				}
				// Shift
				else if (index === 98) {
						// Convert the next character so that is encoded correctly
						bytes[0] = bytes[0] < 32 ? bytes[0] + 96 : bytes[0];
						next = this.nextB(bytes, depth + 1);
					}
					// Continue on CODE128B but encode a special character
					else {
							next = this.nextB(bytes, depth + 1);
						}
		}
		// Continue encoding of CODE128B
		else {
				index = bytes[0] - 32;
				bytes.shift();
				next = this.nextB(bytes, depth + 1);
			}

		// Get the correct binary encoding and calculate the weight
		var enc = this.getEncoding(index);
		var weight = index * depth;

		return { "result": enc + next.result, "checksum": weight + next.checksum };
	};

	CODE128.prototype.nextC = function nextC(bytes, depth) {
		if (bytes.length <= 0) {
			return { "result": "", "checksum": 0 };
		}

		var next, index;

		// Special characters
		if (bytes[0] >= 200) {
			index = bytes[0] - 105;

			// Remove first element
			bytes.shift();

			// Swap to CODE128B
			if (index === 100) {
				next = this.nextB(bytes, depth + 1);
			}
			// Swap to CODE128A
			else if (index === 101) {
					next = this.nextA(bytes, depth + 1);
				}
				// Continue on CODE128C but encode a special character
				else {
						next = this.nextC(bytes, depth + 1);
					}
		}
		// Continue encoding of CODE128C
		else {
				index = (bytes[0] - 48) * 10 + bytes[1] - 48;
				bytes.shift();
				bytes.shift();
				next = this.nextC(bytes, depth + 1);
			}

		// Get the correct binary encoding and calculate the weight
		var enc = this.getEncoding(index);
		var weight = index * depth;

		return { "result": enc + next.result, "checksum": weight + next.checksum };
	};

	return CODE128;
}(_Barcode3.default);

exports.default = CODE128;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128A.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128A = function (_CODE) {
	_inherits(CODE128A, _CODE);

	function CODE128A(string, options) {
		_classCallCheck(this, CODE128A);

		return _possibleConstructorReturn(this, _CODE.call(this, String.fromCharCode(208) + string, options));
	}

	CODE128A.prototype.valid = function valid() {
		return this.data.search(/^[\x00-\x5F\xC8-\xCF]+$/) !== -1;
	};

	return CODE128A;
}(_CODE3.default);

exports.default = CODE128A;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128B.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128B = function (_CODE) {
	_inherits(CODE128B, _CODE);

	function CODE128B(string, options) {
		_classCallCheck(this, CODE128B);

		return _possibleConstructorReturn(this, _CODE.call(this, String.fromCharCode(209) + string, options));
	}

	CODE128B.prototype.valid = function valid() {
		return this.data.search(/^[\x20-\x7F\xC8-\xCF]+$/) !== -1;
	};

	return CODE128B;
}(_CODE3.default);

exports.default = CODE128B;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128C.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128C = function (_CODE) {
	_inherits(CODE128C, _CODE);

	function CODE128C(string, options) {
		_classCallCheck(this, CODE128C);

		return _possibleConstructorReturn(this, _CODE.call(this, String.fromCharCode(210) + string, options));
	}

	CODE128C.prototype.valid = function valid() {
		return this.data.search(/^(\xCF*[0-9]{2}\xCF*)+$/) !== -1;
	};

	return CODE128C;
}(_CODE3.default);

exports.default = CODE128C;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128_AUTO.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128.js");

var _CODE3 = _interopRequireDefault(_CODE2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CODE128AUTO = function (_CODE) {
	_inherits(CODE128AUTO, _CODE);

	function CODE128AUTO(data, options) {
		_classCallCheck(this, CODE128AUTO);

		// ASCII value ranges 0-127, 200-211
		if (data.search(/^[\x00-\x7F\xC8-\xD3]+$/) !== -1) {
			var _this = _possibleConstructorReturn(this, _CODE.call(this, autoSelectModes(data), options));
		} else {
			var _this = _possibleConstructorReturn(this, _CODE.call(this, data, options));
		}
		return _possibleConstructorReturn(_this);
	}

	return CODE128AUTO;
}(_CODE3.default);

function autoSelectModes(string) {
	// ASCII ranges 0-98 and 200-207 (FUNCs and SHIFTs)
	var aLength = string.match(/^[\x00-\x5F\xC8-\xCF]*/)[0].length;
	// ASCII ranges 32-127 and 200-207 (FUNCs and SHIFTs)
	var bLength = string.match(/^[\x20-\x7F\xC8-\xCF]*/)[0].length;
	// Number pairs or [FNC1]
	var cLength = string.match(/^(\xCF*[0-9]{2}\xCF*)*/)[0].length;

	var newString;
	// Select CODE128C if the string start with enough digits
	if (cLength >= 2) {
		newString = String.fromCharCode(210) + autoSelectFromC(string);
	}
	// Select A/C depending on the longest match
	else if (aLength > bLength) {
			newString = String.fromCharCode(208) + autoSelectFromA(string);
		} else {
			newString = String.fromCharCode(209) + autoSelectFromB(string);
		}

	newString = newString.replace(/[\xCD\xCE]([^])[\xCD\xCE]/, function (match, char) {
		return String.fromCharCode(203) + char;
	});

	return newString;
}

function autoSelectFromA(string) {
	var untilC = string.match(/^([\x00-\x5F\xC8-\xCF]+?)(([0-9]{2}){2,})([^0-9]|$)/);

	if (untilC) {
		return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
	}

	var aChars = string.match(/^[\x00-\x5F\xC8-\xCF]+/);
	if (aChars[0].length === string.length) {
		return string;
	}

	return aChars[0] + String.fromCharCode(205) + autoSelectFromB(string.substring(aChars[0].length));
}

function autoSelectFromB(string) {
	var untilC = string.match(/^([\x20-\x7F\xC8-\xCF]+?)(([0-9]{2}){2,})([^0-9]|$)/);

	if (untilC) {
		return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
	}

	var bChars = string.match(/^[\x20-\x7F\xC8-\xCF]+/);
	if (bChars[0].length === string.length) {
		return string;
	}

	return bChars[0] + String.fromCharCode(206) + autoSelectFromA(string.substring(bChars[0].length));
}

function autoSelectFromC(string) {
	var cMatch = string.match(/^(\xCF*[0-9]{2}\xCF*)+/)[0];
	var length = cMatch.length;

	if (length === string.length) {
		return string;
	}

	string = string.substring(length);

	// Select A/B depending on the longest match
	var aLength = string.match(/^[\x00-\x5F\xC8-\xCF]*/)[0].length;
	var bLength = string.match(/^[\x20-\x7F\xC8-\xCF]*/)[0].length;
	if (aLength >= bLength) {
		return cMatch + String.fromCharCode(206) + autoSelectFromA(string);
	} else {
		return cMatch + String.fromCharCode(205) + autoSelectFromB(string);
	}
}

exports.default = CODE128AUTO;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE128/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CODE128C = exports.CODE128B = exports.CODE128A = exports.CODE128 = undefined;

var _CODE128_AUTO = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128_AUTO.js");

var _CODE128_AUTO2 = _interopRequireDefault(_CODE128_AUTO);

var _CODE128A = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128A.js");

var _CODE128A2 = _interopRequireDefault(_CODE128A);

var _CODE128B = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128B.js");

var _CODE128B2 = _interopRequireDefault(_CODE128B);

var _CODE128C = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/CODE128C.js");

var _CODE128C2 = _interopRequireDefault(_CODE128C);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CODE128 = _CODE128_AUTO2.default;
exports.CODE128A = _CODE128A2.default;
exports.CODE128B = _CODE128B2.default;
exports.CODE128C = _CODE128C2.default;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/CODE39/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CODE39 = undefined;

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/Code_39#Encoding

var CODE39 = function (_Barcode) {
	_inherits(CODE39, _Barcode);

	function CODE39(data, options) {
		_classCallCheck(this, CODE39);

		data = data.toUpperCase();

		// Calculate mod43 checksum if enabled
		if (options.mod43) {
			data += getCharacter(mod43checksum(data));
		}

		return _possibleConstructorReturn(this, _Barcode.call(this, data, options));
	}

	CODE39.prototype.encode = function encode() {
		// First character is always a *
		var result = getEncoding("*");

		// Take every character and add the binary representation to the result
		for (var i = 0; i < this.data.length; i++) {
			result += getEncoding(this.data[i]) + "0";
		}

		// Last character is always a *
		result += getEncoding("*");

		return {
			data: result,
			text: this.text
		};
	};

	CODE39.prototype.valid = function valid() {
		return this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) !== -1;
	};

	return CODE39;
}(_Barcode3.default);

// All characters. The position in the array is the (checksum) value


var characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "*"];

// The decimal representation of the characters, is converted to the
// corresponding binary with the getEncoding function
var encodings = [20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645, 29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301, 30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385, 29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477, 17489, 17681, 20753, 35770];

// Get the binary representation of a character by converting the encodings
// from decimal to binary
function getEncoding(character) {
	return getBinary(characterValue(character));
}

function getBinary(characterValue) {
	return encodings[characterValue].toString(2);
}

function getCharacter(characterValue) {
	return characters[characterValue];
}

function characterValue(character) {
	return characters.indexOf(character);
}

function mod43checksum(data) {
	var checksum = 0;
	for (var i = 0; i < data.length; i++) {
		checksum += characterValue(data[i]);
	}

	checksum = checksum % 43;
	return checksum;
}

exports.CODE39 = CODE39;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN13.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ean_encoder = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/ean_encoder.js");

var _ean_encoder2 = _interopRequireDefault(_ean_encoder);

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Binary_encoding_of_data_digits_into_EAN-13_barcode

var EAN13 = function (_Barcode) {
	_inherits(EAN13, _Barcode);

	function EAN13(data, options) {
		_classCallCheck(this, EAN13);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{12}$/) !== -1) {
			data += checksum(data);
		}

		// Make sure the font is not bigger than the space between the guard bars
		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		if (!options.flat && options.fontSize > options.width * 10) {
			_this.fontSize = options.width * 10;
		} else {
			_this.fontSize = options.fontSize;
		}

		// Make the guard bars go down half the way of the text
		_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;

		// Adds a last character to the end of the barcode
		_this.lastChar = options.lastChar;
		return _this;
	}

	EAN13.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{13}$/) !== -1 && this.data[12] == checksum(this.data);
	};

	EAN13.prototype.encode = function encode() {
		if (this.options.flat) {
			return this.flatEncoding();
		} else {
			return this.guardedEncoding();
		}
	};

	// Define the EAN-13 structure


	EAN13.prototype.getStructure = function getStructure() {
		return ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];
	};

	// The "standard" way of printing EAN13 barcodes with guard bars


	EAN13.prototype.guardedEncoding = function guardedEncoding() {
		var encoder = new _ean_encoder2.default();
		var result = [];

		var structure = this.getStructure()[this.data[0]];

		// Get the string to be encoded on the left side of the EAN code
		var leftSide = this.data.substr(1, 6);

		// Get the string to be encoded on the right side of the EAN code
		var rightSide = this.data.substr(7, 6);

		// Add the first digigt
		if (this.options.displayValue) {
			result.push({
				data: "000000000000",
				text: this.text.substr(0, 1),
				options: { textAlign: "left", fontSize: this.fontSize }
			});
		}

		// Add the guard bars
		result.push({
			data: "101",
			options: { height: this.guardHeight }
		});

		// Add the left side
		result.push({
			data: encoder.encode(leftSide, structure),
			text: this.text.substr(1, 6),
			options: { fontSize: this.fontSize }
		});

		// Add the middle bits
		result.push({
			data: "01010",
			options: { height: this.guardHeight }
		});

		// Add the right side
		result.push({
			data: encoder.encode(rightSide, "RRRRRR"),
			text: this.text.substr(7, 6),
			options: { fontSize: this.fontSize }
		});

		// Add the end bits
		result.push({
			data: "101",
			options: { height: this.guardHeight }
		});

		if (this.options.lastChar && this.options.displayValue) {
			result.push({ data: "00" });

			result.push({
				data: "00000",
				text: this.options.lastChar,
				options: { fontSize: this.fontSize }
			});
		}
		return result;
	};

	EAN13.prototype.flatEncoding = function flatEncoding() {
		var encoder = new _ean_encoder2.default();
		var result = "";

		var structure = this.getStructure()[this.data[0]];

		result += "101";
		result += encoder.encode(this.data.substr(1, 6), structure);
		result += "01010";
		result += encoder.encode(this.data.substr(7, 6), "RRRRRR");
		result += "101";

		return {
			data: result,
			text: this.text
		};
	};

	return EAN13;
}(_Barcode3.default);

// Calulate the checksum digit
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Calculation_of_checksum_digit


function checksum(number) {
	var result = 0;

	var i;
	for (i = 0; i < 12; i += 2) {
		result += parseInt(number[i]);
	}
	for (i = 1; i < 12; i += 2) {
		result += parseInt(number[i]) * 3;
	}

	return (10 - result % 10) % 10;
}

exports.default = EAN13;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN2.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ean_encoder = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/ean_encoder.js");

var _ean_encoder2 = _interopRequireDefault(_ean_encoder);

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/EAN_2#Encoding

var EAN2 = function (_Barcode) {
	_inherits(EAN2, _Barcode);

	function EAN2(data, options) {
		_classCallCheck(this, EAN2);

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.structure = ["LL", "LG", "GL", "GG"];
		return _this;
	}

	EAN2.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{2}$/) !== -1;
	};

	EAN2.prototype.encode = function encode() {
		var encoder = new _ean_encoder2.default();

		// Choose the structure based on the number mod 4
		var structure = this.structure[parseInt(this.data) % 4];

		// Start bits
		var result = "1011";

		// Encode the two digits with 01 in between
		result += encoder.encode(this.data, structure, "01");

		return {
			data: result,
			text: this.text
		};
	};

	return EAN2;
}(_Barcode3.default);

exports.default = EAN2;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN5.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ean_encoder = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/ean_encoder.js");

var _ean_encoder2 = _interopRequireDefault(_ean_encoder);

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/EAN_5#Encoding

var EAN5 = function (_Barcode) {
	_inherits(EAN5, _Barcode);

	function EAN5(data, options) {
		_classCallCheck(this, EAN5);

		// Define the EAN-13 structure
		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.structure = ["GGLLL", "GLGLL", "GLLGL", "GLLLG", "LGGLL", "LLGGL", "LLLGG", "LGLGL", "LGLLG", "LLGLG"];
		return _this;
	}

	EAN5.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{5}$/) !== -1;
	};

	EAN5.prototype.encode = function encode() {
		var encoder = new _ean_encoder2.default();
		var checksum = this.checksum();

		// Start bits
		var result = "1011";

		// Use normal ean encoding with 01 in between all digits
		result += encoder.encode(this.data, this.structure[checksum], "01");

		return {
			data: result,
			text: this.text
		};
	};

	EAN5.prototype.checksum = function checksum() {
		var result = 0;

		result += parseInt(this.data[0]) * 3;
		result += parseInt(this.data[1]) * 9;
		result += parseInt(this.data[2]) * 3;
		result += parseInt(this.data[3]) * 9;
		result += parseInt(this.data[4]) * 3;

		return result % 10;
	};

	return EAN5;
}(_Barcode3.default);

exports.default = EAN5;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN8.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ean_encoder = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/ean_encoder.js");

var _ean_encoder2 = _interopRequireDefault(_ean_encoder);

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// http://www.barcodeisland.com/ean8.phtml

var EAN8 = function (_Barcode) {
	_inherits(EAN8, _Barcode);

	function EAN8(data, options) {
		_classCallCheck(this, EAN8);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{7}$/) !== -1) {
			data += checksum(data);
		}

		return _possibleConstructorReturn(this, _Barcode.call(this, data, options));
	}

	EAN8.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{8}$/) !== -1 && this.data[7] == checksum(this.data);
	};

	EAN8.prototype.encode = function encode() {
		var encoder = new _ean_encoder2.default();

		// Create the return variable
		var result = "";

		// Get the number to be encoded on the left side of the EAN code
		var leftSide = this.data.substr(0, 4);

		// Get the number to be encoded on the right side of the EAN code
		var rightSide = this.data.substr(4, 4);

		// Add the start bits
		result += encoder.startBin;

		// Add the left side
		result += encoder.encode(leftSide, "LLLL");

		// Add the middle bits
		result += encoder.middleBin;

		// Add the right side
		result += encoder.encode(rightSide, "RRRR");

		// Add the end bits
		result += encoder.endBin;

		return {
			data: result,
			text: this.text
		};
	};

	return EAN8;
}(_Barcode3.default);

// Calulate the checksum digit


function checksum(number) {
	var result = 0;

	var i;
	for (i = 0; i < 7; i += 2) {
		result += parseInt(number[i]) * 3;
	}

	for (i = 1; i < 7; i += 2) {
		result += parseInt(number[i]);
	}

	return (10 - result % 10) % 10;
}

exports.default = EAN8;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/UPC.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ean_encoder = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/ean_encoder.js");

var _ean_encoder2 = _interopRequireDefault(_ean_encoder);

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding

var UPC = function (_Barcode) {
	_inherits(UPC, _Barcode);

	function UPC(data, options) {
		_classCallCheck(this, UPC);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{11}$/) !== -1) {
			data += checksum(data);
		}

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.displayValue = options.displayValue;

		// Make sure the font is not bigger than the space between the guard bars
		if (options.fontSize > options.width * 10) {
			_this.fontSize = options.width * 10;
		} else {
			_this.fontSize = options.fontSize;
		}

		// Make the guard bars go down half the way of the text
		_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
		return _this;
	}

	UPC.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == checksum(this.data);
	};

	UPC.prototype.encode = function encode() {
		if (this.options.flat) {
			return this.flatEncoding();
		} else {
			return this.guardedEncoding();
		}
	};

	UPC.prototype.flatEncoding = function flatEncoding() {
		var encoder = new _ean_encoder2.default();
		var result = "";

		result += "101";
		result += encoder.encode(this.data.substr(0, 6), "LLLLLL");
		result += "01010";
		result += encoder.encode(this.data.substr(6, 6), "RRRRRR");
		result += "101";

		return {
			data: result,
			text: this.text
		};
	};

	UPC.prototype.guardedEncoding = function guardedEncoding() {
		var encoder = new _ean_encoder2.default();
		var result = [];

		// Add the first digigt
		if (this.displayValue) {
			result.push({
				data: "00000000",
				text: this.text.substr(0, 1),
				options: { textAlign: "left", fontSize: this.fontSize }
			});
		}

		// Add the guard bars
		result.push({
			data: "101" + encoder.encode(this.data[0], "L"),
			options: { height: this.guardHeight }
		});

		// Add the left side
		result.push({
			data: encoder.encode(this.data.substr(1, 5), "LLLLL"),
			text: this.text.substr(1, 5),
			options: { fontSize: this.fontSize }
		});

		// Add the middle bits
		result.push({
			data: "01010",
			options: { height: this.guardHeight }
		});

		// Add the right side
		result.push({
			data: encoder.encode(this.data.substr(6, 5), "RRRRR"),
			text: this.text.substr(6, 5),
			options: { fontSize: this.fontSize }
		});

		// Add the end bits
		result.push({
			data: encoder.encode(this.data[11], "R") + "101",
			options: { height: this.guardHeight }
		});

		// Add the last digit
		if (this.displayValue) {
			result.push({
				data: "00000000",
				text: this.text.substr(11, 1),
				options: { textAlign: "right", fontSize: this.fontSize }
			});
		}

		return result;
	};

	return UPC;
}(_Barcode3.default);

// Calulate the checksum digit
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Calculation_of_checksum_digit


function checksum(number) {
	var result = 0;

	var i;
	for (i = 1; i < 11; i += 2) {
		result += parseInt(number[i]);
	}
	for (i = 0; i < 11; i += 2) {
		result += parseInt(number[i]) * 3;
	}

	return (10 - result % 10) % 10;
}

exports.default = UPC;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/ean_encoder.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EANencoder = function () {
	function EANencoder() {
		_classCallCheck(this, EANencoder);

		// Standard start end and middle bits
		this.startBin = "101";
		this.endBin = "101";
		this.middleBin = "01010";

		// The L (left) type of encoding
		this.Lbinary = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];

		// The G type of encoding
		this.Gbinary = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];

		// The R (right) type of encoding
		this.Rbinary = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
	}

	// Convert a numberarray to the representing


	EANencoder.prototype.encode = function encode(number, structure, separator) {
		// Create the variable that should be returned at the end of the function
		var result = "";

		// Make sure that the separator is set
		separator = separator || "";

		// Loop all the numbers
		for (var i = 0; i < number.length; i++) {
			// Using the L, G or R encoding and add it to the returning variable
			if (structure[i] == "L") {
				result += this.Lbinary[number[i]];
			} else if (structure[i] == "G") {
				result += this.Gbinary[number[i]];
			} else if (structure[i] == "R") {
				result += this.Rbinary[number[i]];
			}

			// Add separator in between encodings
			if (i < number.length - 1) {
				result += separator;
			}
		}
		return result;
	};

	return EANencoder;
}();

exports.default = EANencoder;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/EAN_UPC/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPC = exports.EAN2 = exports.EAN5 = exports.EAN8 = exports.EAN13 = undefined;

var _EAN = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN13.js");

var _EAN2 = _interopRequireDefault(_EAN);

var _EAN3 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN8.js");

var _EAN4 = _interopRequireDefault(_EAN3);

var _EAN5 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN5.js");

var _EAN6 = _interopRequireDefault(_EAN5);

var _EAN7 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/EAN2.js");

var _EAN8 = _interopRequireDefault(_EAN7);

var _UPC = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/UPC.js");

var _UPC2 = _interopRequireDefault(_UPC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EAN13 = _EAN2.default;
exports.EAN8 = _EAN4.default;
exports.EAN5 = _EAN6.default;
exports.EAN2 = _EAN8.default;
exports.UPC = _UPC2.default;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/GenericBarcode/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GenericBarcode = undefined;

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericBarcode = function (_Barcode) {
	_inherits(GenericBarcode, _Barcode);

	function GenericBarcode(data, options) {
		_classCallCheck(this, GenericBarcode);

		return _possibleConstructorReturn(this, _Barcode.call(this, data, options)); // Sets this.data and this.text
	}

	// Return the corresponding binary numbers for the data provided


	GenericBarcode.prototype.encode = function encode() {
		return {
			data: "10101010101010101010101010101010101010101",
			text: this.text
		};
	};

	// Resturn true/false if the string provided is valid for this encoder


	GenericBarcode.prototype.valid = function valid() {
		return true;
	};

	return GenericBarcode;
}(_Barcode3.default);

exports.GenericBarcode = GenericBarcode;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/ITF/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ITF = undefined;

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITF = function (_Barcode) {
	_inherits(ITF, _Barcode);

	function ITF(data, options) {
		_classCallCheck(this, ITF);

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.binaryRepresentation = {
			"0": "00110",
			"1": "10001",
			"2": "01001",
			"3": "11000",
			"4": "00101",
			"5": "10100",
			"6": "01100",
			"7": "00011",
			"8": "10010",
			"9": "01010"
		};
		return _this;
	}

	ITF.prototype.valid = function valid() {
		return this.data.search(/^([0-9]{2})+$/) !== -1;
	};

	ITF.prototype.encode = function encode() {
		// Always add the same start bits
		var result = "1010";

		// Calculate all the digit pairs
		for (var i = 0; i < this.data.length; i += 2) {
			result += this.calculatePair(this.data.substr(i, 2));
		}

		// Always add the same end bits
		result += "11101";

		return {
			data: result,
			text: this.text
		};
	};

	// Calculate the data of a number pair


	ITF.prototype.calculatePair = function calculatePair(numberPair) {
		var result = "";

		var number1Struct = this.binaryRepresentation[numberPair[0]];
		var number2Struct = this.binaryRepresentation[numberPair[1]];

		// Take every second bit and add to the result
		for (var i = 0; i < 5; i++) {
			result += number1Struct[i] == "1" ? "111" : "1";
			result += number2Struct[i] == "1" ? "000" : "0";
		}

		return result;
	};

	return ITF;
}(_Barcode3.default);

exports.ITF = ITF;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/ITF14/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ITF14 = undefined;

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITF14 = function (_Barcode) {
	_inherits(ITF14, _Barcode);

	function ITF14(data, options) {
		_classCallCheck(this, ITF14);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{13}$/) !== -1) {
			data += checksum(data);
		}

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.binaryRepresentation = {
			"0": "00110",
			"1": "10001",
			"2": "01001",
			"3": "11000",
			"4": "00101",
			"5": "10100",
			"6": "01100",
			"7": "00011",
			"8": "10010",
			"9": "01010"
		};
		return _this;
	}

	ITF14.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{14}$/) !== -1 && this.data[13] == checksum(this.data);
	};

	ITF14.prototype.encode = function encode() {
		var result = "1010";

		// Calculate all the digit pairs
		for (var i = 0; i < 14; i += 2) {
			result += this.calculatePair(this.data.substr(i, 2));
		}

		// Always add the same end bits
		result += "11101";

		return {
			data: result,
			text: this.text
		};
	};

	// Calculate the data of a number pair


	ITF14.prototype.calculatePair = function calculatePair(numberPair) {
		var result = "";

		var number1Struct = this.binaryRepresentation[numberPair[0]];
		var number2Struct = this.binaryRepresentation[numberPair[1]];

		// Take every second bit and add to the result
		for (var i = 0; i < 5; i++) {
			result += number1Struct[i] == "1" ? "111" : "1";
			result += number2Struct[i] == "1" ? "000" : "0";
		}

		return result;
	};

	return ITF14;
}(_Barcode3.default);

// Calulate the checksum digit


function checksum(data) {
	var result = 0;

	for (var i = 0; i < 13; i++) {
		result += parseInt(data[i]) * (3 - i % 2 * 2);
	}

	return Math.ceil(result / 10) * 10 - result;
}

exports.ITF14 = ITF14;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/MSI.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation
// https://en.wikipedia.org/wiki/MSI_Barcode#Character_set_and_binary_lookup

var MSI = function (_Barcode) {
	_inherits(MSI, _Barcode);

	function MSI(data, options) {
		_classCallCheck(this, MSI);

		return _possibleConstructorReturn(this, _Barcode.call(this, data, options));
	}

	MSI.prototype.encode = function encode() {
		// Start bits
		var ret = "110";

		for (var i = 0; i < this.data.length; i++) {
			// Convert the character to binary (always 4 binary digits)
			var digit = parseInt(this.data[i]);
			var bin = digit.toString(2);
			bin = addZeroes(bin, 4 - bin.length);

			// Add 100 for every zero and 110 for every 1
			for (var b = 0; b < bin.length; b++) {
				ret += bin[b] == "0" ? "100" : "110";
			}
		}

		// End bits
		ret += "1001";

		return {
			data: ret,
			text: this.text
		};
	};

	MSI.prototype.valid = function valid() {
		return this.data.search(/^[0-9]+$/) !== -1;
	};

	return MSI;
}(_Barcode3.default);

function addZeroes(number, n) {
	for (var i = 0; i < n; i++) {
		number = "0" + number;
	}
	return number;
}

exports.default = MSI;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/MSI10.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI10 = function (_MSI) {
	_inherits(MSI10, _MSI);

	function MSI10(data, options) {
		_classCallCheck(this, MSI10);

		return _possibleConstructorReturn(this, _MSI.call(this, data + (0, _checksums.mod10)(data), options));
	}

	return MSI10;
}(_MSI3.default);

exports.default = MSI10;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/MSI1010.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI1010 = function (_MSI) {
	_inherits(MSI1010, _MSI);

	function MSI1010(data, options) {
		_classCallCheck(this, MSI1010);

		data += (0, _checksums.mod10)(data);
		data += (0, _checksums.mod10)(data);
		return _possibleConstructorReturn(this, _MSI.call(this, data, options));
	}

	return MSI1010;
}(_MSI3.default);

exports.default = MSI1010;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/MSI11.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI11 = function (_MSI) {
	_inherits(MSI11, _MSI);

	function MSI11(data, options) {
		_classCallCheck(this, MSI11);

		return _possibleConstructorReturn(this, _MSI.call(this, data + (0, _checksums.mod11)(data), options));
	}

	return MSI11;
}(_MSI3.default);

exports.default = MSI11;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/MSI1110.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MSI2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI.js");

var _MSI3 = _interopRequireDefault(_MSI2);

var _checksums = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/checksums.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSI1110 = function (_MSI) {
	_inherits(MSI1110, _MSI);

	function MSI1110(data, options) {
		_classCallCheck(this, MSI1110);

		data += (0, _checksums.mod11)(data);
		data += (0, _checksums.mod10)(data);
		return _possibleConstructorReturn(this, _MSI.call(this, data, options));
	}

	return MSI1110;
}(_MSI3.default);

exports.default = MSI1110;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/checksums.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mod10 = mod10;
exports.mod11 = mod11;
function mod10(number) {
	var sum = 0;
	for (var i = 0; i < number.length; i++) {
		var n = parseInt(number[i]);
		if ((i + number.length) % 2 === 0) {
			sum += n;
		} else {
			sum += n * 2 % 10 + Math.floor(n * 2 / 10);
		}
	}
	return (10 - sum % 10) % 10;
}

function mod11(number) {
	var sum = 0;
	var weights = [2, 3, 4, 5, 6, 7];
	for (var i = 0; i < number.length; i++) {
		var n = parseInt(number[number.length - 1 - i]);
		sum += weights[i % weights.length] * n;
	}
	return (11 - sum % 11) % 11;
}

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/MSI/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MSI1110 = exports.MSI1010 = exports.MSI11 = exports.MSI10 = exports.MSI = undefined;

var _MSI = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI.js");

var _MSI2 = _interopRequireDefault(_MSI);

var _MSI3 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI10.js");

var _MSI4 = _interopRequireDefault(_MSI3);

var _MSI5 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI11.js");

var _MSI6 = _interopRequireDefault(_MSI5);

var _MSI7 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI1010.js");

var _MSI8 = _interopRequireDefault(_MSI7);

var _MSI9 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/MSI1110.js");

var _MSI10 = _interopRequireDefault(_MSI9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.MSI = _MSI2.default;
exports.MSI10 = _MSI4.default;
exports.MSI11 = _MSI6.default;
exports.MSI1010 = _MSI8.default;
exports.MSI1110 = _MSI10.default;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/codabar/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.codabar = undefined;

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding specification:
// http://www.barcodeisland.com/codabar.phtml

var codabar = function (_Barcode) {
	_inherits(codabar, _Barcode);

	function codabar(data, options) {
		_classCallCheck(this, codabar);

		if (data.search(/^[0-9\-\$\:\.\+\/]+$/) === 0) {
			data = "A" + data + "A";
		}

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data.toUpperCase(), options));

		_this.text = _this.options.text || _this.text.replace(/[A-D]/g, '');
		return _this;
	}

	codabar.prototype.valid = function valid() {
		return this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) !== -1;
	};

	codabar.prototype.encode = function encode() {
		var result = [];
		var encodings = this.getEncodings();
		for (var i = 0; i < this.data.length; i++) {
			result.push(encodings[this.data.charAt(i)]);
			// for all characters except the last, append a narrow-space ("0")
			if (i !== this.data.length - 1) {
				result.push("0");
			}
		}
		return {
			text: this.text,
			data: result.join('')
		};
	};

	codabar.prototype.getEncodings = function getEncodings() {
		return {
			"0": "101010011",
			"1": "101011001",
			"2": "101001011",
			"3": "110010101",
			"4": "101101001",
			"5": "110101001",
			"6": "100101011",
			"7": "100101101",
			"8": "100110101",
			"9": "110100101",
			"-": "101001101",
			"$": "101100101",
			":": "1101011011",
			"/": "1101101011",
			".": "1101101101",
			"+": "101100110011",
			"A": "1011001001",
			"B": "1010010011",
			"C": "1001001011",
			"D": "1010011001"
		};
	};

	return codabar;
}(_Barcode3.default);

exports.codabar = codabar;

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _CODE = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE39/index.js");

var _CODE2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/CODE128/index.js");

var _EAN_UPC = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/EAN_UPC/index.js");

var _ITF = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/ITF14/index.js");

var _ITF2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/ITF/index.js");

var _MSI = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/MSI/index.js");

var _pharmacode = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/pharmacode/index.js");

var _codabar = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/codabar/index.js");

var _GenericBarcode = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/GenericBarcode/index.js");

exports.default = {
	CODE39: _CODE.CODE39,
	CODE128: _CODE2.CODE128, CODE128A: _CODE2.CODE128A, CODE128B: _CODE2.CODE128B, CODE128C: _CODE2.CODE128C,
	EAN13: _EAN_UPC.EAN13, EAN8: _EAN_UPC.EAN8, EAN5: _EAN_UPC.EAN5, EAN2: _EAN_UPC.EAN2, UPC: _EAN_UPC.UPC,
	ITF14: _ITF.ITF14,
	ITF: _ITF2.ITF,
	MSI: _MSI.MSI, MSI10: _MSI.MSI10, MSI11: _MSI.MSI11, MSI1010: _MSI.MSI1010, MSI1110: _MSI.MSI1110,
	pharmacode: _pharmacode.pharmacode,
	codabar: _codabar.codabar,
	GenericBarcode: _GenericBarcode.GenericBarcode
};

/***/ },

/***/ "./node_modules/JsBarcode/bin/barcodes/pharmacode/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pharmacode = undefined;

var _Barcode2 = __webpack_require__("./node_modules/JsBarcode/bin/barcodes/Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation
// http://www.gomaro.ch/ftproot/Laetus_PHARMA-CODE.pdf

var pharmacode = function (_Barcode) {
	_inherits(pharmacode, _Barcode);

	function pharmacode(data, options) {
		_classCallCheck(this, pharmacode);

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.number = parseInt(data, 10);
		return _this;
	}

	pharmacode.prototype.encode = function encode() {
		var z = this.number;
		var result = "";

		// http://i.imgur.com/RMm4UDJ.png
		// (source: http://www.gomaro.ch/ftproot/Laetus_PHARMA-CODE.pdf, page: 34)
		while (!isNaN(z) && z != 0) {
			if (z % 2 === 0) {
				// Even
				result = "11100" + result;
				z = (z - 2) / 2;
			} else {
				// Odd
				result = "100" + result;
				z = (z - 1) / 2;
			}
		}

		// Remove the two last zeroes
		result = result.slice(0, -2);

		return {
			data: result,
			text: this.text
		};
	};

	pharmacode.prototype.valid = function valid() {
		return this.number >= 3 && this.number <= 131070;
	};

	return pharmacode;
}(_Barcode3.default);

exports.pharmacode = pharmacode;

/***/ },

/***/ "./node_modules/JsBarcode/bin/exceptions/ErrorHandler.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*eslint no-console: 0 */

var ErrorHandler = function () {
	function ErrorHandler(api) {
		_classCallCheck(this, ErrorHandler);

		this.api = api;
	}

	ErrorHandler.prototype.handleCatch = function handleCatch(e) {
		// If babel supported extending of Error in a correct way instanceof would be used here
		if (e.name === "InvalidInputException") {
			if (this.api._options.valid !== this.api._defaults.valid) {
				this.api._options.valid(false);
			} else {
				throw e.message;
			}
		} else {
			throw e;
		}

		this.api.render = function () {};
	};

	ErrorHandler.prototype.wrapBarcodeCall = function wrapBarcodeCall(func) {
		try {
			var result = func.apply(undefined, arguments);
			this.api._options.valid(true);
			return result;
		} catch (e) {
			this.handleCatch(e);

			return this.api;
		}
	};

	return ErrorHandler;
}();

exports.default = ErrorHandler;

/***/ },

/***/ "./node_modules/JsBarcode/bin/exceptions/exceptions.js":
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvalidInputException = function (_Error) {
	_inherits(InvalidInputException, _Error);

	function InvalidInputException(symbology, input) {
		_classCallCheck(this, InvalidInputException);

		var _this = _possibleConstructorReturn(this, _Error.call(this));

		_this.name = "InvalidInputException";

		_this.symbology = symbology;
		_this.input = input;

		_this.message = '"' + _this.input + '" is not a valid input for ' + _this.symbology;
		return _this;
	}

	return InvalidInputException;
}(Error);

var InvalidElementException = function (_Error2) {
	_inherits(InvalidElementException, _Error2);

	function InvalidElementException() {
		_classCallCheck(this, InvalidElementException);

		var _this2 = _possibleConstructorReturn(this, _Error2.call(this));

		_this2.name = "InvalidElementException";
		_this2.message = "Not supported type to render on";
		return _this2;
	}

	return InvalidElementException;
}(Error);

var NoElementException = function (_Error3) {
	_inherits(NoElementException, _Error3);

	function NoElementException() {
		_classCallCheck(this, NoElementException);

		var _this3 = _possibleConstructorReturn(this, _Error3.call(this));

		_this3.name = "NoElementException";
		_this3.message = "No element to render on.";
		return _this3;
	}

	return NoElementException;
}(Error);

exports.InvalidInputException = InvalidInputException;
exports.InvalidElementException = InvalidElementException;
exports.NoElementException = NoElementException;

/***/ },

/***/ "./node_modules/JsBarcode/bin/help/fixOptions.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = fixOptions;


function fixOptions(options) {
	// Fix the margins
	options.marginTop = options.marginTop || options.margin;
	options.marginBottom = options.marginBottom || options.margin;
	options.marginRight = options.marginRight || options.margin;
	options.marginLeft = options.marginLeft || options.margin;

	return options;
}

/***/ },

/***/ "./node_modules/JsBarcode/bin/help/getOptionsFromElement.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _optionsFromStrings = __webpack_require__("./node_modules/JsBarcode/bin/help/optionsFromStrings.js");

var _optionsFromStrings2 = _interopRequireDefault(_optionsFromStrings);

var _defaults = __webpack_require__("./node_modules/JsBarcode/bin/options/defaults.js");

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptionsFromElement(element) {
	var options = {};
	for (var property in _defaults2.default) {
		if (_defaults2.default.hasOwnProperty(property)) {
			// jsbarcode-*
			if (element.hasAttribute("jsbarcode-" + property.toLowerCase())) {
				options[property] = element.getAttribute("jsbarcode-" + property.toLowerCase());
			}

			// data-*
			if (element.hasAttribute("data-" + property.toLowerCase())) {
				options[property] = element.getAttribute("data-" + property.toLowerCase());
			}
		}
	}

	options["value"] = element.getAttribute("jsbarcode-value") || element.getAttribute("data-value");

	// Since all atributes are string they need to be converted to integers
	options = (0, _optionsFromStrings2.default)(options);

	return options;
}

exports.default = getOptionsFromElement;

/***/ },

/***/ "./node_modules/JsBarcode/bin/help/getRenderProperties.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getOptionsFromElement = __webpack_require__("./node_modules/JsBarcode/bin/help/getOptionsFromElement.js");

var _getOptionsFromElement2 = _interopRequireDefault(_getOptionsFromElement);

var _renderers = __webpack_require__("./node_modules/JsBarcode/bin/renderers/index.js");

var _exceptions = __webpack_require__("./node_modules/JsBarcode/bin/exceptions/exceptions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Takes an element and returns an object with information about how
// it should be rendered
// This could also return an array with these objects
// {
//   element: The element that the renderer should draw on
//   renderer: The name of the renderer
//   afterRender (optional): If something has to done after the renderer
//     completed, calls afterRender (function)
//   options (optional): Options that can be defined in the element
// }

function getRenderProperties(element) {
	// If the element is a string, query select call again
	if (typeof element === "string") {
		return querySelectedRenderProperties(element);
	}
	// If element is array. Recursivly call with every object in the array
	else if (Array.isArray(element)) {
			var returnArray = [];
			for (var i = 0; i < element.length; i++) {
				returnArray.push(getRenderProperties(element[i]));
			}
			return returnArray;
		}
		// If element, render on canvas and set the uri as src
		else if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLImageElement) {
				return newCanvasRenderProperties(element);
			}
			// If SVG
			else if (typeof SVGElement !== 'undefined' && element instanceof SVGElement) {
					return {
						element: element,
						options: (0, _getOptionsFromElement2.default)(element),
						renderer: (0, _renderers.getRendererClass)("svg")
					};
				}
				// If canvas (in browser)
				else if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLCanvasElement) {
						return {
							element: element,
							options: (0, _getOptionsFromElement2.default)(element),
							renderer: (0, _renderers.getRendererClass)("canvas")
						};
					}
					// If canvas (in node)
					else if (element.getContext) {
							return {
								element: element,
								renderer: (0, _renderers.getRendererClass)("canvas")
							};
						} else {
							throw new _exceptions.InvalidElementException();
						}
} /* global HTMLImageElement */
/* global HTMLCanvasElement */
/* global SVGElement */

function querySelectedRenderProperties(string) {
	var selector = document.querySelectorAll(string);
	if (selector.length === 0) {
		return undefined;
	} else {
		var returnArray = [];
		for (var i = 0; i < selector.length; i++) {
			returnArray.push(getRenderProperties(selector[i]));
		}
		return returnArray;
	}
}

function newCanvasRenderProperties(imgElement) {
	var canvas = document.createElement('canvas');
	return {
		element: canvas,
		options: (0, _getOptionsFromElement2.default)(imgElement),
		renderer: (0, _renderers.getRendererClass)("canvas"),
		afterRender: function afterRender() {
			imgElement.setAttribute("src", canvas.toDataURL());
		}
	};
}

exports.default = getRenderProperties;

/***/ },

/***/ "./node_modules/JsBarcode/bin/help/linearizeEncodings.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = linearizeEncodings;

// Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
// Convert to [1-1, 1-2, 2, 3-1, 3-2]

function linearizeEncodings(encodings) {
	var linearEncodings = [];
	function nextLevel(encoded) {
		if (Array.isArray(encoded)) {
			for (var i = 0; i < encoded.length; i++) {
				nextLevel(encoded[i]);
			}
		} else {
			encoded.text = encoded.text || "";
			encoded.data = encoded.data || "";
			linearEncodings.push(encoded);
		}
	}
	nextLevel(encodings);

	return linearEncodings;
}

/***/ },

/***/ "./node_modules/JsBarcode/bin/help/merge.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = merge;


function merge(old, replaceObj) {
	var newMerge = {};
	var k;
	for (k in old) {
		if (old.hasOwnProperty(k)) {
			newMerge[k] = old[k];
		}
	}
	for (k in replaceObj) {
		if (replaceObj.hasOwnProperty(k) && typeof replaceObj[k] !== "undefined") {
			newMerge[k] = replaceObj[k];
		}
	}
	return newMerge;
}

/***/ },

/***/ "./node_modules/JsBarcode/bin/help/optionsFromStrings.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = optionsFromStrings;

// Convert string to integers/booleans where it should be

function optionsFromStrings(options) {
	var intOptions = ["width", "height", "textMargin", "fontSize", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight"];

	for (var intOption in intOptions) {
		if (intOptions.hasOwnProperty(intOption)) {
			intOption = intOptions[intOption];
			if (typeof options[intOption] === "string") {
				options[intOption] = parseInt(options[intOption], 10);
			}
		}
	}

	if (typeof options["displayValue"] === "string") {
		options["displayValue"] = options["displayValue"] != "false";
	}

	return options;
}

/***/ },

/***/ "./node_modules/JsBarcode/bin/options/defaults.js":
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	width: 2,
	height: 100,
	format: "auto",
	displayValue: true,
	fontOptions: "",
	font: "monospace",
	text: undefined,
	textAlign: "center",
	textPosition: "bottom",
	textMargin: 2,
	fontSize: 20,
	background: "#ffffff",
	lineColor: "#000000",
	margin: 10,
	marginTop: undefined,
	marginBottom: undefined,
	marginLeft: undefined,
	marginRight: undefined,
	valid: function valid() {}
};

exports.default = defaults;

/***/ },

/***/ "./node_modules/JsBarcode/bin/renderers/canvas.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _merge = __webpack_require__("./node_modules/JsBarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = __webpack_require__("./node_modules/JsBarcode/bin/renderers/shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderer = function () {
	function CanvasRenderer(canvas, encodings, options) {
		_classCallCheck(this, CanvasRenderer);

		this.canvas = canvas;
		this.encodings = encodings;
		this.options = options;
	}

	CanvasRenderer.prototype.render = function render() {
		// Abort if the browser does not support HTML5 canvas
		if (!this.canvas.getContext) {
			throw new Error('The browser does not support canvas.');
		}

		this.prepareCanvas();
		for (var i = 0; i < this.encodings.length; i++) {
			var encodingOptions = (0, _merge2.default)(this.options, this.encodings[i].options);

			this.drawCanvasBarcode(encodingOptions, this.encodings[i]);
			this.drawCanvasText(encodingOptions, this.encodings[i]);

			this.moveCanvasDrawing(this.encodings[i]);
		}

		this.restoreCanvas();
	};

	CanvasRenderer.prototype.prepareCanvas = function prepareCanvas() {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		ctx.save();

		(0, _shared.calculateEncodingAttributes)(this.encodings, this.options, ctx);
		var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
		var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);

		this.canvas.width = totalWidth + this.options.marginLeft + this.options.marginRight;

		this.canvas.height = maxHeight;

		// Paint the canvas
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.options.background) {
			ctx.fillStyle = this.options.background;
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		ctx.translate(this.options.marginLeft, 0);
	};

	CanvasRenderer.prototype.drawCanvasBarcode = function drawCanvasBarcode(options, encoding) {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		var binary = encoding.data;

		// Creates the barcode out of the encoded binary
		var yFrom;
		if (options.textPosition == "top") {
			yFrom = options.marginTop + options.fontSize + options.textMargin;
		} else {
			yFrom = options.marginTop;
		}

		ctx.fillStyle = options.lineColor;

		for (var b = 0; b < binary.length; b++) {
			var x = b * options.width + encoding.barcodePadding;

			if (binary[b] === "1") {
				ctx.fillRect(x, yFrom, options.width, options.height);
			} else if (binary[b]) {
				ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
			}
		}
	};

	CanvasRenderer.prototype.drawCanvasText = function drawCanvasText(options, encoding) {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		var font = options.fontOptions + " " + options.fontSize + "px " + options.font;

		// Draw the text if displayValue is set
		if (options.displayValue) {
			var x, y;

			if (options.textPosition == "top") {
				y = options.marginTop + options.fontSize - options.textMargin;
			} else {
				y = options.height + options.textMargin + options.marginTop + options.fontSize;
			}

			ctx.font = font;

			// Draw the text in the correct X depending on the textAlign option
			if (options.textAlign == "left" || encoding.barcodePadding > 0) {
				x = 0;
				ctx.textAlign = 'left';
			} else if (options.textAlign == "right") {
				x = encoding.width - 1;
				ctx.textAlign = 'right';
			}
			// In all other cases, center the text
			else {
					x = encoding.width / 2;
					ctx.textAlign = 'center';
				}

			ctx.fillText(encoding.text, x, y);
		}
	};

	CanvasRenderer.prototype.moveCanvasDrawing = function moveCanvasDrawing(encoding) {
		var ctx = this.canvas.getContext("2d");

		ctx.translate(encoding.width, 0);
	};

	CanvasRenderer.prototype.restoreCanvas = function restoreCanvas() {
		// Get the canvas context
		var ctx = this.canvas.getContext("2d");

		ctx.restore();
	};

	return CanvasRenderer;
}();

exports.default = CanvasRenderer;

/***/ },

/***/ "./node_modules/JsBarcode/bin/renderers/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getRendererClass = undefined;

var _canvas = __webpack_require__("./node_modules/JsBarcode/bin/renderers/canvas.js");

var _canvas2 = _interopRequireDefault(_canvas);

var _svg = __webpack_require__("./node_modules/JsBarcode/bin/renderers/svg.js");

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRendererClass(name) {
	switch (name) {
		case "canvas":
			return _canvas2.default;
		case "svg":
			return _svg2.default;
		default:
			throw new Error("Invalid rederer");
	}
}

exports.getRendererClass = getRendererClass;

/***/ },

/***/ "./node_modules/JsBarcode/bin/renderers/shared.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getTotalWidthOfEncodings = exports.calculateEncodingAttributes = exports.getBarcodePadding = exports.getEncodingHeight = exports.getMaximumHeightOfEncodings = undefined;

var _merge = __webpack_require__("./node_modules/JsBarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEncodingHeight(encoding, options) {
	return options.height + (options.displayValue && encoding.text.length > 0 ? options.fontSize + options.textMargin : 0) + options.marginTop + options.marginBottom;
}

function getBarcodePadding(textWidth, barcodeWidth, options) {
	if (options.displayValue && barcodeWidth < textWidth) {
		if (options.textAlign == "center") {
			return Math.floor((textWidth - barcodeWidth) / 2);
		} else if (options.textAlign == "left") {
			return 0;
		} else if (options.textAlign == "right") {
			return Math.floor(textWidth - barcodeWidth);
		}
	}
	return 0;
}

function calculateEncodingAttributes(encodings, barcodeOptions, context) {
	for (var i = 0; i < encodings.length; i++) {
		var encoding = encodings[i];
		var options = (0, _merge2.default)(barcodeOptions, encoding.options);

		// Calculate the width of the encoding
		var textWidth = messureText(encoding.text, options, context);
		var barcodeWidth = encoding.data.length * options.width;
		encoding.width = Math.ceil(Math.max(textWidth, barcodeWidth));

		encoding.height = getEncodingHeight(encoding, options);

		encoding.barcodePadding = getBarcodePadding(textWidth, barcodeWidth, options);
	}
}

function getTotalWidthOfEncodings(encodings) {
	var totalWidth = 0;
	for (var i = 0; i < encodings.length; i++) {
		totalWidth += encodings[i].width;
	}
	return totalWidth;
}

function getMaximumHeightOfEncodings(encodings) {
	var maxHeight = 0;
	for (var i = 0; i < encodings.length; i++) {
		if (encodings[i].height > maxHeight) {
			maxHeight = encodings[i].height;
		}
	}
	return maxHeight;
}

function messureText(string, options, context) {
	var ctx;
	if (typeof context === "undefined") {
		ctx = document.createElement("canvas").getContext("2d");
	} else {
		ctx = context;
	}

	ctx.font = options.fontOptions + " " + options.fontSize + "px " + options.font;

	// Calculate the width of the encoding
	var size = ctx.measureText(string).width;

	return size;
}

exports.getMaximumHeightOfEncodings = getMaximumHeightOfEncodings;
exports.getEncodingHeight = getEncodingHeight;
exports.getBarcodePadding = getBarcodePadding;
exports.calculateEncodingAttributes = calculateEncodingAttributes;
exports.getTotalWidthOfEncodings = getTotalWidthOfEncodings;

/***/ },

/***/ "./node_modules/JsBarcode/bin/renderers/svg.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _merge = __webpack_require__("./node_modules/JsBarcode/bin/help/merge.js");

var _merge2 = _interopRequireDefault(_merge);

var _shared = __webpack_require__("./node_modules/JsBarcode/bin/renderers/shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var svgns = "http://www.w3.org/2000/svg";

var SVGRenderer = function () {
	function SVGRenderer(svg, encodings, options) {
		_classCallCheck(this, SVGRenderer);

		this.svg = svg;
		this.encodings = encodings;
		this.options = options;
	}

	SVGRenderer.prototype.render = function render() {
		var currentX = this.options.marginLeft;

		this.prepareSVG();
		for (var i = 0; i < this.encodings.length; i++) {
			var encoding = this.encodings[i];
			var encodingOptions = (0, _merge2.default)(this.options, encoding.options);

			var group = createGroup(currentX, encodingOptions.marginTop, this.svg);

			setGroupOptions(group, encodingOptions);

			this.drawSvgBarcode(group, encodingOptions, encoding);
			this.drawSVGText(group, encodingOptions, encoding);

			currentX += encoding.width;
		}
	};

	SVGRenderer.prototype.prepareSVG = function prepareSVG() {
		// Clear the SVG
		while (this.svg.firstChild) {
			this.svg.removeChild(this.svg.firstChild);
		}

		(0, _shared.calculateEncodingAttributes)(this.encodings, this.options);
		var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
		var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);

		var width = totalWidth + this.options.marginLeft + this.options.marginRight;
		this.setSvgAttributes(width, maxHeight);
	};

	SVGRenderer.prototype.drawSvgBarcode = function drawSvgBarcode(parent, options, encoding) {
		var binary = encoding.data;

		// Creates the barcode out of the encoded binary
		var yFrom;
		if (options.textPosition == "top") {
			yFrom = options.fontSize + options.textMargin;
		} else {
			yFrom = 0;
		}

		var barWidth = 0;
		var x = 0;
		for (var b = 0; b < binary.length; b++) {
			x = b * options.width + encoding.barcodePadding;

			if (binary[b] === "1") {
				barWidth++;
			} else if (barWidth > 0) {
				drawLine(x - options.width * barWidth, yFrom, options.width * barWidth, options.height, parent);
				barWidth = 0;
			}
		}

		// Last draw is needed since the barcode ends with 1
		if (barWidth > 0) {
			drawLine(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height, parent);
		}
	};

	SVGRenderer.prototype.drawSVGText = function drawSVGText(parent, options, encoding) {
		var textElem = document.createElementNS(svgns, 'text');

		// Draw the text if displayValue is set
		if (options.displayValue) {
			var x, y;

			textElem.setAttribute("style", "font:" + options.fontOptions + " " + options.fontSize + "px " + options.font);

			if (options.textPosition == "top") {
				y = options.fontSize - options.textMargin;
			} else {
				y = options.height + options.textMargin + options.fontSize;
			}

			// Draw the text in the correct X depending on the textAlign option
			if (options.textAlign == "left" || encoding.barcodePadding > 0) {
				x = 0;
				textElem.setAttribute("text-anchor", "start");
			} else if (options.textAlign == "right") {
				x = encoding.width - 1;
				textElem.setAttribute("text-anchor", "end");
			}
			// In all other cases, center the text
			else {
					x = encoding.width / 2;
					textElem.setAttribute("text-anchor", "middle");
				}

			textElem.setAttribute("x", x);
			textElem.setAttribute("y", y);

			textElem.appendChild(document.createTextNode(encoding.text));

			parent.appendChild(textElem);
		}
	};

	SVGRenderer.prototype.setSvgAttributes = function setSvgAttributes(width, height) {
		var svg = this.svg;
		svg.setAttribute("width", width + "px");
		svg.setAttribute("height", height + "px");
		svg.setAttribute("x", "0px");
		svg.setAttribute("y", "0px");
		svg.setAttribute("viewBox", "0 0 " + width + " " + height);

		svg.setAttribute("xmlns", svgns);
		svg.setAttribute("version", "1.1");

		svg.style.transform = "translate(0,0)";

		if (this.options.background) {
			svg.style.background = this.options.background;
		}
	};

	return SVGRenderer;
}();

function createGroup(x, y, parent) {
	var group = document.createElementNS(svgns, 'g');

	group.setAttribute("transform", "translate(" + x + ", " + y + ")");

	parent.appendChild(group);

	return group;
}

function setGroupOptions(group, options) {
	group.setAttribute("style", "fill:" + options.lineColor + ";");
}

function drawLine(x, y, width, height, parent) {
	var line = document.createElementNS(svgns, 'rect');

	line.setAttribute("x", x);
	line.setAttribute("y", y);
	line.setAttribute("width", width);
	line.setAttribute("height", height);

	parent.appendChild(line);
}

exports.default = SVGRenderer;

/***/ },

/***/ "./node_modules/extract-text-webpack-plugin/loader.js?{\"id\":2,\"omit\":0,\"remove\":true}!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./src/app/app.scss":
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ "./node_modules/extract-text-webpack-plugin/loader.js?{\"id\":2,\"omit\":0,\"remove\":true}!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./src/login/login.scss":
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ "./node_modules/extract-text-webpack-plugin/loader.js?{\"id\":2,\"omit\":0,\"remove\":true}!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./src/portal/portal.scss":
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ "./node_modules/rxjs/add/operator/toPromise.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var toPromise_1 = __webpack_require__("./node_modules/rxjs/operator/toPromise.js");
Observable_1.Observable.prototype.toPromise = toPromise_1.toPromise;
//# sourceMappingURL=toPromise.js.map

/***/ },

/***/ "./src/app/app-component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var AppComponent = (function () {
    function AppComponent(router, titleService) {
        this.router = router;
        this.titleService = titleService;
    }
    AppComponent.prototype.setTitle = function () {
        this.titleService.setTitle('Angular2');
    };
    AppComponent.prototype.ngOnInit = function () {
        this.setTitle();
        this.redirectToLogin();
    };
    AppComponent.prototype.redirectToLogin = function () {
        this.router.navigate(['/login']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            template: __webpack_require__("./src/app/app.html"),
            styles: [
                __webpack_require__("./src/app/app.scss")
            ],
            providers: [
                platform_browser_1.Title
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof platform_browser_1.Title !== 'undefined' && platform_browser_1.Title) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
exports.AppComponent = AppComponent;


/***/ },

/***/ "./src/app/app-module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var shared_module_1 = __webpack_require__("./src/shared/shared-module.ts");
var login_module_1 = __webpack_require__("./src/login/login-module.ts");
var portal_module_1 = __webpack_require__("./src/portal/portal-module.ts");
var app_component_1 = __webpack_require__("./src/app/app-component.ts");
var routes = [
    {
        path: '',
        component: app_component_1.AppComponent
    }
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.AppComponent],
            imports: [
                platform_browser_1.BrowserModule,
                router_1.RouterModule.forRoot(routes, { useHash: true }),
                shared_module_1.SharedModule,
                login_module_1.LoginModule,
                portal_module_1.PortalModule
            ],
            declarations: [
                app_component_1.AppComponent
            ],
            providers: [
                {
                    provide: common_1.APP_BASE_HREF, useValue: '/'
                }
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ },

/***/ "./src/app/app.html":
/***/ function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ },

/***/ "./src/app/app.scss":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/extract-text-webpack-plugin/loader.js?{\"id\":2,\"omit\":0,\"remove\":true}!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./src/app/app.scss");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/environment.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
// Angular 2
// rc2 workaround
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
// Environment Providers
var PROVIDERS = [];
// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
var _decorateModuleRef = function identity(value) { return value; };
if (false) {
    // Production
    platform_browser_1.disableDebugTools();
    core_1.enableProdMode();
    PROVIDERS = PROVIDERS.slice();
}
else {
    _decorateModuleRef = function (modRef) {
        var appRef = modRef.injector.get(core_1.ApplicationRef);
        var cmpRef = appRef.components[0];
        var _ng = window.ng;
        platform_browser_1.enableDebugTools(cmpRef);
        window.ng.probe = _ng.probe;
        window.ng.coreTokens = _ng.coreTokens;
        return modRef;
    };
    // Development
    PROVIDERS = PROVIDERS.slice();
}
exports.decorateModuleRef = _decorateModuleRef;
exports.ENV_PROVIDERS = PROVIDERS.slice();


/***/ },

/***/ "./src/login/login-component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
// Third party library.
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var login_service_1 = __webpack_require__("./src/login/login-service.ts");
var LoginComponent = (function () {
    function LoginComponent(router, loginService) {
        this.router = router;
        this.loginService = loginService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.model = {
            email: '',
            password: ''
        };
    };
    LoginComponent.prototype.loggedOn = function () {
        return true;
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loginService.login(this.model.email, this.model.password).then(function (data) {
            if (data.result === true) {
                _this.router.navigate(['/portal']);
            }
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            template: __webpack_require__("./src/login/login.html"),
            styles: [
                __webpack_require__("./src/login/login.scss")
            ],
            providers: [
                login_service_1.LoginService
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof login_service_1.LoginService !== 'undefined' && login_service_1.LoginService) === 'function' && _b) || Object])
    ], LoginComponent);
    return LoginComponent;
    var _a, _b;
}());
exports.LoginComponent = LoginComponent;


/***/ },

/***/ "./src/login/login-module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var shared_module_1 = __webpack_require__("./src/shared/shared-module.ts");
var login_component_1 = __webpack_require__("./src/login/login-component.ts");
var routes = [
    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent,
    }
];
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(routes),
                shared_module_1.SharedModule
            ],
            declarations: [
                login_component_1.LoginComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;


/***/ },

/***/ "./src/login/login-service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/toPromise.js");
var http_service_1 = __webpack_require__("./src/shared/services/http-service.ts");
var LoginService = (function () {
    function LoginService(http, httpService) {
        this.http = http;
        this.httpService = httpService;
    }
    LoginService.prototype.login = function (email, password) {
        return this.http.get('shared/assets/mocks/login/login.json')
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.httpService.handleError);
    };
    LoginService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object, (typeof (_b = typeof http_service_1.HttpService !== 'undefined' && http_service_1.HttpService) === 'function' && _b) || Object])
    ], LoginService);
    return LoginService;
    var _a, _b;
}());
exports.LoginService = LoginService;


/***/ },

/***/ "./src/login/login.html":
/***/ function(module, exports) {

module.exports = "<div class=\"container\">\n    <div class=\"login\">\n        <h1 class=\"text-center login-title\">Sign in to Angular2 seed</h1>\n        <div class=\"account-wall\">\n            <img class=\"profile-img\" src=\"https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120\"\n                alt=\"\">\n            <form #loginForm=\"ngForm\" (ngSubmit)=\"login()\" class=\"form-signin\">\n                <input type=\"text\" name=\"email\" #email=\"ngModel\" email [(ngModel)]=\"model.email\" class=\"form-control\" placeholder=\"Email\" required autofocus>\n                <input type=\"password\" name=\"password\" #password=\"ngModel\" [(ngModel)]=\"model.password\" class=\"form-control\" placeholder=\"Password\" required>\n                <div *ngIf=\"email?.errors?.email\" class=\"alert alert-danger\">\n                    Please enter a valid email address.\n                </div>\n                <div [hidden]=\"password.valid || password.pristine\" class=\"alert alert-danger\">\n                    Please enter a password.\n                </div>\n                <div class=\"input-group\">\n                    <button [disabled]=\"!loginForm.form.valid\" class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Sign in</button>\n                </div>\n                <div class=\"input-group\">\n                    <label class=\"checkbox pull-left\">\n                        <input type=\"checkbox\" value=\"remember-me\">\n                        Remember me\n                </label>\n                </div>\n                <a href=\"#\" class=\"pull-right need-help\">Need help? </a><span class=\"clearfix\"></span>\n            </form>\n        </div>\n        <a href=\"#\" class=\"text-center new-account\">Create an account </a>\n    </div>\n</div>"

/***/ },

/***/ "./src/login/login.scss":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/extract-text-webpack-plugin/loader.js?{\"id\":2,\"omit\":0,\"remove\":true}!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./src/login/login.scss");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/main.browser.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/*
 * Angular bootstraping
 */
var platform_browser_dynamic_1 = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/index.js");
var environment_1 = __webpack_require__("./src/app/environment.ts");
var hmr_1 = __webpack_require__("./node_modules/@angularclass/hmr/dist/index.js");
/*
 * App Module
 * our top level module that holds all of our components
 */
var app_module_1 = __webpack_require__("./src/app/app-module.ts");
/*
 * Bootstrap our Angular app with a top level NgModule
 */
function main() {
    return platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(app_module_1.AppModule).then(function(MODULE_REF) {
  if (false) {
    module["hot"]["accept"]();
    
    if (MODULE_REF.instance["hmrOnInit"]) {
      module["hot"]["data"] && MODULE_REF.instance["hmrOnInit"](module["hot"]["data"]);
    }
    if (MODULE_REF.instance["hmrOnStatus"]) {
      module["hot"]["apply"](function(status) {
        MODULE_REF.instance["hmrOnStatus"](status);
      });
    }
    if (MODULE_REF.instance["hmrOnCheck"]) {
      module["hot"]["check"](function(err, outdatedModules) {
        MODULE_REF.instance["hmrOnCheck"](err, outdatedModules);
      });
    }
    if (MODULE_REF.instance["hmrOnDecline"]) {
      module["hot"]["decline"](function(dependencies) {
        MODULE_REF.instance["hmrOnDecline"](dependencies);
      });
    }
    module["hot"]["dispose"](function(store) {
      MODULE_REF.instance["hmrOnDestroy"] && MODULE_REF.instance["hmrOnDestroy"](store);
      MODULE_REF.destroy();
      MODULE_REF.instance["hmrAfterDestroy"] && MODULE_REF.instance["hmrAfterDestroy"](store);
    });
  }
  return MODULE_REF;
})
        .then(environment_1.decorateModuleRef)
        .catch(function (err) { return console.error(err); });
}
exports.main = main;
// needed for hmr
// in prod this is replace for document ready
hmr_1.bootloader(main);


/***/ },

/***/ "./src/portal/portal-component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
// Third party library.
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var portal_service_1 = __webpack_require__("./src/portal/portal-service.ts");
//let pdfMake : PdfMake;
var JsBarcode = __webpack_require__("./node_modules/JsBarcode/bin/JsBarcode.js");
var PortalComponent = (function () {
    function PortalComponent(elementRef, sanitizer, portalService) {
        this.elementRef = elementRef;
        this.sanitizer = sanitizer;
        this.portalService = portalService;
    }
    PortalComponent.prototype.ngOnInit = function () {
        this.getHTML();
        JsBarcode('.barcode').init();
        var canvas = document.createElement('canvas');
        var test = document.getElementById('test');
        test.appendChild(canvas);
        JsBarcode(canvas, '1 1 1 6 1 0 4 0 5 8 8 9 0 0', { format: 'CODE39' });
    };
    PortalComponent.prototype.getHTML = function () {
        var _this = this;
        this.portalService.getHTML().then(function (content) {
            var scriptReg = /<script type="text\/javascript">((\n|.)*)<\/script>/g;
            var scriptFound = content.match(scriptReg);
            if (scriptFound) {
                for (var i = 0; i < scriptFound.length; i++) {
                    var source = scriptFound[i].replace(scriptReg, '$1');
                    eval(source);
                }
            }
            var scriptSrcReg = /<script type="text\/javascript" src="(.*)"><\/script>/g;
            var scriptSrcFound = content.match(scriptSrcReg);
            if (scriptSrcFound) {
                for (var i = 0; i < scriptSrcFound.length; i++) {
                    var source = scriptSrcFound[i].replace(scriptSrcReg, '$1');
                    var tag = document.createElement('script');
                    tag.type = 'text/javascript';
                    tag.src = source;
                    console.log(source);
                    console.log(_this.elementRef.nativeElement);
                    _this.elementRef.nativeElement.appendChild(tag);
                }
            }
            content = content.replace(scriptReg, '');
            content = content.replace(scriptSrcReg, '');
            _this.content = _this.sanitizer.bypassSecurityTrustHtml(content);
        });
    };
    PortalComponent.prototype.createPDF = function () {
        this.portalService.getData().then(function (data) {
            pdfMake.fonts = {
                mplus: {
                    normal: 'mplus-1p-regular.ttf',
                    bold: 'mplus-1p-regular.ttf',
                    italics: 'mplus-1p-regular.ttf',
                    bolditalics: 'mplus-1p-regular.ttf'
                }
            };
            var documentDefinition = data;
            var document = pdfMake.createPdf(documentDefinition);
            console.log(document);
            document.open();
        }, function (error) {
            alert(error);
        });
    };
    PortalComponent.prototype.createPDF2 = function () {
        this.portalService.getRawData().then(function (data) {
            pdfMake.fonts = {
                mplus: {
                    normal: 'mplus-1p-regular.ttf',
                    bold: 'mplus-1p-regular.ttf',
                    italics: 'mplus-1p-regular.ttf',
                    bolditalics: 'mplus-1p-regular.ttf'
                }
            };
            var documentDefinition = eval('(function() { var doc = ' + data + '; return doc; }())');
            console.log(documentDefinition);
            var document = pdfMake.createPdf(documentDefinition);
            console.log(document);
            document.open();
        }, function (error) {
            alert(error);
        });
    };
    PortalComponent = __decorate([
        core_1.Component({
            template: __webpack_require__("./src/portal/portal.html"),
            styles: [
                __webpack_require__("./src/portal/portal.scss")
            ],
            providers: [
                portal_service_1.PortalService
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object, (typeof (_b = typeof platform_browser_1.DomSanitizer !== 'undefined' && platform_browser_1.DomSanitizer) === 'function' && _b) || Object, (typeof (_c = typeof portal_service_1.PortalService !== 'undefined' && portal_service_1.PortalService) === 'function' && _c) || Object])
    ], PortalComponent);
    return PortalComponent;
    var _a, _b, _c;
}());
exports.PortalComponent = PortalComponent;


/***/ },

/***/ "./src/portal/portal-module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var shared_module_1 = __webpack_require__("./src/shared/shared-module.ts");
var portal_component_1 = __webpack_require__("./src/portal/portal-component.ts");
var routes = [
    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'login'
    },
    {
        path: 'portal',
        component: portal_component_1.PortalComponent,
    }
];
var PortalModule = (function () {
    function PortalModule() {
    }
    PortalModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                router_1.RouterModule.forChild(routes),
                shared_module_1.SharedModule
            ],
            declarations: [portal_component_1.PortalComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], PortalModule);
    return PortalModule;
}());
exports.PortalModule = PortalModule;


/***/ },

/***/ "./src/portal/portal-service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/toPromise.js");
var http_service_1 = __webpack_require__("./src/shared/services/http-service.ts");
var PortalService = (function () {
    function PortalService(http, httpService) {
        this.http = http;
        this.httpService = httpService;
    }
    PortalService.prototype.getHTML = function () {
        return this.http.get('shared/assets/mocks/portal/news.html')
            .toPromise()
            .then(function (response) { return response.text(); })
            .catch(this.httpService.handleError);
    };
    PortalService.prototype.getData = function () {
        return this.http.get('shared/assets/mocks/portal/pdf.json').toPromise()
            .then(function (response) { return response.json(); });
    };
    PortalService.prototype.getRawData = function () {
        return this.http.get('shared/assets/mocks/portal/pdf.txt').toPromise()
            .then(function (response) { return response.text(); });
    };
    PortalService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object, (typeof (_b = typeof http_service_1.HttpService !== 'undefined' && http_service_1.HttpService) === 'function' && _b) || Object])
    ], PortalService);
    return PortalService;
    var _a, _b;
}());
exports.PortalService = PortalService;


/***/ },

/***/ "./src/portal/portal.html":
/***/ function(module, exports) {

module.exports = "<div class=\"container\">\n    <div class=\"portal\">\n        <button (click)=\"createPDF()\">PDF生成</button>\n        <br />\n        <button (click)=\"createPDF2()\">PDF生成2</button>\n        <svg class=\"barcode\"\n        jsbarcode-format=\"upc\"\n        jsbarcode-value=\"123456789012\"\n        jsbarcode-textmargin=\"0\"\n        jsbarcode-fontoptions=\"bold\">\n        </svg>\n        <div id='test'></div>\n        <hr />\n        <h1 class=\"text-center login-title\">News from yahoo.co.jp</h1>\n        <div class=\"content\" [innerHtml]=\"content\">\n        </div>\n        \n    </div>\n</div>"

/***/ },

/***/ "./src/portal/portal.scss":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/extract-text-webpack-plugin/loader.js?{\"id\":2,\"omit\":0,\"remove\":true}!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./src/portal/portal.scss");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/shared/services/http-service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var HttpService = (function () {
    function HttpService() {
    }
    HttpService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    HttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;


/***/ },

/***/ "./src/shared/services/util-service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var UtilService = (function () {
    function UtilService() {
    }
    UtilService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], UtilService);
    return UtilService;
}());
exports.UtilService = UtilService;


/***/ },

/***/ "./src/shared/shared-module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var util_service_1 = __webpack_require__("./src/shared/services/util-service.ts");
exports.UtilService = util_service_1.UtilService;
var http_service_1 = __webpack_require__("./src/shared/services/http-service.ts");
var email_validator_1 = __webpack_require__("./src/shared/validators/email-validator.ts");
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            exports: [
                common_1.CommonModule,
                email_validator_1.EmailValidator
            ],
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                email_validator_1.EmailValidator
            ],
            providers: [
                util_service_1.UtilService,
                http_service_1.HttpService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;


/***/ },

/***/ "./src/shared/validators/email-validator.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var EmailValidator = (function () {
    function EmailValidator() {
    }
    EmailValidator.prototype.validate = function (control) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value && control.value !== '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return {
                'email': true
            };
        }
        return null;
    };
    EmailValidator = __decorate([
        core_1.Directive({
            selector: '[email][formControlName],[email][formControl],[email][ngModel]',
            providers: [
                {
                    provide: forms_1.NG_VALIDATORS,
                    useExisting: core_1.forwardRef(function () { return EmailValidator; }),
                    multi: true
                }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], EmailValidator);
    return EmailValidator;
}());
exports.EmailValidator = EmailValidator;


/***/ }

},["./src/main.browser.ts"]);
//# sourceMappingURL=main.map