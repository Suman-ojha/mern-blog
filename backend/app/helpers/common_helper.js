
const niv = require("node-input-validator");

module.exports = {
    bcryptMake: async function (string) {
		if (string) {
			return bcrypt.hashSync(
				string,
				parseInt(global.CONFIG.bcrypt.saltrounds)
			);
		} else {
			return false;
		}
	},
	bcryptCheck: async function (string, hash) {
		if (string && hash) {
			return bcrypt.compareSync(string, hash);
		} else {
			return false;
		}
	},
	validator: async function (rules, request) {
		for (const key in rules) {
			if (Object.hasOwnProperty.call(rules, key)) {
				const rule = rules[key];

				if (rule.includes("sometimes")) {
					// If sometimes rule is present
					if (!request[key]) {
						// If the value not present, then skip the rule
						delete rules[key];
					}
				}
			}
		}

		const v = new niv.Validator(request, rules);
		const matched = await v.check();
		if (!matched) {
			return { status: false, errors: v.errors };
		} else {
			return { status: true };
		}
	},
	generateJwtToken: async function (document) {
		// const options = { expiresIn: '365d' };
		const options = {};
		const token = jwt.sign(document, process.env.JWT_SECRET, options);
		return token;
	},
	decodeDocToken(token) {
		const payload = JSON.parse(
			Buffer.from(token, "base64").toString("utf8")
		);
		return payload;
	},
	encodeDocToken(payload) {
		const token = Buffer.from(JSON.stringify(payload)).toString("base64");
		return token;
	},
	generateRandomString: async function (length = 10) {
		var result = "";
		var characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}

		return result;
	},
	getDateDifference: async function (date1, date2, retType) {
		const diffInMs = Math.abs(date2 - date1);
		switch (retType) {
			case "days":
				return diffInMs / (1000 * 60 * 60 * 24);

			case "hours":
				return diffInMs / (1000 * 60 * 60);

			case "minutes":
				return diffInMs / (1000 * 60);

			case "seconds":
				return diffInMs / 1000;

			default:
				return false;
		}
	},
    generateRandomNumber: async (length) => {
		let result = "";
		let characters = "0123456789";
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	},
    decrypt: async function (finalEnc) {
		var temp = finalEnc.replace("es", "");
		// 0q4g1z3j2k5gOJTRXLRVJTW34X30S31U30X34Q33O

		if (temp == finalEnc) {
			return false;
		}

		finalEnc = temp;
		// var temp2 = finalEnc;
		var alphabets = [
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z",
		];
		var alphabets1 = [
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		];

		for (let i = 0; i < alphabets.length; i++) {
			temp = temp.split(alphabets[i]).join("|"); //removing all occurences
			// temp = temp.replace(alphabets[i], "|"); //not removing all occurences
		}
		// 0q4g1z3j2k5g|||||||||||34|30|31|30|34|33|
		if (temp == finalEnc) {
			return false;
		}
		finalEnc = temp;
		var finalEncArr = finalEnc.split("|");
		var shuffled = finalEncArr[0];
		temp = shuffled;

		for (let j = 0; j < alphabets1.length; j++) {
			temp = temp.split(alphabets1[j]).join("|"); //removing all occurences
		}
		// 0|4|1|3|2|5|
		if (temp == shuffled) {
			return false;
		}
		shuffled = temp;
		var shuffledArr = shuffled.split("|");

		finalEncArr.splice(0, 1); //removing 1st element of the array

		var finalNameDecr = "";
		for (let k = 0; k < finalEncArr.length; k++) {
			if (finalEncArr[k] != "") {
				var value = parseInt(finalEncArr[k], 16).toString(); //hex to decimal then toString
				let retStr = String.fromCharCode(value); //convert ASCII to character equivalent to chr(value) in php
				finalNameDecr += retStr;
			}
		}
		var charArr1 = finalNameDecr.trim(); //last part

		finalNameDecr = "";
		var shuffledArr1 = [];
		var j = 0;
		//changing positions of the array
		for (let i = 0; i < shuffledArr.length; i++) {
			if (shuffledArr[i] != "") {
				shuffledArr1[shuffledArr[i]] = charArr1[j];
				j++;
			}
		}

		for (let i = 0; i < shuffledArr1.length; i++) {
			finalNameDecr += shuffledArr1[i];
		}

		return finalNameDecr;
	},
	encrypt: async function (unEnc) {
		unEnc = unEnc.trim();

		var charArr = unEnc.split("");
		var ascii = "";
		var numRange = [];
		for (let i = 0; i < charArr.length; i++) {
			numRange.push(i);
		}
		shuffle(numRange);

		var alphabets = [
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z",
		];
		var alphabets1 = [
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		];

		for (let j = 0; j < numRange.length; j++) {
			var ordVal = charArr[numRange[j]].charCodeAt(0); //character to ascii -  value of charArr in position of numRange[i]
			var randomCHAR = alphabets[getRandomInt(0, 19)]; //get random integer from 0 to 19 position and get alphabet value of that position
			var hexString = ordVal.toString(16);
			ascii += `${hexString}${randomCHAR}`;
		}

		var firstBit = "es";
		for (let k = 0; k < numRange.length; k++) {
			var randomChar = alphabets1[getRandomInt(0, 19)]; //get random integer from 0 to 19 and get alphabets1 value of that position
			firstBit += `${numRange[k]}${randomChar}`;
		}
		var numRangeArr = ["6", "7", "8", "9", "10", "11", "12"];
		let randomNum = getRandomInt(0, numRangeArr.length - 1);

		let stringLen = numRangeArr[randomNum];
		var randomChar2 = "";

		for (let i = 0; i < stringLen; i++) {
			randomChar2 += alphabets[getRandomInt(0, 19)];
		}

		var finalEnc = firstBit + randomChar2 + ascii;

		return finalEnc;
	}
    ,
    encryptToken: async function (token) {
		var sessionKeyHex = process.env.SESSION_KEY;
		const sessionKey = Buffer.from(sessionKeyHex, "hex");
		const cipher = crypto.createCipheriv("aes-256-ecb", sessionKey, null);
		let encryptedData = cipher.update(token, "utf8", "base64");
		encryptedData += cipher.final("base64");
		return encryptedData;
	},
	decryptToken: async function (token) {
		var sessionKeyHex = process.env.SESSION_KEY;
		const sessionKey = Buffer.from(sessionKeyHex, "hex");
		const decipher = crypto.createDecipheriv(
			"aes-256-ecb",
			sessionKey,
			null
		);
		let decryptedData = decipher.update(token, "base64", "utf8");
		decryptedData += decipher.final("utf8");
		return decryptedData;
	},
}