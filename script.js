
// storing number to character mapping and vice versa required for encoding and decoding 
let encodeTable = [];
let decodeTable = [];

// generates encodeTable and decodeTable arrays with key - value pairs as following: 
// a - 1, b - 2 ... z - 26, aa - 27, ab - 28 AND 1 - a, 2 - b .... 26 - z, 27 - aa accordingly
function createEncodeDecodeTables(){
  let shortCode = '';
  let penultCode = '';
  let prevCode = '';
  let num = 1;

  for(let i = 1; i <= 26; i++){
    for(let j = 1; j <= 26; j++){
      for(let q = 1; q <= 26; q++){
        shortCode = penultCode + prevCode + String.fromCharCode(96 + q);
        encodeTable[num] = shortCode;
        decodeTable[shortCode] = num;
        num++;
      }
      prevCode = String.fromCharCode(96 + j);
    }
    penultCode = String.fromCharCode(96 + i);
  }
}

createEncodeDecodeTables();



function generateShortCode(storeId, transactionId){

  const date = new Date();
  // store, date and transaction are shaffled in order to prevent cheaters. Uppercase allowes to decode generated code.
  const code = encodeTable[date.getDate()] + encodeTable[transactionId].toUpperCase() + encodeTable[date.getMonth()] + encodeTable[storeId].toUpperCase();
  return code;
}

function decodeShortCode(shortCode){

  // break the code into ordered list of substrings based on uppercase
  const split = shortCode.split(/([A-Z]+)/);

  // Creating the date object and set the date and month.
  const purchaseDate = new Date();
  purchaseDate.setDate(decodeTable[split[0]]);
  purchaseDate.setMonth(decodeTable[split[2]]);

  // getting storeId and transactionId
  const storeId = decodeTable[split[3].toLowerCase()];
  const transactionId = decodeTable[split[1].toLowerCase()];



  return {
    storeId,
    shopDate: purchaseDate,
    transactionId
  };
}




// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [200, 175, 42, 0, 9]
    var transactionIds = [10000, 9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            console.log(typeof decodeResult.shopDate);
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}