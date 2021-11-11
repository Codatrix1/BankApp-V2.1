"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BankApp

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Aakar Sinha",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-07-22T17:01:17.194Z",
    "2021-07-25T23:36:17.929Z",
    "2021-07-27T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Lavanya Kumar",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//------------------------------------------------------------------------
//
// ⭐⭐⭐ Function for the LOgOut Timer
//
//--------------------------------------------------------------------
//

const startLogOutTimer = function () {
  const tick = function () {
    // Convert to minutes

    const minutes = String(Math.trunc(time / 60)).padStart(2, "0");

    // Getting the seconds as remainder, when the time is divided by 60

    const seconds = String(time % 60).padStart(2, "0");

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${minutes}:${seconds}`;

    // When 0 seconds, stop timer and logout user

    if (time === 0) {
      clearInterval(timer); // STOP TIMER

      labelWelcome.textContent = "Login to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1 second, each time there is a function 📞 for setInterval() : But Only then When the timer is ⭐ really 00:00 for our timer function, and not when the timer is at 00:01
    time--;
  };
  // Set Time to 5 minutes

  let time = 300;
  // Call the timer every second
  tick();

  const timer = setInterval(tick, 1000);

  //⭐⭐⏰⏰ Returning the timerInterval Function to use the clearInterval(): In-Order to stop the running timer of the currently logged in user, and to start a new timer for the NEWLY Logged In User
  return timer;
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// -----------------------------------------------------------
// ⭕⭕ 💲💲💲 🌎 Function for Formatted date and time: "yestaerday", "today", " 2 Days ago"... in the deposits and withdrawals: Transactions
// --------------------------------------------------------------

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();

    // return `${day}-${month}-${year}`;

    //------------------------------------------------------------------
    // 💲💲💲 🌎Locale formatting for the Transactions/Movements: Date Format
    //----------------------------------------------------------------

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// -----------------------------------------------------------
// 💲💲💲💲💲💲 🌎 General Function: Re-Usable in a Vriety Of Applications: In Our case: We will use it to get and Display the Formatted Currency for the UI according to the 🔴Object Data
// --------------------------------------------------------------
//
//
//
//
//
//
//
//
//
//

const formatCurrency = function (anyValue, locale, currency) {
  // 💲💲💲💲💲 Formatted Currency

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(anyValue);
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//........................
// ⭕⭕ Displaying the Movements: Deposits and Withdrawals and ⚡updating the UI
//.............................
//
//
//
//
//
//
//
//
//
//
//
//
//

const displayMovements = function (allAccounts, sort = false) {
  // Resets/Empties the hard-coded container values

  containerMovements.innerHTML = ""; // Used as a setter // all HTML Tags included
  // .textContent = 0

  //   ⭕⭕🟡 Conditional Sorting, ASCENDING Order, negative to positive, like a stack in our UI
  // ❕ "slice" is used to make a copy of our original Array. DO NOT ALTER the Original One.

  const sorted = sort
    ? allAccounts.movements
        .slice()
        .sort((firstTran, secondTran) => firstTran - secondTran)
    : allAccounts.movements;

  console.log(sorted);

  // 🔱🔱🔱 Commmon Technique, for looping owve 2 Arrays at the Same Time

  sorted.forEach(function (eachTran, index) {
    const typeOfTran = eachTran > 0 ? "deposit" : "withdrawal";

    // ⭐⭐⭐⭐ ⏰ Date Functionality to all Transactions

    const date = new Date(allAccounts.movementsDates[index]); // ⭐⭐ Nicely formatted time string, and we can use that string, to create a NEW Date 🔴 Object, so that we can call our usual 🟠 METHODS, to get the day, month and the year. That is the reason, why we need to convert the strings into a JavaScript Objects, Only then, we can Work with that Data ⚡⚡

    // 📞 Function Call for Formatted date

    const displayDate = formatMovementDate(date, allAccounts.locale);

    // 📞 Function Call for Formatted Currency: Part 1

    const formatTransactions = formatCurrency(
      eachTran,
      allAccounts.locale,
      allAccounts.currency
    );

    const html = `
            <div class="movements__row">
            <div class="movements__type movements__type--${typeOfTran}">${
      index + 1
    }: ${typeOfTran}</div>

            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formatTransactions}</div>
          </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// displayMovements(account1.movements);

//
//
//
//
//
//
//
// ...........................
// ⭕⭕ Calculationg the overall balance using 🟠 reduce and ⚡updating the UI
//...............................

const calculateAndDisplayBalance = function (allAccounts) {
  // Storing the balance value, dynamically, as well as storing the value, in-order to ❗ check, if the account has ❗Enough Balance to Do Transfers and the Amount Transfer is a ❗Positive value

  //⭐⭐Input Validation Step: ❗❗ Adding the "balance" property to our Object ⚡ Dynamically, when the user logs in , as well as in order to keep it updating UI as the transfers are done.

  allAccounts.balance = allAccounts.movements.reduce(
    (accumulator, eachTran) => accumulator + eachTran,
    0
  );

  // 📞 Function Call for Formatted Currency: Part 2

  const formatTransactionsAllBalance = formatCurrency(
    allAccounts.balance,
    allAccounts.locale,
    allAccounts.currency
  );

  labelBalance.textContent = `${formatTransactionsAllBalance}`;
};

// calculateAndDisplayBalance(account1.movements);

//
//
//
//
//
//
//
//
//
// ...........................
// ⭕⭕ Calculate and Display Summary: the total Deposits, withdrawals, interest (if >= 1€) and ⚡updating the UI
//.................................

const calcDisplaySummary = function (allAccounts) {
  const incomes = allAccounts.movements
    .filter((eachTran) => eachTran > 0)
    .reduce((accumulator, eachTran) => accumulator + eachTran, 0);

  // 📞 Function Call for Formatted Currency: Part 3

  const formatTransactionsIncome = formatCurrency(
    incomes,
    allAccounts.locale,
    allAccounts.currency
  );

  labelSumIn.textContent = `${formatTransactionsIncome}`;

  const out = allAccounts.movements
    .filter((eachTran) => eachTran < 0)
    .reduce((accumulator, eachTran) => accumulator + eachTran, 0);

  // 📞 Function Call for Formatted Currency: Part 4

  const formatTransactionsOut = formatCurrency(
    Math.abs(out),
    allAccounts.locale,
    allAccounts.currency
  );

  labelSumOut.textContent = `${formatTransactionsOut}`;

  //   Add interest rate ⚡dynamically from the loggedInAccount
  const totalInterest = allAccounts.movements
    .filter((eachTran) => eachTran > 0)
    .map((eachDeposit) => (eachDeposit * allAccounts.interestRate) / 100)
    .filter((interest, index, array) => {
      //   console.log(array);
      return interest >= 1;
    })
    .reduce((accumulator, interest) => accumulator + interest, 0);

  // 📞 Function Call for Formatted Currency: Part 5

  const formatTransactionsInterest = formatCurrency(
    totalInterest,
    allAccounts.locale,
    allAccounts.currency
  );

  labelSumInterest.textContent = `${formatTransactionsInterest}`;
};

// calcDisplaySummary(account1.movements);

//
//
//
//
//
//
//
//
//................................
// ⭕⭕ Generating/Creating Username each account, and ⚡ adding it as Object's New Property
//.....................................

const createUsernames = function (allAccounts) {
  allAccounts.forEach(function (eachAccount) {
    eachAccount.username = eachAccount.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);
// console.log(accounts);

// 🟥 ⭐⭐⭐ Refactored function for updating the UI, as soon as the Transfer is Validated and Completed
const updateUI = function (allAccounts) {
  // 📞 Display Movements

  displayMovements(allAccounts);
  //📞 Display Balance: including balance in the account, we need the whole account

  calculateAndDisplayBalance(allAccounts);
  //📞 Display Summary: including Dynamic Interest rate, we need the whole account

  calcDisplaySummary(allAccounts);
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//.................................
// ⭕⭕ Implementing Login: Event handlers: Making our App Dynamic
//..............................

//  ❗ Needs to be defined globally, as it is required for other operations, like Transfers and switching the users too.

// 💫 timer, as a Global Variable, to persist between different User Logs In. Otherwise we would lose the Timer functionality for alternate Users

let loggedInAccount, timer;

// ⛔⛔ Fake Always Logged In: To Implement ⏰ Function

// loggedInAccount = account1;
// updateUI(loggedInAccount);
// containerApp.style.opacity = 1;

// //day / month / year;

btnLogin.addEventListener("click", function (event) {
  // Prevent default behavior of Submitting the form when "clicked" === "Hitting Enter"
  event.preventDefault();

  //   🎇 Important
  loggedInAccount = accounts.find(
    (eachAccount) => eachAccount.username === inputLoginUsername.value
  );

  console.log(loggedInAccount);

  //------------------------------------
  //📌 PIN Functionality
  //------------------------------------

  // 🎇 Important: Optional Chaining: if the "loggedInAccount" Exist, display, Else NOT.

  if (loggedInAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      loggedInAccount.owner.split(" ")[0]
    }!`;

    // Manipulating the ".app" class' opacity from 0 to 1
    containerApp.style.opacity = 1;

    // ⭐⭐⭐ ⏰ Creating Date and Time Functionaliy to labelDate.textContent
    const now = new Date();

    //-----------------------------------------------------------------------------
    // 💲💲💲 🌎 Experimenting: Data Time and Currency: Internationalization API
    //--------------------------------------------------------------------------

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      // month: "long",
      // month: "long",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
      // weekday: "short",
      // weekday: "narrow",
    };

    // Getting locale language from the User's Browser
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      loggedInAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();

    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // day/month/year format

    // labelDate.textContent = `${day}-${month}-${year}, ${hour}:${min}`;

    // Clearing Input Fields and blurring it so that the cursor loses focus

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // CALL 1 : 📞 💫💫 Clearing the timer function, if there is a timer already running, and then Calling the LogOut Function: After the user has Logged IN: using the return value of the original function: Reason to set the function to be defined Globally

    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    // 📞 Update UI
    updateUI(loggedInAccount);
  }
});

//
//
//
//
//
//
//
//
//
//.................................
// ⭕⭕ Implementing Transfers: Event handlers: Making our App Dynamic
//..............................

btnTransfer.addEventListener("click", function (event) {
  // Prevent auto submit of form: prevent auto-reloads

  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (eachAccount) => eachAccount.username === inputTransferTo.value
  );

  // console.log(amount, receiverAccount.owner);

  // 🔳🔳🔳 To ClearUp the Input Field, as the Transfer Button is clicked

  inputTransferAmount.value = inputTransferTo.value = "";

  // ⭐Input Validation: if the account has a ❗Positive value, ❗ its receiver's account, ❗ Enough Balance to Do Transfers and the Amount Transfer ❗ its not getting transferred to "loggedInAccount" i.e, Own account

  if (
    amount > 0 &&
    receiverAccount && // Evaluates: If this Exists/true
    loggedInAccount.balance >= amount &&
    receiverAccount?.username !== loggedInAccount.username
  ) {
    // console.log("Transfer Valid");

    //⭐⭐⭐ Doing the Transfer: Pushing the transactions, to the movements Array
    loggedInAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // ⏰ Add Amount Transfer Date

    loggedInAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // 🟩 Update UI
    updateUI(loggedInAccount);

    // CALL 2.1 : 📞 💫💫💫 Resetting the timer : Another Reason to set the function to be defined Globally

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//
//
//
//
//
//.................................................
// ⭕⭕ LOAN Amount Condition: Loan Grannted if there is: AtLeast 1 Deposit, with atleast 10% of the loan Amount, that is, if i want a loan for 1000, i should have deposited 100 at some point atleast ONCE.

// Implementing Loan Function
//.................................................
//
//
//
//
//
//

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  //   See Flowchart
  if (
    loanAmount > 0 &&
    loggedInAccount.movements.some((eachTran) => eachTran >= loanAmount * 0.1)
  ) {
    // ⌚⌚⌚ Setting a setTimeout function for loan approval after 2.5 seconds
    setTimeout(function () {
      // Add Approved loanAmount transaction to the movements array

      loggedInAccount.movements.push(loanAmount);

      // ⏰ Add Loan Transfer Date

      loggedInAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(loggedInAccount);

      // CALL 2.2 : 📞 💫💫💫 Resetting the timer : Another Reason to set the function to be defined Globally

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  // 🔳🔳🔳 Clear Input field
  inputLoanAmount.value = "";
});

//
//
//
//
//
//
//
//
//
//..................................................
// ⭕⭕ Implementing Close/Delete Account : Event handlers: with 🟠"findIndex" and 🟠"splice"
//.................................................
//
//
btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  // console.log("Delete");

  if (
    inputCloseUsername.value === loggedInAccount.username &&
    Number(inputClosePin.value) === loggedInAccount.pin
  ) {
    const index = accounts.findIndex(
      (eachAccount) => eachAccount.username === loggedInAccount.username
    );

    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI

    containerApp.style.opacity = 0;
  }

  // 🔳🔳🔳 To ClearUp the Input Value, as the Delete Button is clicked
  inputCloseUsername.value = inputClosePin.value = "";

  labelWelcome.textContent = "Login to get started";
});

//
//
//
//
//
//.................................................
//   ⭕⭕🟡 "sort": Final Event Handler:
//.................................................

// Implementing the "state" variable, which Monitors, if the SORT Button is active/ not active

let isSorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();

  displayMovements(loggedInAccount, !isSorted);

  //   ⌛ Flipping the "isSorted", each time, its clicked

  isSorted = !isSorted;
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
