// ====================================================================
// Personal Finance Tracker - Client Application & Supabase Auth
// ====================================================================

document.addEventListener("DOMContentLoaded", async () => {
  // Global DOM References
  const authView = document.getElementById("authView");
  const dashboardView = document.getElementById("dashboardView");
  const globalAlert = document.getElementById("globalAlert");

  // Auth Elements
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const authForm = document.getElementById("authForm");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const resetBox = document.getElementById("resetBox");
  const resetEmail = document.getElementById("resetEmail");
  const sendResetBtn = document.getElementById("sendResetBtn");
  const cancelResetBtn = document.getElementById("cancelResetBtn");

  // Profile Elements
  const userEmailDisplay = document.getElementById("userEmailDisplay");
  const logoutBtn = document.getElementById("logoutBtn");

  // Stat Elements
  const totalIncomeEl = document.getElementById("totalIncome");
  const totalExpenseEl = document.getElementById("totalExpense");
  const currentBalanceEl = document.getElementById("currentBalance");

  // Form Elements
  const incomeForm = document.getElementById("incomeForm");
  const incomeAmount = document.getElementById("incomeAmount");
  const incomeCategory = document.getElementById("incomeCategory");
  const incomeDate = document.getElementById("incomeDate");
  const incomeDesc = document.getElementById("incomeDesc");

  const expenseForm = document.getElementById("expenseForm");
  const expenseAmount = document.getElementById("expenseAmount");
  const expenseCategory = document.getElementById("expenseCategory");
  const expenseDate = document.getElementById("expenseDate");
  const expenseDesc = document.getElementById("expenseDesc");

  // Summary & Transaction Containers
  const categorySummaryContainer = document.getElementById("categorySummaryContainer");
  const monthlySummaryContainer = document.getElementById("monthlySummaryContainer");
  const transactionsContainer = document.getElementById("transactionsContainer");
  const txCountSubtitle = document.getElementById("txCountSubtitle");

  // Filters
  const filterType = document.getElementById("filterType");
  const filterDateFrom = document.getElementById("filterDateFrom");
  const filterDateTo = document.getElementById("filterDateTo");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

  let supabaseClient = null;
  let isSignupMode = false;
  let alertTimeout = null;

  // -------------------------------------------------------------------
  // UI Helpers
  // -------------------------------------------------------------------
  function showAlert(message, isSuccess = true) {
    if (alertTimeout) clearTimeout(alertTimeout);
    globalAlert.textContent = message;
    globalAlert.className = `alert ${isSuccess ? "success" : "error"}`;
    globalAlert.classList.remove("hidden");
    alertTimeout = setTimeout(() => {
      globalAlert.classList.add("hidden");
    }, 4500);
  }

  function formatINR(val) {
    const num = Number(val) || 0;
    return "₹" + num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function setTodayDates() {
    const today = new Date().toISOString().split("T")[0];
    if (incomeDate) incomeDate.value = today;
    if (expenseDate) expenseDate.value = today;
  }

  // -------------------------------------------------------------------
  // 1. Initialize Supabase Client from Backend Config
  // -------------------------------------------------------------------
  try {
    const configRes = await fetch("/api/config");
    const config = await configRes.json();

    if (!config.supabase_url || !config.supabase_anon_key) {
      showAlert("Supabase is not configured yet. Please configure your .env file.", false);
      console.warn("Missing Supabase configuration in /api/config");
      return;
    }

    // Initialize the official Supabase JS client
    supabaseClient = window.supabase.createClient(
      config.supabase_url,
      config.supabase_anon_key
    );

    // Populate Category Dropdowns
    if (config.income_categories && incomeCategory) {
      incomeCategory.innerHTML = config.income_categories
        .map((c) => `<option value="${c}">${c}</option>`)
        .join("");
    }

    if (config.expense_categories && expenseCategory) {
      expenseCategory.innerHTML = config.expense_categories
        .map((c) => `<option value="${c}">${c}</option>`)
        .join("");
    }

    setTodayDates();
    setupAuthListeners();

  } catch (err) {
    console.error("Initialization error:", err);
    showAlert("Failed to connect to backend service.", false);
  }

  // -------------------------------------------------------------------
  // 2. Authenticated Fetch Helper (Attaches JWT Bearer Token)
  // -------------------------------------------------------------------
  async function apiFetch(endpoint, options = {}) {
    if (!supabaseClient) throw new Error("Supabase is not initialized");

    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session) {
      handleLoggedOut();
      throw new Error("No active session. Please log in.");
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
      ...(options.headers || {})
    };

    const res = await fetch(endpoint, { ...options, headers });

    if (res.status === 401) {
      // Session expired or invalid
      await supabaseClient.auth.signOut();
      handleLoggedOut();
      showAlert("Session expired. Please log in again.", false);
      throw new Error("Unauthorized");
    }

    return res.json();
  }

  // -------------------------------------------------------------------
  // 3. Authentication Flow (Tabs, Login, Signup, Reset, Logout)
  // -------------------------------------------------------------------
  function setupAuthListeners() {
    // Mode Toggling
    tabLogin.addEventListener("click", () => {
      isSignupMode = false;
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
      authSubmitBtn.textContent = "Sign In";
      resetBox.classList.add("hidden");
    });

    tabSignup.addEventListener("click", () => {
      isSignupMode = true;
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
      authSubmitBtn.textContent = "Create Account";
      resetBox.classList.add("hidden");
    });

    // Password Reset Toggle
    forgotPasswordBtn.addEventListener("click", () => {
      resetBox.classList.remove("hidden");
      resetEmail.value = authEmail.value;
    });

    cancelResetBtn.addEventListener("click", () => {
      resetBox.classList.add("hidden");
    });

    // Send Password Reset Link
    sendResetBtn.addEventListener("click", async () => {
      const email = resetEmail.value.trim();
      if (!email) {
        showAlert("Please enter your email to receive a reset link.", false);
        return;
      }

      sendResetBtn.disabled = true;
      sendResetBtn.textContent = "Sending...";

      try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });

        if (error) {
          showAlert(error.message, false);
        } else {
          showAlert("Password reset link sent to your email!", true);
          resetBox.classList.add("hidden");
        }
      } catch (err) {
        showAlert("Failed to send reset link.", false);
      } finally {
        sendResetBtn.disabled = false;
        sendResetBtn.textContent = "Send Reset Link";
      }
    });

    // Handle Form Submit: Login or Signup
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = authEmail.value.trim();
      const password = authPassword.value;

      if (!email || !password) {
        showAlert("Please provide both email and password.", false);
        return;
      }

      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = isSignupMode ? "Creating Account..." : "Signing In...";

      try {
        if (isSignupMode) {
          // Sign Up
          const { data, error } = await supabaseClient.auth.signUp({ email, password });
          if (error) {
            showAlert(error.message, false);
          } else if (data.session) {
            showAlert("Account created and logged in successfully!", true);
          } else {
            showAlert("Account created! Please check your email to confirm your registration.", true);
          }
        } else {
          // Sign In
          const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
          if (error) {
            showAlert(error.message, false);
          } else {
            showAlert("Welcome back!", true);
          }
        }
      } catch (err) {
        showAlert("Authentication failed. Please try again.", false);
      } finally {
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isSignupMode ? "Create Account" : "Sign In";
      }
    });

    // Handle Logout
    logoutBtn.addEventListener("click", async () => {
      try {
        await supabaseClient.auth.signOut();
        showAlert("Logged out successfully.", true);
      } catch (err) {
        console.error("Logout error:", err);
      }
    });

    // Supabase Auth State Change Listener (Persistent Sessions)
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        handleLoggedIn(session.user);
      } else {
        handleLoggedOut();
      }
    });
  }

  function handleLoggedIn(user) {
    authView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    userEmailDisplay.textContent = user.email || "Authenticated User";
    refreshDashboard();
  }

  function handleLoggedOut() {
    dashboardView.classList.add("hidden");
    authView.classList.remove("hidden");
    userEmailDisplay.textContent = "";
  }

  // -------------------------------------------------------------------
  // 4. Data Operations: Balance, Summaries, Transactions
  // -------------------------------------------------------------------
  async function refreshDashboard() {
    await Promise.all([
      loadBalance(),
      loadCategorySummary(),
      loadMonthlySummary(),
      loadTransactions()
    ]);
  }

  // 1. Fetch & Render Balance
  async function loadBalance() {
    try {
      const data = await apiFetch("/api/balance");
      if (data.success) {
        totalIncomeEl.textContent = formatINR(data.total_income);
        totalExpenseEl.textContent = formatINR(data.total_expense);
        currentBalanceEl.textContent = formatINR(data.balance);
      }
    } catch (err) {
      console.error("Error loading balance:", err);
    }
  }

  // 2. Fetch & Render Category-wise Summary
  async function loadCategorySummary() {
    try {
      const data = await apiFetch("/api/categories");
      if (!data.success || !data.has_expenses) {
        categorySummaryContainer.innerHTML = '<p class="empty-state">No expenses recorded yet.</p>';
        return;
      }

      const rows = data.categories
        .filter((cat) => (data.totals[cat] || 0) > 0)
        .map((cat) => `
          <div class="summary-row">
            <span class="summary-title">${cat}</span>
            <span class="summary-val text-expense">${formatINR(data.totals[cat])}</span>
          </div>
        `)
        .join("");

      categorySummaryContainer.innerHTML = rows || '<p class="empty-state">No expenses recorded yet.</p>';
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }

  // 3. Fetch & Render Monthly Summary
  async function loadMonthlySummary() {
    try {
      const data = await apiFetch("/api/summary/monthly");
      if (!data.success || !data.monthly_summary || data.monthly_summary.length === 0) {
        monthlySummaryContainer.innerHTML = '<p class="empty-state">No monthly data available yet.</p>';
        return;
      }

      const rows = data.monthly_summary
        .map((m) => `
          <div class="summary-row">
            <span class="summary-title"><strong>${m.month}</strong></span>
            <div style="display: flex; gap: 12px; font-size: 0.825rem;">
              <span class="text-income">+${formatINR(m.income)}</span>
              <span class="text-expense">-${formatINR(m.expense)}</span>
              <span class="text-balance" style="font-weight: 700;">Net: ${formatINR(m.savings)}</span>
            </div>
          </div>
        `)
        .join("");

      monthlySummaryContainer.innerHTML = rows;
    } catch (err) {
      console.error("Error loading monthly summary:", err);
    }
  }

  // 4. Fetch & Render Transactions (with Filters)
  async function loadTransactions() {
    try {
      const type = filterType.value;
      const dateFrom = filterDateFrom.value;
      const dateTo = filterDateTo.value;

      const params = new URLSearchParams();
      if (type !== "all") params.append("type", type);
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const data = await apiFetch(`/api/transactions?${params.toString()}`);
      
      txCountSubtitle.textContent = `${data.total_count} record${data.total_count === 1 ? "" : "s"} recorded in private cloud`;

      if (!data.transactions || data.transactions.length === 0) {
        transactionsContainer.innerHTML = '<p class="empty-state">No transactions match your criteria.</p>';
        return;
      }

      const html = data.transactions
        .map((tx) => {
          const isIncome = tx.type === "Income";
          const badgeClass = isIncome ? "income" : "expense";
          const sign = isIncome ? "+" : "-";
          const descText = tx.description ? ` • ${escapeHtml(tx.description)}` : "";

          return `
            <div class="tx-row" id="tx-${tx.id}">
              <div class="tx-left">
                <span class="tx-badge ${badgeClass}">${tx.type}</span>
                <div class="tx-details">
                  <span class="tx-cat-name">${escapeHtml(tx.category)}</span>
                  <span class="tx-meta">${tx.date}${descText}</span>
                </div>
              </div>
              <div class="tx-right">
                <span class="tx-amount text-${badgeClass}">${sign} ${formatINR(tx.amount)}</span>
                <button type="button" class="tx-delete-btn" data-id="${tx.id}" title="Delete record">Delete</button>
              </div>
            </div>
          `;
        })
        .join("");

      transactionsContainer.innerHTML = html;

      // Attach Delete Listeners
      transactionsContainer.querySelectorAll(".tx-delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => handleDeleteTransaction(btn.dataset.id));
      });

    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  }

  // -------------------------------------------------------------------
  // 5. Actions: Add Income, Add Expense, Delete Record
  // -------------------------------------------------------------------
  incomeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      amount: incomeAmount.value.trim(),
      category: incomeCategory.value,
      date: incomeDate.value,
      description: incomeDesc.value.trim()
    };

    try {
      const res = await apiFetch("/api/income", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.success) {
        showAlert(res.message, true);
        incomeAmount.value = "";
        incomeDesc.value = "";
        setTodayDates();
        refreshDashboard();
      } else {
        showAlert(res.message || "Failed to record income.", false);
      }
    } catch (err) {
      showAlert("Could not record income. Check input.", false);
    }
  });

  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      amount: expenseAmount.value.trim(),
      category: expenseCategory.value,
      date: expenseDate.value,
      description: expenseDesc.value.trim()
    };

    try {
      const res = await apiFetch("/api/expense", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.success) {
        showAlert(res.message, true);
        expenseAmount.value = "";
        expenseDesc.value = "";
        setTodayDates();
        refreshDashboard();
      } else {
        showAlert(res.message || "Failed to record expense.", false);
      }
    } catch (err) {
      showAlert("Could not record expense. Check input.", false);
    }
  });

  async function handleDeleteTransaction(txId) {
    if (!confirm("Are you sure you want to permanently delete this transaction?")) {
      return;
    }

    try {
      const res = await apiFetch(`/api/transactions/${txId}`, {
        method: "DELETE"
      });

      if (res.success) {
        showAlert("Transaction deleted.", true);
        refreshDashboard();
      } else {
        showAlert(res.message || "Failed to delete.", false);
      }
    } catch (err) {
      showAlert("Error deleting transaction.", false);
    }
  }

  // -------------------------------------------------------------------
  // 6. Filter Controls
  // -------------------------------------------------------------------
  filterType.addEventListener("change", loadTransactions);
  filterDateFrom.addEventListener("change", loadTransactions);
  filterDateTo.addEventListener("change", loadTransactions);

  clearFiltersBtn.addEventListener("click", () => {
    filterType.value = "all";
    filterDateFrom.value = "";
    filterDateTo.value = "";
    loadTransactions();
  });

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
