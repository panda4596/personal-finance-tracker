# Personal Finance Tracker

categories = [
    "Food",
    "Education",
    "Transport",
    "Shopping",
    "Entertainment",
    "Other"
]

while True:
    print("""
================================
    PERSONAL FINANCE TRACKER
================================
1. Add Income
2. Add Expense
3. View Transactions
4. View Balance
5. View Category Summary
6. Exit
================================
""")

    choice = input("Choose an option: ")

    # Add Income
    if choice == "1":
        print("\n--- Add Income ---")

        try:
            income = float(input("Enter your income amount: "))

        except ValueError:
            print("Please enter numbers only")

        else:
            print("Checking Amount....")

            if income > 0:
                file = open("transactions.txt", "a")
                file.write("Income: " + str(income) + "\n")
                file.close()

                print(f"\nIncome of ₹{income} recorded successfully!")

            else:
                print("Wrong amount\nPlease enter correct amount")

    # Add Expense
    elif choice == "2":
        print("\n--- Add Expense ---")

        try:
            expense = float(input("Enter your expense amount: "))

        except ValueError:
            print("Please enter numbers only")

        else:
            print("Checking Amount....")

            if expense > 0:
                print("""
Select Category:
1. Food
2. Education
3. Transport
4. Shopping
5. Entertainment
6. Other
""")

                try:
                    category_choice = int(input("Choose category: "))

                except ValueError:
                    print("Please enter a valid category number")

                else:
                    if 1 <= category_choice <= 6:
                        category = categories[category_choice - 1]

                        file = open("transactions.txt", "a")
                        file.write(
                            "Expense: " + str(expense) + ":" + category + "\n"
                        )
                        file.close()

                        print(
                            f"\nExpense of ₹{expense} recorded successfully!"
                        )

                    else:
                        print("Invalid Category")

            else:
                print("Wrong amount\nPlease enter correct amount")

    # View Transactions
    elif choice == "3":
        print("\n--- View Transactions ---")

        try:
            file = open("transactions.txt", "r")
            data = file.read()
            file.close()

            if data:
                print(data)
            else:
                print("No transactions recorded yet.")

        except FileNotFoundError:
            print("No transactions recorded yet.")

    # View Balance
    elif choice == "4":
        print("\n--- View Balance ---")

        total_income = 0
        total_expense = 0

        try:
            file = open("transactions.txt", "r")
            data = file.read()
            file.close()

            lines = data.splitlines()

            for line in lines:
                parts = line.split(":")
                amount = float(parts[1])

                if parts[0] == "Income":
                    total_income += amount

                elif parts[0] == "Expense":
                    total_expense += amount

            balance = total_income - total_expense

            print(f"Total Income: ₹{total_income}")
            print(f"Total Expenses: ₹{total_expense}")
            print(f"Current Balance: ₹{balance}")

        except FileNotFoundError:
            print("No transactions recorded yet.")

    # View Category Summary
    elif choice == "5":
        print("\n--- CATEGORY-WISE EXPENSE SUMMARY ---")

        category_totals = {}

        try:
            file = open("transactions.txt", "r")
            data = file.read()
            file.close()

            lines = data.splitlines()

            for line in lines:
                parts = line.split(":")

                if parts[0] == "Expense":
                    amount = float(parts[1])
                    category = parts[2]

                    if category in category_totals:
                        category_totals[category] += amount

                    else:
                        category_totals[category] = amount

            if category_totals:
                for category, total in category_totals.items():
                    print(f"{category}: ₹{total}")

            else:
                print("No expenses recorded yet.")

        except FileNotFoundError:
            print("No transactions recorded yet.")

    # Exit
    elif choice == "6":
        print("\nExiting Finance Tracker...")
        break

    else:
        print("\nInvalid choice! Please try again.")