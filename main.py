# Personal Finance Tracker - Phase 1
while True:
    print("""
================================
    PERSONAL FINANCE TRACKER
================================
1. Add Income
2. Add Expense
3. View Transactions
4. Exit
================================
""")
    choice = input("Choose an option: ")
    if choice == "1":
        print("\n--- Add Income ---")
        
        try:
            income = float(input("Enter your income amount: "))
        except ValueError:
            print ("Please enter numbers only")
        else:
         print("Checking Amount....")
         if income > 0:
             file = open("transactions.txt", "a")
             file.write("Income: " + str(income) + "\n")
             file.close()
             print(f"\nIncome of ₹{income} recorded successfully!")
         elif income <= 0:
             print("Wrong amount\nPlease enter correct amount")
        
        
    elif choice == "2":
        print("\n--- Add Expense ---")
        
        try:
            expense = float(input("Enter your expense amount: "))
        except ValueError:
            print("Please enter numbers only")
        else:
            print("Checking Amount....")
            if expense > 0:
             file = open("transactions.txt", "a")
             file.write("Expense: " + str(expense) + "\n")
             file.close()
             print(f"\nExpense of ₹{expense} recorded successfully!")
            elif expense <= 0:
             print("Wrong amount\nPlease enter correct amount")
        

    elif choice == "3":
        print("\n--- View Transactions ---")
        file = open("transactions.txt", "r")
        data = file.read()
        print(data)
        file.close()
    
    elif choice == "4":
            print("\nExiting Finance Tracker...")
            break

    else:
        print("\nInvalid choice! Please try again.")
