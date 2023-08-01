class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  // submit budget method
  submitBudgetForm() {
    // console.log("Hello Ji");
    const value = this.budgetInput.value;
    if (value == "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`;
      //creating 'self' because if we use this in line 29, then it is not pointing to thebedgetFeedback anymore rather it going for global objects.... we checked it using console.log()
      const self = this;
      setTimeout(function () {
        self.budgetFeedback.classList.remove("showItem");
      }, 2000);
    } else {
      //we can use 'this' here because we aren't inside any other function... if hunde taan assi self use krde
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }
  //show balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.add("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else if (total == 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }
  //submit expense form
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>values cannot be empty or negative </p>`;
      const self = this;
      setTimeout(function () {
        self.expenseFeedback.classList.remove("showItem");
      }, 4000);
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      let expense = {
        id: this.itemID,
        title: expenseValue, //edrrr 'this' ni laaya coz shyd eh ethe belong krdi hai thatswhy
        amount: amount,
      };
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      //show balance
      this.showBalance();
    }
  }
  //add expense
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
  <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>
        `;
    this.expenseList.appendChild(div);
  }

  //total expense
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      //reduce function (it is a powerful method) baare pdho ...accumalator and current
      total = this.itemList.reduce(function (acc, curr) {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit expense (through icons)
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
    this.expenseList.removeChild(parent);
    //remove from the list
    let expense = this.itemList.filter(function (item) {
      return item.id === id;
    });
    //show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    // remove from list
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
  //delete expense (through icons)
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from dom
    this.expenseList.removeChild(parent);
    // remove from list
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListenters() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // new instance of UI class
  const ui = new UI();

  // budget form submit
  budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    ui.submitBudgetForm();
  });
  // expense form submit
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    ui.submitExpenseForm();
  });
  // expense click
  expenseList.addEventListener("click", function (event) {
    if (event.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}
//eh function nu ethe sbtoh bahar rkhna hai
document.addEventListener("DOMContentLoaded", function () {
  eventListenters();
});
//ess code ch eh dikkat hai ki jadd edit and delete icon dbaande aa o bss last entered values lyii kamm kr rea not for every value
