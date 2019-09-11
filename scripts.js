$(document).ready(function () {
    var inputPrice, inputPayment, inputInterest, inputYears, inputMonths;
    var errorMsg = document.getElementById("formError");

    $('.calc-btn').click(function () {

        $('.form-error-msg').removeClass('show');

        inputPrice = document.getElementById('carPrice').value;
        inputPayment = document.getElementById('downPayment').value;
        inputInterest = document.getElementById('interest').value;
        inputYears = document.getElementById('years').value;
        inputMonths = document.getElementById('months').value;

        if (inputPrice == "") {
            $('.form-error-msg').addClass('show');
            errorMsg.innerHTML = "Please enter an amount for the car loan";
        } else if (inputPayment == "") {
            $('.form-error-msg').addClass('show');
            errorMsg.innerHTML = "Please enter an amount for the down payment";
        } else if (inputInterest == "") {
            $('.form-error-msg').addClass('show');
            errorMsg.innerHTML = "Please enter an interest rate";
        } else if (inputYears == "") {
            $('.form-error-msg').addClass('show');
            errorMsg.innerHTML = "Please enter the number of years for the loan duration";
        } else if (inputMonths == "") {
            $('.form-error-msg').addClass('show');
            errorMsg.innerHTML = "Please enter the number of months for the loan duration";
        } else {
            $("#amortization-schedule").addClass("show");
        }

        inputCalcs(inputPrice, inputPayment, inputInterest, inputYears, inputMonths);
    });

    function inputCalcs(price, payment, interest, years, months) {
        var tempPrice, numPayments, principalPayment, totalInterest, totalPrice, monthPayment, finalPrice;
        var monthlyInterest, monthlyInterestPlus;
        var tempInterest, tempPayments;
        var paymentArray = [];

        interest = +interest / 100;
        years = +years * 12;
        tempPrice = price - payment;
        numPayments = +years + +months;
        monthlyInterest = interest / 12;
        monthlyInterestPlus = 1 + monthlyInterest;
        tempInterest = monthlyInterest * +tempPrice;
        tempPayments = (Math.pow(monthlyInterestPlus, -numPayments));
        principalPayment = (tempInterest / (1 - tempPayments));
        totalInterest = calcTotalInterest(tempPrice, principalPayment, numPayments, monthlyInterest);
        finalPrice = tempPrice + totalInterest;

        setAmortization(finalPrice, principalPayment, numPayments, monthlyInterest, paymentArray);
    };
});

function calcTotalInterest(tempPrice, principalPayment, numPayments, interest) {
    var totalInterest = 0;
    for (i = 1; i < numPayments; i++) {
        totalInterest = (totalInterest + (tempPrice * interest));
        tempPrice = tempPrice - principalPayment;
    }
    return totalInterest;
};

function addRow(paymentArray) {
    var table = document.getElementById("amortization-schedule");

    for (var i = 0; i < paymentArray.length; i++) {
        var this_tr = document.createElement("tr");

        var this_month = document.createElement("td");
        var month_text = document.createTextNode(paymentArray[i].month);
        this_month.appendChild(month_text);
        this_tr.appendChild(this_month);

        var this_payment = document.createElement("td");
        var payment_text = document.createTextNode("$" + paymentArray[i].payment);
        this_payment.appendChild(payment_text);
        this_tr.appendChild(this_payment);

        var this_interest = document.createElement("td");
        var interest_text = document.createTextNode("$" + paymentArray[i].monthInterest);
        this_interest.appendChild(interest_text);
        this_tr.appendChild(this_interest);

        var this_principal = document.createElement("td");
        var principal_text = document.createTextNode("$" + paymentArray[i].principal);
        this_principal.appendChild(principal_text);
        this_tr.appendChild(this_principal);

        var this_totalInt = document.createElement("td");
        var totalInt_text = document.createTextNode("$" + paymentArray[i].totalInterest);
        this_totalInt.appendChild(totalInt_text);
        this_tr.appendChild(this_totalInt);

        var this_balance = document.createElement("td");
        var balance_text = document.createTextNode("$" + paymentArray[i].balance);
        this_balance.appendChild(balance_text);
        this_tr.appendChild(this_balance);

        table.appendChild(this_tr);
    }
}

function setAmortization(finalPrice, principalPayment, numPayments, interest, paymentArray) {
    var monthNum, monthPay, monthInterest, pricipalPay;
    var totalInterest = 0;
    var remainBalance = finalPrice;

    for (i = 0; i < numPayments; i++) {
        monthNum = (i + 1);
        monthPay = (+principalPayment).toFixed(2);
        monthInterest = (+remainBalance * +interest).toFixed(2);
        totalInterest = (+totalInterest + +monthInterest).toFixed(2);

        if (i == numPayments - 1) {
            principalPay = remainBalance;
            remainBalance = (0).toFixed(2);
        } else {
            principalPay = (+monthPay - +monthInterest).toFixed(2);
            remainBalance = (remainBalance - monthPay).toFixed(2);
        }

        paymentArray.push({'id': i, 'month': monthNum, 'payment': monthPay, 'monthInterest': monthInterest, 'totalInterest': totalInterest, 'principal': principalPay, 'balance': remainBalance});
    }

    addRow(paymentArray);
};