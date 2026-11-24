// ==========================================================================
// Panda Financial Tracker — Main Client Application
// Full Multi-Language (EN / BN / HI), Country Auto-Detection, Currency & Ledger
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------------
  // Country, Currency & Complete Translation Dictionaries
  // Base stored figures in backend are in INR (₹)
  // ------------------------------------------------------------------------
  const COUNTRIES = [
    { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹", locale: "en-IN", rateFromINR: 1 },
    { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$", locale: "en-US", rateFromINR: 0.0119 },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£", locale: "en-GB", rateFromINR: 0.0094 },
    { code: "DE", name: "Germany (Eurozone)", flag: "🇩🇪", currency: "EUR", symbol: "€", locale: "de-DE", rateFromINR: 0.011 },
    { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT", symbol: "৳", locale: "bn-BD", rateFromINR: 1.42 },
  ];

  const CURRENCY_META = {
    INR: { symbol: "₹", locale: "en-IN", rateFromINR: 1 },
    USD: { symbol: "$", locale: "en-US", rateFromINR: 0.0119 },
    EUR: { symbol: "€", locale: "de-DE", rateFromINR: 0.011 },
    GBP: { symbol: "£", locale: "en-GB", rateFromINR: 0.0094 },
    BDT: { symbol: "৳", locale: "bn-BD", rateFromINR: 1.42 },
  };

  const CATEGORY_I18N = {
    en: {
      Food: "Food",
      Education: "Education",
      Transport: "Transport",
      Shopping: "Shopping",
      Entertainment: "Entertainment",
      Other: "Other",
      Salary: "Salary",
      Freelance: "Freelance",
      Investment: "Investment",
      Business: "Business",
      Gift: "Gift",
    },
    bn: {
      Food: "খাবার",
      Education: "শিক্ষা",
      Transport: "যাতায়াত",
      Shopping: "কেনাকাটা",
      Entertainment: "বিনোদন",
      Other: "অন্যান্য",
      Salary: "বেতন",
      Freelance: "ফ্রিল্যান্স",
      Investment: "বিনিয়োগ",
      Business: "ব্যবসা",
      Gift: "উপহার",
    },
    hi: {
      Food: "भोजन",
      Education: "शिक्षा",
      Transport: "यातायात",
      Shopping: "खरीदारी",
      Entertainment: "मनोरंजन",
      Other: "अन्य",
      Salary: "वेतन",
      Freelance: "फ़्रीलांस",
      Investment: "निवेश",
      Business: "व्यापार",
      Gift: "उपहार",
    },
  };

  const I18N = {
    en: {
      showcaseHeading: "Clear numbers.<br>Zero spreadsheet friction.",
      showcaseSub: "Track cashflow, categorize daily spending, and review monthly savings rate in a private workspace backed by Row Level Security.",
      previewNetLabel: "Net Cashflow",
      previewPill: "+24.8% savings",
      signInTitle: "Sign in to your account",
      signInSub: "Enter your credentials to open your personal ledger.",
      signUpTitle: "Create your account",
      signUpSub: "Start tracking income, expenses, and monthly savings.",
      signInBtn: "Sign In",
      signUpBtn: "Create Account",
      emailLabel: "Email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot password?",
      resetTitle: "Reset password",
      resetSub: "We will email you a secure recovery link.",
      accountEmailLabel: "Account email",
      sendLinkBtn: "Send Link",
      cancelBtn: "Cancel",
      closeBtn: "Close",
      securityNote: "Protected with Supabase Auth & PostgreSQL Row Level Security.",
      workspaceLabel: "Workspace",
      navOverview: "Overview",
      navTransactions: "Transactions",
      navAnalytics: "Analytics",
      languageLabel: "Language",
      countryCurrencyLabel: "Country & Currency",
      shortcutNew: "New entry",
      shortcutSearch: "Search ledger",
      logoutBtn: "Log out",
      themeLight: "Light",
      themeDark: "Dark",
      searchPlaceholder: "Search transactions...",
      addTransaction: "Add Transaction",
      returningBadge: "Returning User",
      newMemberBadge: "New Member",
      welcomeNew: (name) => `Welcome, ${name}!`,
      welcomeNewSub: "Your private Panda Financial Tracker is ready. Add your first income or expense to begin.",
      welcomeBack: (name) => `Welcome back, ${name}!`,
      welcomeBackSub: "Glad to see you again — here is a fresh look at your balance and cashflow.",
      accountProfileBtn: "Account & Profile",
      kpiBalance: "Net Balance",
      kpiBalancePos: (cur) => `Positive net position (${cur})`,
      kpiBalanceNeg: (cur) => `Deficit — expenses exceed income (${cur})`,
      kpiIncome: "Total Income",
      kpiExpense: "Total Expenses",
      kpiSavings: "Savings Rate",
      kpiIncomeSub: "Total recorded inflow",
      kpiExpenseSub: "Total recorded outflow",
      quickActionsLabel: "Quick Actions",
      quickLogExpense: "- Log Expense",
      quickLogIncome: "+ Log Income",
      savingsTargetLabel: "Monthly Savings Target:",
      chartCashflow: "Monthly Cashflow",
      chartCashflowSub: "Income, expenses, and net trend by month",
      chartCategory: "Spend by Category",
      chartCategorySub: "All-time expense distribution",
      totalSpendLabel: "Total Spend",
      noExpensesYet: "No expenses recorded yet.",
      cashflowEmpty: "Add income or expenses to generate your monthly cashflow chart.",
      recentActivity: "Recent Activity",
      recentActivitySub: "Latest entries synced to your ledger",
      viewAllBtn: "View all →",
      noTxYet: "No transactions yet. Click Add Transaction to log your first entry.",
      filterAll: "All",
      allCategories: "All Categories",
      filterSearchPlaceholder: "Filter note or category...",
      resetBtn: "Reset",
      colDate: "Date",
      colCategory: "Category",
      colDescription: "Description",
      colType: "Type",
      colAmount: "Amount",
      colMonth: "Month",
      colNetSavings: "Net Savings",
      colEfficiency: "Efficiency",
      typeIncome: "Income",
      typeExpense: "Expense",
      netLabel: "Net",
      noTxMatch: "No transactions match the active filters.",
      monthlyPerfTitle: "Monthly Performance",
      monthlyPerfSub: "Inflow, outflow, and savings efficiency per month",
      noMonthlyYet: "No monthly records available yet.",
      catAllocTitle: "Category Allocation",
      catAllocSub: "Ranked share of total spending",
      accountModalTitle: "Account & Personal Details",
      accountModalSub: "Update your name, country, language, currency, and personal info.",
      fullNameLabel: "Full Name",
      phoneLabel: "Phone Number",
      countryLabel: "Country",
      currencyLabel: "Income & Display Currency",
      emailChangeHint: "Changing email sends a confirmation link via Supabase Auth.",
      cityLabel: "City / Location",
      goalLabel: "Monthly Savings Goal",
      bioLabel: "Personal Note / Bio",
      extraLabelPlaceholder: "New detail label",
      extraValuePlaceholder: "Value",
      addBtn: "+ Add",
      saveDetailsBtn: "Save Details",
      drawerTitle: "New Transaction",
      recordingIn: (cur, sym) => `Recording in ${cur} (${sym})`,
      amountLabel: "Amount",
      descOptionalLabel: "Description (optional)",
      descPlaceholder: "e.g., Groceries, Semester books, Freelance invoice",
      recordExpenseBtn: "Record Expense",
      recordIncomeBtn: "Record Income",
      savingBtn: "Saving...",
      deleteTitle: "Delete transaction?",
      deleteBtn: "Delete",
      views: {
        overview: ["Overview", "Financial snapshot across all recorded periods"],
        transactions: ["Transactions", "Search, filter, audit, and export your ledger"],
        analytics: ["Analytics", "Monthly cashflow efficiency and category allocation"],
      },
    },
    bn: {
      showcaseHeading: "স্বচ্ছ হিসাব।<br>কোনো স্প্রেডশিটের ঝামেলা ছাড়াই।",
      showcaseSub: "Row Level Security সুরক্ষিত ব্যক্তিগত ওয়ার্কস্পেসে দৈনিক খরচ, আয় এবং মাসিক সঞ্চয় ট্র্যাক করুন।",
      previewNetLabel: "নেট ক্যাশফ্লো",
      previewPill: "+২৪.৮% সঞ্চয়",
      signInTitle: "আপনার অ্যাকাউন্টে সাইন ইন করুন",
      signInSub: "ব্যক্তিগত ফাইন্যান্স লেজার খুলতে তথ্য দিন।",
      signUpTitle: "নতুন অ্যাকাউন্ট তৈরি করুন",
      signUpSub: "আয়, খরচ এবং মাসিক সঞ্চয় সহজে ট্র্যাক করুন।",
      signInBtn: "সাইন ইন",
      signUpBtn: "অ্যাকাউন্ট বানান",
      emailLabel: "ইমেইল",
      passwordLabel: "পাসওয়ার্ড",
      passwordPlaceholder: "পাসওয়ার্ড লিখুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      resetTitle: "পাসওয়ার্ড রিসেট করুন",
      resetSub: "আপনার ইমেইলে একটি রিকভারি লিংক পাঠানো হবে।",
      accountEmailLabel: "অ্যাকাউন্ট ইমেইল",
      sendLinkBtn: "লিংক পাঠান",
      cancelBtn: "বাতিল",
      closeBtn: "বন্ধ করুন",
      securityNote: "Supabase Auth এবং PostgreSQL Row Level Security দ্বারা সুরক্ষিত।",
      workspaceLabel: "ওয়ার্কস্পেস",
      navOverview: "ওভারভিউ",
      navTransactions: "লেনদেন",
      navAnalytics: "অ্যানালিটিক্স",
      languageLabel: "ভাষা",
      countryCurrencyLabel: "দেশ ও মুদ্রা",
      shortcutNew: "নতুন এন্ট্রি",
      shortcutSearch: "খুঁজুন",
      logoutBtn: "লগ আউট",
      themeLight: "লাইট",
      themeDark: "ডার্ক",
      searchPlaceholder: "লেনদেন খুঁজুন...",
      addTransaction: "লেনদেন যোগ করুন",
      returningBadge: "ফিরে এসেছেন",
      newMemberBadge: "নতুন সদস্য",
      welcomeNew: (name) => `স্বাগতম, ${name}!`,
      welcomeNewSub: "আপনার Panda Financial Tracker প্রস্তুত। শুরু করতে প্রথম আয় বা খরচ যোগ করুন।",
      welcomeBack: (name) => `আবার স্বাগতম, ${name}!`,
      welcomeBackSub: "আপনাকে আবার দেখে ভালো লাগছে — নিচে আপনার ব্যালেন্স ও ক্যাশফ্লো দেখুন।",
      accountProfileBtn: "অ্যাকাউন্ট ও প্রোফাইল",
      kpiBalance: "নেট ব্যালেন্স",
      kpiBalancePos: (cur) => `ইতিবাচক ব্যালেন্স (${cur})`,
      kpiBalanceNeg: (cur) => `ঘাটতি — আয়ের চেয়ে খরচ বেশি (${cur})`,
      kpiIncome: "মোট আয়",
      kpiExpense: "মোট খরচ",
      kpiSavings: "সঞ্চয়ের হার",
      kpiIncomeSub: "মোট নথিভুক্ত আয়",
      kpiExpenseSub: "মোট নথিভুক্ত খরচ",
      quickActionsLabel: "কুইক অ্যাকশন",
      quickLogExpense: "- খরচ লিখুন",
      quickLogIncome: "+ আয় লিখুন",
      savingsTargetLabel: "মাসিক সঞ্চয়ের লক্ষ্য:",
      chartCashflow: "মাসিক ক্যাশফ্লো",
      chartCashflowSub: "মাস অনুযায়ী আয়, খরচ এবং নেট সঞ্চয়",
      chartCategory: "ক্যাটাগরি অনুযায়ী খরচ",
      chartCategorySub: "সর্বমোট খরচের বিভাজন",
      totalSpendLabel: "মোট খরচ",
      noExpensesYet: "এখনও কোনো খরচ লেখা হয়নি।",
      cashflowEmpty: "মাসিক চার্ট দেখতে আয় বা খরচ যোগ করুন।",
      recentActivity: "সাম্প্রতিক লেনদেন",
      recentActivitySub: "আপনার লেজারে যুক্ত সর্বশেষ হিসাব",
      viewAllBtn: "সব দেখুন →",
      noTxYet: "এখনও কোনো লেনদেন নেই। শুরু করতে 'লেনদেন যোগ করুন' বাটনে চাপ দিন।",
      filterAll: "সব",
      allCategories: "সব ক্যাটাগরি",
      filterSearchPlaceholder: "নোট বা ক্যাটাগরি খুঁজুন...",
      resetBtn: "রিসেট",
      colDate: "তারিখ",
      colCategory: "ক্যাটাগরি",
      colDescription: "বিবরণ",
      colType: "ধরন",
      colAmount: "পরিমাণ",
      colMonth: "মাস",
      colNetSavings: "নেট সঞ্চয়",
      colEfficiency: "দক্ষতা",
      typeIncome: "আয়",
      typeExpense: "খরচ",
      netLabel: "নেট",
      noTxMatch: "এই ফিল্টারে কোনো লেনদেন পাওয়া যায়নি।",
      monthlyPerfTitle: "মাসিক পারফরম্যান্স",
      monthlyPerfSub: "প্রতি মাসের আয়, খরচ এবং সঞ্চয়ের হার",
      noMonthlyYet: "এখনও কোনো মাসিক তথ্য নেই।",
      catAllocTitle: "ক্যাটাগরি বিভাজন",
      catAllocSub: "মোট খরচের শতাংশ হিসাব",
      accountModalTitle: "অ্যাকাউন্ট ও ব্যক্তিগত তথ্য",
      accountModalSub: "আপনার নাম, দেশ, ভাষা, মুদ্রা ও ব্যক্তিগত তথ্য পরিবর্তন করুন।",
      fullNameLabel: "পুরো নাম",
      phoneLabel: "ফোন নম্বর",
      countryLabel: "দেশ",
      currencyLabel: "আয় ও প্রদর্শনের মুদ্রা",
      emailChangeHint: "ইমেইল পরিবর্তন করলে Supabase থেকে কনফার্মেশন লিংক যাবে।",
      cityLabel: "শহর / ঠিকানা",
      goalLabel: "মাসিক সঞ্চয়ের লক্ষ্য",
      bioLabel: "ব্যক্তিগত নোট / বায়ো",
      extraLabelPlaceholder: "নতুন তথ্যের নাম",
      extraValuePlaceholder: "তথ্য লিখুন",
      addBtn: "+ যোগ",
      saveDetailsBtn: "তথ্য সেভ করুন",
      drawerTitle: "নতুন লেনদেন",
      recordingIn: (cur, sym) => `${cur} (${sym}) মুদ্রায় হিসাব লেখা হচ্ছে`,
      amountLabel: "পরিমাণ",
      descOptionalLabel: "বিবরণ (ঐচ্ছিক)",
      descPlaceholder: "যেমন: বাজার, বই কেনা, ফ্রিল্যান্স পেমেন্ট",
      recordExpenseBtn: "খরচ সেভ করুন",
      recordIncomeBtn: "আয় সেভ করুন",
      savingBtn: "সেভ হচ্ছে...",
      deleteTitle: "লেনদেন মুছে ফেলবেন?",
      deleteBtn: "মুছে ফেলুন",
      views: {
        overview: ["ওভারভিউ", "আপনার আয়, খরচ ও সঞ্চয়ের সারসংক্ষেপ"],
        transactions: ["লেনদেন", "খুঁজুন, ফিল্টার করুন এবং CSV ডাউনলোড করুন"],
        analytics: ["অ্যানালিটিক্স", "মাসিক পারফরম্যান্স ও ক্যাটাগরি বিশ্লেষণ"],
      },
    },
    hi: {
      showcaseHeading: "स्पष्ट हिसाब।<br>बिना किसी स्प्रेडशीट झंझट के।",
      showcaseSub: "Row Level Security से सुरक्षित निजी वर्कस्पेस में दैनिक खर्च, आय और मासिक बचत ट्रैक करें।",
      previewNetLabel: "नेट कैशफ़्लो",
      previewPill: "+24.8% बचत",
      signInTitle: "अपने खाते में साइन इन करें",
      signInSub: "अपना पर्सनल लेज़र खोलने के लिए विवरण दर्ज करें।",
      signUpTitle: "नया खाता बनाएं",
      signUpSub: "आय, खर्च और मासिक बचत को आसानी से ट्रैक करें।",
      signInBtn: "साइन इन",
      signUpBtn: "खाता बनाएं",
      emailLabel: "ईमेल",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      forgotPassword: "पासवर्ड भूल गए?",
      resetTitle: "पासवर्ड रीसेट करें",
      resetSub: "हम आपके ईमेल पर एक रिकवरी लिंक भेजेंगे।",
      accountEmailLabel: "अकाउंट ईमेल",
      sendLinkBtn: "लिंक भेजें",
      cancelBtn: "रद्द करें",
      closeBtn: "बंद करें",
      securityNote: "Supabase Auth और PostgreSQL Row Level Security द्वारा सुरक्षित।",
      workspaceLabel: "वर्कस्पेस",
      navOverview: "ओवरव्यू",
      navTransactions: "लेनदेन",
      navAnalytics: "एनालिटिक्स",
      languageLabel: "भाषा",
      countryCurrencyLabel: "देश और मुद्रा",
      shortcutNew: "नई एंट्री",
      shortcutSearch: "खोजें",
      logoutBtn: "लॉग आउट",
      themeLight: "लाइट",
      themeDark: "डार्क",
      searchPlaceholder: "लेनदेन खोजें...",
      addTransaction: "लेनदेन जोड़ें",
      returningBadge: "वापसी उपयोगकर्ता",
      newMemberBadge: "नया सदस्य",
      welcomeNew: (name) => `स्वागत है, ${name}!`,
      welcomeNewSub: "आपका Panda Financial Tracker तैयार है। शुरू करने के लिए पहली आय या खर्च जोड़ें।",
      welcomeBack: (name) => `फिर से स्वागत है, ${name}!`,
      welcomeBackSub: "आपको फिर से देखकर खुशी हुई — यहाँ आपका ताज़ा बैलेंस और कैशफ़्लो है।",
      accountProfileBtn: "अकाउंट और प्रोफ़ाइल",
      kpiBalance: "नेट बैलेंस",
      kpiBalancePos: (cur) => `सकारात्मक बैलेंस (${cur})`,
      kpiBalanceNeg: (cur) => `घाटा — आय से अधिक खर्च (${cur})`,
      kpiIncome: "कुल आय",
      kpiExpense: "कुल खर्च",
      kpiSavings: "बचत दर",
      kpiIncomeSub: "कुल दर्ज आय",
      kpiExpenseSub: "कुल दर्ज खर्च",
      quickActionsLabel: "त्वरित कार्य",
      quickLogExpense: "- खर्च जोड़ें",
      quickLogIncome: "+ आय जोड़ें",
      savingsTargetLabel: "मासिक बचत लक्ष्य:",
      chartCashflow: "मासिक कैशफ़्लो",
      chartCashflowSub: "महीने के अनुसार आय, खर्च और नेट बचत",
      chartCategory: "श्रेणी अनुसार खर्च",
      chartCategorySub: "कुल खर्च का विभाजन",
      totalSpendLabel: "कुल खर्च",
      noExpensesYet: "अभी तक कोई खर्च दर्ज नहीं है।",
      cashflowEmpty: "चार्ट देखने के लिए आय या खर्च जोड़ें।",
      recentActivity: "हाल की गतिविधि",
      recentActivitySub: "आपके लेज़र में दर्ज नवीनतम प्रविष्टियाँ",
      viewAllBtn: "सभी देखें →",
      noTxYet: "अभी तक कोई लेनदेन नहीं है। शुरू करने के लिए 'लेनदेन जोड़ें' पर क्लिक करें।",
      filterAll: "सभी",
      allCategories: "सभी श्रेणियाँ",
      filterSearchPlaceholder: "नोट या श्रेणी खोजें...",
      resetBtn: "रीसेट",
      colDate: "तारीख",
      colCategory: "श्रेणी",
      colDescription: "विवरण",
      colType: "प्रकार",
      colAmount: "राशि",
      colMonth: "महीना",
      colNetSavings: "नेट बचत",
      colEfficiency: "दक्षता",
      typeIncome: "आय",
      typeExpense: "खर्च",
      netLabel: "नेट",
      noTxMatch: "इस फ़िल्टर से कोई लेनदेन मेल नहीं खाता।",
      monthlyPerfTitle: "मासिक प्रदर्शन",
      monthlyPerfSub: "हर महीने की आय, खर्च और बचत दक्षता",
      noMonthlyYet: "अभी तक कोई मासिक रिकॉर्ड नहीं है।",
      catAllocTitle: "श्रेणी आवंटन",
      catAllocSub: "कुल खर्च का प्रतिशत हिस्सा",
      accountModalTitle: "अकाउंट और व्यक्तिगत विवरण",
      accountModalSub: "अपना नाम, देश, भाषा, मुद्रा और व्यक्तिगत जानकारी अपडेट करें।",
      fullNameLabel: "पूरा नाम",
      phoneLabel: "फ़ोन नंबर",
      countryLabel: "देश",
      currencyLabel: "आय और प्रदर्शन मुद्रा",
      emailChangeHint: "ईमेल बदलने पर Supabase से कन्फ़र्मेशन लिंक भेजा जाएगा।",
      cityLabel: "शहर / स्थान",
      goalLabel: "मासिक बचत लक्ष्य",
      bioLabel: "व्यक्तिगत नोट / बायो",
      extraLabelPlaceholder: "नया विवरण लेबल",
      extraValuePlaceholder: "मान लिखें",
      addBtn: "+ जोड़ें",
      saveDetailsBtn: "विवरण सहेजें",
      drawerTitle: "नया लेनदेन",
      recordingIn: (cur, sym) => `${cur} (${sym}) मुद्रा में दर्ज हो रहा है`,
      amountLabel: "राशि",
      descOptionalLabel: "विवरण (वैकल्पिक)",
      descPlaceholder: "जैसे: राशन, किताबें, फ़्रीलांस भुगतान",
      recordExpenseBtn: "खर्च सहेजें",
      recordIncomeBtn: "आय सहेजें",
      savingBtn: "सहेजा जा रहा है...",
      deleteTitle: "लेनदेन हटाएं?",
      deleteBtn: "हटाएं",
      views: {
        overview: ["ओवरव्यू", "सभी दर्ज अवधियों का वित्तीय विवरण"],
        transactions: ["लेनदेन", "खोजें, फ़िल्टर करें और CSV एक्सपोर्ट करें"],
        analytics: ["एनालिटिक्स", "मासिक बचत और श्रेणी आवंटन"],
      },
    },
  };

  function detectInitialCountry() {
    const savedCountry = localStorage.getItem("panda_country");
    if (savedCountry && COUNTRIES.some((c) => c.code === savedCountry)) {
      return savedCountry;
    }
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Kolkata") || tz.includes("Calcutta")) return "IN";
      if (tz.includes("Dhaka")) return "BD";
      if (tz.includes("London")) return "GB";
      if (tz.includes("Berlin") || tz.includes("Paris") || tz.includes("Europe/")) return "DE";
      if (tz.includes("America/")) return "US";
    } catch {
      // Fallback below
    }
    const lang = (navigator.language || "").toUpperCase();
    if (lang.includes("BN")) return "BD";
    if (lang.includes("GB")) return "GB";
    if (lang.includes("US")) return "US";
    return "IN";
  }

  function detectInitialLanguage(countryCode) {
    const savedLang = localStorage.getItem("panda_lang");
    if (savedLang && I18N[savedLang]) return savedLang;
    if (countryCode === "BD") return "bn";
    const navLang = (navigator.language || "en").slice(0, 2).toLowerCase();
    return I18N[navLang] ? navLang : "en";
  }

  const initialCountry = detectInitialCountry();
  const initialCurrency =
    localStorage.getItem("panda_currency") ||
    (COUNTRIES.find((c) => c.code === initialCountry)?.currency || "INR");
  const initialLang = detectInitialLanguage(initialCountry);

  // ------------------------------------------------------------------------
  // Application State
  // ------------------------------------------------------------------------
  const state = {
    supabase: null,
    user: null,
    config: {
      income_categories: [],
      expense_categories: [],
    },
    isSignupMode: false,
    isNewMemberSession: false,
    activeView: "overview",
    drawerType: "Expense",
    country: initialCountry,
    currency: initialCurrency,
    lang: initialLang,
    transactions: [],
    balance: { total_income: 0, total_expense: 0, balance: 0 },
    categories: { categories: [], totals: {}, has_expenses: false },
    monthly: [],
    filters: {
      type: "all",
      category: "all",
      dateFrom: "",
      dateTo: "",
      search: "",
    },
    profile: {
      name: "",
      email: "",
      phone: "",
      city: "",
      goal: "",
      bio: "",
      country: initialCountry,
      currency: initialCurrency,
      lang: initialLang,
      extraFields: [],
    },
    draftExtraFields: [],
    pendingDeleteTx: null,
  };

  // ------------------------------------------------------------------------
  // DOM Cache
  // ------------------------------------------------------------------------
  const el = {
    toastStack: document.getElementById("toastStack"),

    // Auth & Locale
    authView: document.getElementById("authView"),
    showcasePreviewAmount: document.getElementById("showcasePreviewAmount"),
    authLangSelect: document.getElementById("authLangSelect"),
    authCountrySelect: document.getElementById("authCountrySelect"),
    authTitle: document.getElementById("authTitle"),
    authSubtitle: document.getElementById("authSubtitle"),
    tabLogin: document.getElementById("tabLogin"),
    tabSignup: document.getElementById("tabSignup"),
    authForm: document.getElementById("authForm"),
    authEmail: document.getElementById("authEmail"),
    authPassword: document.getElementById("authPassword"),
    togglePasswordBtn: document.getElementById("togglePasswordBtn"),
    authSubmitBtn: document.getElementById("authSubmitBtn"),
    forgotPasswordBtn: document.getElementById("forgotPasswordBtn"),
    resetBox: document.getElementById("resetBox"),
    resetEmail: document.getElementById("resetEmail"),
    sendResetBtn: document.getElementById("sendResetBtn"),
    cancelResetBtn: document.getElementById("cancelResetBtn"),

    // Shell
    dashboardView: document.getElementById("dashboardView"),
    sidebar: document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebarBackdrop"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    closeSidebarBtn: document.getElementById("closeSidebarBtn"),
    navItems: document.querySelectorAll(".nav-item"),
    navTxBadge: document.getElementById("navTxBadge"),
    dashLangSelect: document.getElementById("dashLangSelect"),
    dashCurrencySelect: document.getElementById("dashCurrencySelect"),
    activeRegionBadge: document.getElementById("activeRegionBadge"),
    openAccountBtn: document.getElementById("openAccountBtn"),
    userAvatar: document.getElementById("userAvatar"),
    userNameDisplay: document.getElementById("userNameDisplay"),
    userEmailDisplay: document.getElementById("userEmailDisplay"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeLabel: document.getElementById("themeLabel"),
    logoutBtn: document.getElementById("logoutBtn"),

    // Greeting & PC Quick Strip
    greetingBanner: document.getElementById("greetingBanner"),
    greetingBadge: document.getElementById("greetingBadge"),
    greetingHeadline: document.getElementById("greetingHeadline"),
    greetingSubtext: document.getElementById("greetingSubtext"),
    greetingProfileBtn: document.getElementById("greetingProfileBtn"),
    dismissGreetingBtn: document.getElementById("dismissGreetingBtn"),
    quickAddExpenseBtn: document.getElementById("quickAddExpenseBtn"),
    quickAddIncomeBtn: document.getElementById("quickAddIncomeBtn"),
    goalProgressPill: document.getElementById("goalProgressPill"),
    goalProgressText: document.getElementById("goalProgressText"),

    // Topbar
    pageTitle: document.getElementById("pageTitle"),
    pageSubtitle: document.getElementById("pageSubtitle"),
    globalSearchInput: document.getElementById("globalSearchInput"),
    openDrawerBtn: document.getElementById("openDrawerBtn"),

    // Views
    views: {
      overview: document.getElementById("view-overview"),
      transactions: document.getElementById("view-transactions"),
      analytics: document.getElementById("view-analytics"),
    },

    // Overview KPIs & Recent
    kpiBalance: document.getElementById("kpiBalance"),
    kpiBalanceMeta: document.getElementById("kpiBalanceMeta"),
    kpiIncome: document.getElementById("kpiIncome"),
    kpiExpense: document.getElementById("kpiExpense"),
    kpiSavingsRate: document.getElementById("kpiSavingsRate"),
    kpiSavingsBar: document.getElementById("kpiSavingsBar"),
    recentTxContainer: document.getElementById("recentTxContainer"),
    viewAllTxBtn: document.getElementById("viewAllTxBtn"),

    // Transactions View
    typeFilterPills: document.getElementById("typeFilterPills"),
    txSearchInput: document.getElementById("txSearchInput"),
    filterCategory: document.getElementById("filterCategory"),
    filterDateFrom: document.getElementById("filterDateFrom"),
    filterDateTo: document.getElementById("filterDateTo"),
    clearFiltersBtn: document.getElementById("clearFiltersBtn"),
    exportCsvBtn: document.getElementById("exportCsvBtn"),
    transactionsTableBody: document.getElementById("transactionsTableBody"),
    txFilteredCount: document.getElementById("txFilteredCount"),
    txFilteredIn: document.getElementById("txFilteredIn"),
    txFilteredOut: document.getElementById("txFilteredOut"),
    txFilteredNet: document.getElementById("txFilteredNet"),

    // Analytics View
    monthlyTableBody: document.getElementById("monthlyTableBody"),
    categoryBreakdownList: document.getElementById("categoryBreakdownList"),

    // Footer & Legal Modal
    backToTopLink: document.getElementById("backToTopLink"),
    legalModal: document.getElementById("legalModal"),
    legalModalTitle: document.getElementById("legalModalTitle"),
    legalModalBody: document.getElementById("legalModalBody"),
    closeLegalModalBtn: document.getElementById("closeLegalModalBtn"),
    okLegalModalBtn: document.getElementById("okLegalModalBtn"),

    // Account Modal
    accountModal: document.getElementById("accountModal"),
    closeAccountModalBtn: document.getElementById("closeAccountModalBtn"),
    cancelAccountBtn: document.getElementById("cancelAccountBtn"),
    accountForm: document.getElementById("accountForm"),
    profileNameInput: document.getElementById("profileNameInput"),
    profilePhoneInput: document.getElementById("profilePhoneInput"),
    profileCountrySelect: document.getElementById("profileCountrySelect"),
    profileCurrencySelect: document.getElementById("profileCurrencySelect"),
    profileLangSelect: document.getElementById("profileLangSelect"),
    profileEmailInput: document.getElementById("profileEmailInput"),
    emailHintText: document.getElementById("emailHintText"),
    profileCityInput: document.getElementById("profileCityInput"),
    profileGoalInput: document.getElementById("profileGoalInput"),
    profileBioInput: document.getElementById("profileBioInput"),
    customFieldsList: document.getElementById("customFieldsList"),
    newExtraLabel: document.getElementById("newExtraLabel"),
    newExtraValue: document.getElementById("newExtraValue"),
    addExtraFieldBtn: document.getElementById("addExtraFieldBtn"),
    saveAccountBtn: document.getElementById("saveAccountBtn"),

    // Slide-over Drawer
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    txDrawer: document.getElementById("txDrawer"),
    closeDrawerBtn: document.getElementById("closeDrawerBtn"),
    cancelDrawerBtn: document.getElementById("cancelDrawerBtn"),
    drawerTypeExpense: document.getElementById("drawerTypeExpense"),
    drawerTypeIncome: document.getElementById("drawerTypeIncome"),
    txForm: document.getElementById("txForm"),
    txAmount: document.getElementById("txAmount"),
    txCurrencyCodeLabel: document.getElementById("txCurrencyCodeLabel"),
    txCurrencySymbol: document.getElementById("txCurrencySymbol"),
    drawerCurrencyNote: document.getElementById("drawerCurrencyNote"),
    txCategory: document.getElementById("txCategory"),
    txDate: document.getElementById("txDate"),
    txDesc: document.getElementById("txDesc"),
    txSubmitBtn: document.getElementById("txSubmitBtn"),

    // Delete Modal
    deleteModal: document.getElementById("deleteModal"),
    deleteModalDesc: document.getElementById("deleteModalDesc"),
    cancelDeleteBtn: document.getElementById("cancelDeleteBtn"),
    confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
  };

  // ------------------------------------------------------------------------
  // Currency & Language Helpers
  // ------------------------------------------------------------------------
  function t(key) {
    const dict = I18N[state.lang] || I18N.en;
    return dict[key] !== undefined ? dict[key] : I18N.en[key];
  }

  function translateCategory(catName) {
    const map = CATEGORY_I18N[state.lang] || CATEGORY_I18N.en;
    return map[catName] || catName;
  }

  function translateTxType(txType) {
    return txType === "Income" ? t("typeIncome") : t("typeExpense");
  }

  function getCurrencyMeta() {
    return CURRENCY_META[state.currency] || CURRENCY_META.INR;
  }

  function fromINR(inrVal) {
    const rate = getCurrencyMeta().rateFromINR;
    return (Number(inrVal) || 0) * rate;
  }

  function toINR(displayVal) {
    const rate = getCurrencyMeta().rateFromINR || 1;
    return (Number(displayVal) || 0) / rate;
  }

  function formatMoneyFromINR(inrVal) {
    const converted = fromINR(inrVal);
    const meta = getCurrencyMeta();
    const sign = converted < 0 ? "-" : "";
    return (
      sign +
      meta.symbol +
      Math.abs(converted).toLocaleString(meta.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function formatDirectDisplayAmount(displayVal) {
    const num = Number(displayVal) || 0;
    const meta = getCurrencyMeta();
    const sign = num < 0 ? "-" : "";
    return (
      sign +
      meta.symbol +
      Math.abs(num).toLocaleString(meta.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function populateCountrySelectors() {
    const countryOptions = COUNTRIES.map(
      (c) => `<option value="${c.code}">${c.flag} ${c.name} (${c.currency})</option>`
    ).join("");

    const currencyOptions = COUNTRIES.map(
      (c) => `<option value="${c.currency}">${c.currency} (${c.symbol}) — ${c.name}</option>`
    ).join("");

    if (el.authCountrySelect) {
      el.authCountrySelect.innerHTML = countryOptions;
      el.authCountrySelect.value = state.country;
    }
    if (el.profileCountrySelect) {
      el.profileCountrySelect.innerHTML = countryOptions;
      el.profileCountrySelect.value = state.country;
    }
    if (el.dashCurrencySelect) {
      el.dashCurrencySelect.innerHTML = currencyOptions;
      el.dashCurrencySelect.value = state.currency;
    }
    if (el.profileCurrencySelect) {
      el.profileCurrencySelect.value = state.currency;
    }
  }

  function updateGreetingTextOnly() {
    const firstName = (state.profile.name || "Member").split(" ")[0];
    const isNew = state.isNewMemberSession;
    el.greetingBadge.textContent = isNew ? t("newMemberBadge") : t("returningBadge");
    el.greetingBadge.classList.toggle("new-user", isNew);
    el.greetingHeadline.textContent = isNew ? t("welcomeNew")(firstName) : t("welcomeBack")(firstName);
    el.greetingSubtext.textContent = isNew ? t("welcomeNewSub") : t("welcomeBackSub");
  }

  function applyLanguage() {
    const dict = I18N[state.lang] || I18N.en;
    document.documentElement.lang = state.lang;

    if (el.authLangSelect) el.authLangSelect.value = state.lang;
    if (el.dashLangSelect) el.dashLangSelect.value = state.lang;
    if (el.profileLangSelect) el.profileLangSelect.value = state.lang;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (typeof dict[key] === "string") {
        node.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const key = node.dataset.i18nHtml;
      if (typeof dict[key] === "string") {
        node.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      if (typeof dict[key] === "string") {
        node.placeholder = dict[key];
      }
    });

    if (!state.isSignupMode) {
      el.authTitle.textContent = dict.signInTitle;
      el.authSubtitle.textContent = dict.signInSub;
      el.authSubmitBtn.textContent = dict.signInBtn;
    } else {
      el.authTitle.textContent = dict.signUpTitle;
      el.authSubtitle.textContent = dict.signUpSub;
      el.authSubmitBtn.textContent = dict.signUpBtn;
    }

    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    if (el.themeLabel) {
      el.themeLabel.textContent = currentTheme === "dark" ? dict.themeLight : dict.themeDark;
    }

    const viewMeta = dict.views[state.activeView] || dict.views.overview;
    el.pageTitle.textContent = viewMeta[0];
    el.pageSubtitle.textContent = viewMeta[1];

    if (el.showcasePreviewAmount) {
      el.showcasePreviewAmount.textContent = formatMoneyFromINR(142850);
    }
    if (el.txCurrencyCodeLabel) el.txCurrencyCodeLabel.textContent = state.currency;
    if (el.txCurrencySymbol) el.txCurrencySymbol.textContent = getCurrencyMeta().symbol;
    if (el.drawerCurrencyNote) {
      el.drawerCurrencyNote.textContent = dict.recordingIn(state.currency, getCurrencyMeta().symbol);
    }
    if (el.txSubmitBtn) {
      el.txSubmitBtn.textContent =
        state.drawerType === "Income" ? dict.recordIncomeBtn : dict.recordExpenseBtn;
    }

    if (el.activeRegionBadge) {
      const cObj = COUNTRIES.find((c) => c.code === state.country);
      el.activeRegionBadge.textContent = `${cObj?.flag || ""} ${state.country} · ${state.currency}`;
    }

    populateCategoryFilter();
    updateDrawerCategories();

    if (state.user) {
      updateGreetingTextOnly();
      renderOverview();
      renderTransactionsView();
      renderAnalyticsView();
    }
  }

  function setCountryAndCurrency(nextCountryCode, explicitCurrency = null) {
    state.country = nextCountryCode || "IN";
    localStorage.setItem("panda_country", state.country);

    const countryObj = COUNTRIES.find((c) => c.code === state.country) || COUNTRIES[0];
    state.currency = explicitCurrency || countryObj.currency || "INR";
    localStorage.setItem("panda_currency", state.currency);

    populateCountrySelectors();
    applyLanguage();
    applyProfileToUI();
  }

  function setLanguage(nextLang) {
    state.lang = I18N[nextLang] ? nextLang : "en";
    localStorage.setItem("panda_lang", state.lang);
    applyLanguage();
  }

  // ------------------------------------------------------------------------
  // Toast & Animated Counter
  // ------------------------------------------------------------------------
  function toast(message, type = "success") {
    const node = document.createElement("div");
    node.className = `toast ${type}`;
    node.innerHTML = `<span class="toast-dot"></span><span>${escapeHtml(message)}</span>`;
    el.toastStack.appendChild(node);

    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateY(8px)";
      node.style.transition = "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => node.remove(), 240);
    }, 3600);
  }

  function animateConvertedCurrency(targetEl, inrValue, duration = 420) {
    if (!targetEl) return;
    const endConverted = fromINR(inrValue);
    const prevRaw = targetEl.dataset.rawDisplay;
    const startConverted = prevRaw !== undefined ? Number(prevRaw) : 0;
    targetEl.dataset.rawDisplay = String(endConverted);

    if (
      Math.abs(endConverted - startConverted) < 0.005 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targetEl.textContent = formatDirectDisplayAmount(endConverted);
      return;
    }

    const startTime = performance.now();
    function step(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startConverted + (endConverted - startConverted) * eased;
      targetEl.textContent = formatDirectDisplayAmount(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        targetEl.textContent = formatDirectDisplayAmount(endConverted);
      }
    }
    requestAnimationFrame(step);
  }

  function formatDisplayDate(iso) {
    if (!iso) return "—";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return dt.toLocaleDateString(getCurrencyMeta().locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatMonthName(ym) {
    if (!ym || !ym.includes("-")) return ym || "Unknown";
    const [y, m] = ym.split("-");
    const dt = new Date(Number(y), Number(m) - 1, 1);
    return dt.toLocaleDateString(getCurrencyMeta().locale, { month: "long", year: "numeric" });
  }

  function todayISO() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ------------------------------------------------------------------------
  // Profile & Personal Details Persistence (Supabase metadata + localStorage)
  // ------------------------------------------------------------------------
  function profileStorageKey(userId) {
    return `panda_finance_profile_${userId}`;
  }

  function seenUserStorageKey(userId) {
    return `panda_finance_seen_${userId}`;
  }

  function loadUserProfile(user) {
    const meta = user.user_metadata || {};
    let localData = {};
    try {
      localData = JSON.parse(localStorage.getItem(profileStorageKey(user.id)) || "{}");
    } catch {
      localData = {};
    }

    const fallbackName =
      meta.full_name ||
      meta.name ||
      localData.name ||
      (user.email ? user.email.split("@")[0] : "Member");

    const resolvedCountry = localData.country || meta.country || state.country;
    const resolvedCurrency = localData.currency || meta.currency || state.currency;
    const resolvedLang = localData.lang || meta.lang || state.lang;

    state.country = resolvedCountry;
    state.currency = resolvedCurrency;
    state.lang = resolvedLang;
    populateCountrySelectors();

    state.profile = {
      name: fallbackName,
      email: user.email || "",
      phone: localData.phone ?? meta.phone ?? "",
      city: localData.city ?? meta.city ?? "",
      goal: localData.goal ?? meta.monthly_goal ?? "",
      bio: localData.bio ?? meta.bio ?? "",
      country: resolvedCountry,
      currency: resolvedCurrency,
      lang: resolvedLang,
      extraFields: Array.isArray(localData.extraFields)
        ? localData.extraFields
        : Array.isArray(meta.extra_fields)
        ? meta.extra_fields
        : [],
    };
  }

  function saveLocalProfile(userId, profileObj) {
    localStorage.setItem(profileStorageKey(userId), JSON.stringify(profileObj));
  }

  function applyProfileToUI() {
    const labelName = state.profile.name || "Member";
    const initial = labelName.trim().charAt(0).toUpperCase() || "M";

    el.userAvatar.textContent = initial;
    el.userNameDisplay.textContent = labelName;
    el.userEmailDisplay.textContent = state.profile.email || "—";

    const goalVal = Number(state.profile.goal);
    if (goalVal > 0) {
      el.goalProgressPill.classList.remove("hidden");
      el.goalProgressText.textContent = formatDirectDisplayAmount(goalVal);
    } else {
      el.goalProgressPill.classList.add("hidden");
    }
  }

  function showGreetingIllusion(user, isNewAccountFlow) {
    const seenKey = seenUserStorageKey(user.id);
    const hasVisitedBefore = localStorage.getItem(seenKey) === "1";
    state.isNewMemberSession = isNewAccountFlow || !hasVisitedBefore;

    localStorage.setItem(seenKey, "1");
    updateGreetingTextOnly();
    el.greetingBanner.classList.remove("hidden");
  }

  // ------------------------------------------------------------------------
  // Theme Persistence
  // ------------------------------------------------------------------------
  function initTheme() {
    const saved = localStorage.getItem("ledger_theme") || "dark";
    applyTheme(saved);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ledger_theme", theme);
    if (el.themeLabel) {
      el.themeLabel.textContent = theme === "dark" ? t("themeLight") : t("themeDark");
    }
    if (window.FinanceCharts) {
      window.FinanceCharts.refreshTheme();
    }
  }

  // ------------------------------------------------------------------------
  // Safe SignOut & Authenticated API Wrapper
  // ------------------------------------------------------------------------
  async function safeLocalSignOut() {
    try {
      await state.supabase?.auth.signOut({ scope: "local" });
    } catch {
      // Ignore logout network/403 responses
    }
  }

  async function apiFetch(endpoint, options = {}) {
    if (!state.supabase) throw new Error("Supabase client is not ready.");

    const { data: { session }, error } = await state.supabase.auth.getSession();
    if (error || !session || !session.access_token) {
      await safeLocalSignOut();
      handleLoggedOut();
      throw new Error("Unauthorized");
    }

    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      await safeLocalSignOut();
      handleLoggedOut();
      toast("Session expired or invalid. Please sign in again.", "error");
      throw new Error("Unauthorized");
    }

    return res.json();
  }

  // ------------------------------------------------------------------------
  // Initialization
  // ------------------------------------------------------------------------
  async function boot() {
    initTheme();
    populateCountrySelectors();
    applyLanguage();
    bindUIEvents();

    try {
      const res = await fetch("/api/config");
      const config = await res.json();

      if (!config.supabase_url || !config.supabase_anon_key) {
        toast("Supabase credentials are missing in .env configuration.", "error");
        return;
      }

      state.config.income_categories = config.income_categories || [];
      state.config.expense_categories = config.expense_categories || [];
      populateCategoryFilter();
      updateDrawerCategories();

      state.supabase = window.supabase.createClient(
        config.supabase_url,
        config.supabase_anon_key
      );

      state.supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user && session.access_token) {
          const isSignupEvent = event === "SIGNED_UP" || state.isSignupMode;
          handleLoggedIn(session.user, isSignupEvent);
        } else {
          handleLoggedOut();
        }
      });
    } catch (err) {
      console.error("Boot failed:", err);
      toast("Unable to reach backend API.", "error");
    }
  }

  function handleLoggedIn(user, isNewAccountFlow = false) {
    state.user = user;
    loadUserProfile(user);
    showGreetingIllusion(user, isNewAccountFlow);
    applyLanguage();
    applyProfileToUI();

    el.authView.classList.add("hidden");
    el.dashboardView.classList.remove("hidden");

    state.isSignupMode = false;
    refreshAllData();
  }

  function handleLoggedOut() {
    state.user = null;
    closeDrawer();
    closeDeleteModal();
    closeAccountModal();
    closeLegalModal();
    el.greetingBanner.classList.add("hidden");
    el.dashboardView.classList.add("hidden");
    el.authView.classList.remove("hidden");
  }

  // ------------------------------------------------------------------------
  // Legal Info Modal
  // ------------------------------------------------------------------------
  const LEGAL_CONTENT = {
    privacy: {
      title: "Privacy Policy",
      paragraphs: [
        "Panda Financial Tracker stores your financial records under your authenticated account and enforces Row Level Security so other users cannot access your data.",
        "Optional profile details such as your display name, country, preferred currency, and savings goal are saved to your account metadata and local browser storage.",
      ],
    },
    terms: {
      title: "Terms & Conditions",
      paragraphs: [
        "This application is provided for personal budgeting, expense tracking, and educational use. Currency conversions use client-side display rates.",
        "You retain full ownership of your transaction history and may export or delete your records at any time.",
      ],
    },
    copyright: {
      title: "Copyright Policy",
      paragraphs: [
        "© 2026 Saptak Sardar (panda4596). All rights reserved.",
        "Original interface code, branding, and layout structure belong to Saptak Sardar unless noted otherwise for open-source libraries.",
      ],
    },
  };

  function openLegalModal(type) {
    const info = LEGAL_CONTENT[type] || LEGAL_CONTENT.privacy;
    el.legalModalTitle.textContent = info.title;
    el.legalModalBody.innerHTML = info.paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
    el.legalModal.classList.remove("hidden");
  }

  function closeLegalModal() {
    el.legalModal.classList.add("hidden");
  }

  // ------------------------------------------------------------------------
  // Account & Personal Details Modal
  // ------------------------------------------------------------------------
  function renderDraftExtraFields() {
    if (!state.draftExtraFields.length) {
      el.customFieldsList.innerHTML = "";
      return;
    }

    el.customFieldsList.innerHTML = state.draftExtraFields
      .map(
        (item, idx) => `
        <div class="custom-field-chip">
          <div>
            <strong>${escapeHtml(item.label)}:</strong>
            <span>${escapeHtml(item.value)}</span>
          </div>
          <button type="button" class="row-del-btn" data-remove-extra="${idx}" title="Remove detail" aria-label="Remove detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      `
      )
      .join("");
  }

  function openAccountModal() {
    if (!state.user) return;
    closeMobileSidebar();
    populateCountrySelectors();

    el.profileNameInput.value = state.profile.name || "";
    el.profilePhoneInput.value = state.profile.phone || "";
    el.profileCountrySelect.value = state.country;
    el.profileCurrencySelect.value = state.currency;
    el.profileLangSelect.value = state.lang;
    el.profileEmailInput.value = state.profile.email || state.user.email || "";
    el.profileCityInput.value = state.profile.city || "";
    el.profileGoalInput.value = state.profile.goal || "";
    el.profileBioInput.value = state.profile.bio || "";
    el.newExtraLabel.value = "";
    el.newExtraValue.value = "";

    state.draftExtraFields = state.profile.extraFields.map((x) => ({ ...x }));
    renderDraftExtraFields();

    el.accountModal.classList.remove("hidden");
    setTimeout(() => el.profileNameInput.focus(), 50);
  }

  function closeAccountModal() {
    el.accountModal.classList.add("hidden");
  }

  // ------------------------------------------------------------------------
  // Data Fetching & Converted Rendering
  // ------------------------------------------------------------------------
  async function refreshAllData() {
    renderSkeletons();
    try {
      const [balanceRes, catRes, monthlyRes, txRes] = await Promise.all([
        apiFetch("/api/balance"),
        apiFetch("/api/categories"),
        apiFetch("/api/summary/monthly"),
        fetchTransactionsFromServer(),
      ]);

      if (balanceRes?.success) state.balance = balanceRes;
      if (catRes?.success) state.categories = catRes;
      if (monthlyRes?.success) state.monthly = monthlyRes.monthly_summary || [];
      if (txRes?.success) state.transactions = txRes.transactions || [];

      renderOverview();
      renderTransactionsView();
      renderAnalyticsView();
    } catch (err) {
      if (err?.message !== "Unauthorized") {
        console.error("Dashboard load error:", err);
      }
    }
  }

  async function fetchTransactionsFromServer() {
    const params = new URLSearchParams();
    if (state.filters.type !== "all") params.append("type", state.filters.type);
    if (state.filters.dateFrom) params.append("date_from", state.filters.dateFrom);
    if (state.filters.dateTo) params.append("date_to", state.filters.dateTo);
    const qs = params.toString();
    return apiFetch(qs ? `/api/transactions?${qs}` : "/api/transactions");
  }

  async function reloadFilteredTransactions() {
    try {
      const res = await fetchTransactionsFromServer();
      if (res?.success) {
        state.transactions = res.transactions || [];
        renderTransactionsView();
      }
    } catch (err) {
      if (err?.message !== "Unauthorized") {
        console.error("Filter load error:", err);
      }
    }
  }

  function renderSkeletons() {
    if (!el.recentTxContainer.children.length) {
      el.recentTxContainer.innerHTML = Array(4)
        .fill(
          `<div class="tx-compact-row">
            <div class="skeleton" style="width: 42%"></div>
            <div class="skeleton" style="width: 90px"></div>
          </div>`
        )
        .join("");
    }
  }

  function getConvertedMonthlyForChart() {
    const rate = getCurrencyMeta().rateFromINR;
    return state.monthly.map((m) => ({
      ...m,
      income: (Number(m.income) || 0) * rate,
      expense: (Number(m.expense) || 0) * rate,
      savings: (Number(m.savings) || 0) * rate,
    }));
  }

  function getConvertedCategoriesForChart() {
    const rate = getCurrencyMeta().rateFromINR;
    const totals = {};
    Object.entries(state.categories.totals || {}).forEach(([k, v]) => {
      totals[k] = (Number(v) || 0) * rate;
    });
    return {
      ...state.categories,
      totals,
    };
  }

  // 1. Overview View
  function renderOverview() {
    const { total_income = 0, total_expense = 0, balance = 0 } = state.balance;

    animateConvertedCurrency(el.kpiBalance, balance);
    el.kpiBalance.classList.toggle("text-expense", balance < 0);
    el.kpiBalanceMeta.textContent =
      balance >= 0 ? t("kpiBalancePos")(state.currency) : t("kpiBalanceNeg")(state.currency);

    animateConvertedCurrency(el.kpiIncome, total_income);
    animateConvertedCurrency(el.kpiExpense, total_expense);

    const savingsRate =
      total_income > 0 ? ((total_income - total_expense) / total_income) * 100 : 0;
    const clampedBar = Math.max(0, Math.min(100, savingsRate));

    el.kpiSavingsRate.textContent = `${savingsRate.toFixed(1)}%`;
    el.kpiSavingsBar.style.width = `${clampedBar}%`;
    el.kpiSavingsBar.style.background =
      savingsRate < 0 ? "var(--expense)" : "var(--accent)";

    window.FinanceCharts.renderCashflow(getConvertedMonthlyForChart());
    window.FinanceCharts.renderCategories(getConvertedCategoriesForChart());

    const recent = state.transactions.slice(0, 6);
    if (recent.length === 0) {
      el.recentTxContainer.innerHTML = `
        <div style="padding: 36px 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
          ${escapeHtml(t("noTxYet"))}
        </div>`;
      return;
    }

    el.recentTxContainer.innerHTML = recent
      .map((tx) => {
        const isInc = tx.type === "Income";
        const kind = isInc ? "income" : "expense";
        const sign = isInc ? "+" : "-";
        const catLabel = translateCategory(tx.category);
        const title = tx.description ? escapeHtml(tx.description) : escapeHtml(catLabel);
        const subtitle = tx.description
          ? `${escapeHtml(catLabel)} · ${formatDisplayDate(tx.date)}`
          : formatDisplayDate(tx.date);

        const arrowSvg = isInc
          ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 17 10-10"/><path d="M7 7h10v10"/></svg>`
          : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7 17 17"/><path d="M17 7v10H7"/></svg>`;

        return `
          <div class="tx-compact-row">
            <div class="tx-compact-left">
              <span class="tx-dir-icon ${kind}">${arrowSvg}</span>
              <div class="tx-main-text">
                <span class="tx-title">${title}</span>
                <span class="tx-sub">${subtitle}</span>
              </div>
            </div>
            <div class="tx-compact-right">
              <span class="mono text-${kind}" style="font-weight: 600;">${sign}${formatMoneyFromINR(tx.amount)}</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // 2. Transactions Ledger View
  function getClientFilteredTransactions() {
    const search = state.filters.search.trim().toLowerCase();
    const cat = state.filters.category;

    return state.transactions.filter((tx) => {
      if (cat !== "all" && tx.category !== cat) return false;
      if (search) {
        const hay = `${tx.category} ${translateCategory(tx.category)} ${tx.description || ""} ${tx.date} ${tx.amount}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }

  function renderTransactionsView() {
    const list = getClientFilteredTransactions();
    el.navTxBadge.textContent = String(state.transactions.length);

    let inflowINR = 0;
    let outflowINR = 0;
    list.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "Income") inflowINR += amt;
      else outflowINR += amt;
    });

    el.txFilteredCount.textContent = `${list.length} ${t("navTransactions").toLowerCase()}`;
    el.txFilteredIn.textContent = `+${formatMoneyFromINR(inflowINR)}`;
    el.txFilteredOut.textContent = `-${formatMoneyFromINR(outflowINR)}`;
    el.txFilteredNet.textContent = `${t("netLabel")} ${formatMoneyFromINR(inflowINR - outflowINR)}`;

    if (list.length === 0) {
      el.transactionsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-cell">${escapeHtml(t("noTxMatch"))}</td>
        </tr>`;
      return;
    }

    el.transactionsTableBody.innerHTML = list
      .map((tx) => {
        const isInc = tx.type === "Income";
        const kind = isInc ? "income" : "expense";
        const sign = isInc ? "+" : "-";
        const color = window.FinanceCharts.getCategoryColor(tx.category);

        return `
          <tr>
            <td class="mono muted" style="white-space: nowrap;">${formatDisplayDate(tx.date)}</td>
            <td>
              <span class="cat-cell">
                <i class="cat-dot" style="background:${color}"></i>
                ${escapeHtml(translateCategory(tx.category))}
              </span>
            </td>
            <td style="color: var(--text-secondary); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${tx.description ? escapeHtml(tx.description) : '<span class="muted">—</span>'}
            </td>
            <td><span class="type-badge ${kind}">${escapeHtml(translateTxType(tx.type))}</span></td>
            <td class="text-right mono text-${kind}" style="font-weight: 600; white-space: nowrap;">
              ${sign}${formatMoneyFromINR(tx.amount)}
            </td>
            <td class="text-right">
              <button type="button" class="row-del-btn" data-delete-id="${tx.id}" title="Delete transaction" aria-label="Delete transaction">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // 3. Analytics View
  function renderAnalyticsView() {
    if (!state.monthly.length) {
      el.monthlyTableBody.innerHTML = `
        <tr><td colspan="5" class="empty-cell">${escapeHtml(t("noMonthlyYet"))}</td></tr>`;
    } else {
      el.monthlyTableBody.innerHTML = state.monthly
        .map((m) => {
          const inc = Number(m.income) || 0;
          const exp = Number(m.expense) || 0;
          const sav = Number(m.savings) || 0;
          const rate = inc > 0 ? (sav / inc) * 100 : sav < 0 ? -100 : 0;
          const barWidth = Math.min(100, Math.abs(rate));

          return `
            <tr>
              <td style="font-weight: 500; white-space: nowrap;">${formatMonthName(m.month)}</td>
              <td class="text-right mono text-income">${formatMoneyFromINR(inc)}</td>
              <td class="text-right mono text-expense">${formatMoneyFromINR(exp)}</td>
              <td class="text-right mono" style="font-weight: 600; color: ${sav >= 0 ? "var(--text-primary)" : "var(--expense)"}">
                ${formatMoneyFromINR(sav)}
              </td>
              <td>
                <div class="eff-cell">
                  <div class="eff-track">
                    <div class="eff-fill ${sav < 0 ? "negative" : ""}" style="width: ${barWidth}%"></div>
                  </div>
                  <span class="mono muted" style="font-size: 11.5px; width: 44px; text-align: right;">
                    ${rate.toFixed(0)}%
                  </span>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    const cats = (state.categories.categories || [])
      .map((name) => ({
        name,
        amount: Number(state.categories.totals?.[name]) || 0,
      }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const totalExp = cats.reduce((s, c) => s + c.amount, 0);

    if (!cats.length) {
      el.categoryBreakdownList.innerHTML = `
        <div style="text-align:center; padding: 30px 10px; color: var(--text-muted); font-size: 13px;">
          ${escapeHtml(t("noExpensesYet"))}
        </div>`;
      return;
    }

    el.categoryBreakdownList.innerHTML = cats
      .map((c) => {
        const pct = totalExp > 0 ? (c.amount / totalExp) * 100 : 0;
        const color = window.FinanceCharts.getCategoryColor(c.name);
        return `
          <div class="breakdown-item">
            <div class="breakdown-top">
              <span class="cat-cell">
                <i class="cat-dot" style="background:${color}"></i>
                ${escapeHtml(translateCategory(c.name))}
              </span>
              <div class="breakdown-meta">
                <span class="breakdown-pct mono">${pct.toFixed(1)}%</span>
                <strong class="mono">${formatMoneyFromINR(c.amount)}</strong>
              </div>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${pct}%; background:${color}"></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ------------------------------------------------------------------------
  // Navigation & Drawer Controls
  // ------------------------------------------------------------------------
  function switchView(viewName) {
    if (!el.views[viewName]) return;
    state.activeView = viewName;

    Object.entries(el.views).forEach(([key, section]) => {
      const isTarget = key === viewName;
      section.classList.toggle("hidden", !isTarget);
      if (isTarget) {
        section.classList.remove("view-enter");
        void section.offsetWidth;
        section.classList.add("view-enter");
      }
    });

    el.navItems.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    const dict = I18N[state.lang] || I18N.en;
    const [title, subtitle] = dict.views[viewName] || dict.views.overview;
    el.pageTitle.textContent = title;
    el.pageSubtitle.textContent = subtitle;

    if (viewName === "overview") {
      window.FinanceCharts?.renderCashflow(getConvertedMonthlyForChart());
      window.FinanceCharts?.renderCategories(getConvertedCategoriesForChart());
    }

    closeMobileSidebar();
  }

  function openMobileSidebar() {
    el.sidebar.classList.add("open");
    el.sidebarBackdrop.classList.remove("hidden");
  }

  function closeMobileSidebar() {
    el.sidebar.classList.remove("open");
    el.sidebarBackdrop.classList.add("hidden");
  }

  function setDrawerType(type) {
    state.drawerType = type;
    const isExp = type === "Expense";
    el.drawerTypeExpense.classList.toggle("active", isExp);
    el.drawerTypeIncome.classList.toggle("active", !isExp);
    el.txSubmitBtn.textContent = isExp ? t("recordExpenseBtn") : t("recordIncomeBtn");
    el.txSubmitBtn.className = `btn flex-1 ${isExp ? "btn-expense" : "btn-income"}`;
    updateDrawerCategories();
  }

  function updateDrawerCategories() {
    if (!el.txCategory) return;
    const prev = el.txCategory.value;
    const list =
      state.drawerType === "Income"
        ? state.config.income_categories
        : state.config.expense_categories;

    el.txCategory.innerHTML = list
      .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(translateCategory(c))}</option>`)
      .join("");
    if (prev && list.includes(prev)) el.txCategory.value = prev;
  }

  function populateCategoryFilter() {
    if (!el.filterCategory) return;
    const prev = el.filterCategory.value || "all";
    const merged = Array.from(
      new Set([...state.config.expense_categories, ...state.config.income_categories])
    );
    el.filterCategory.innerHTML =
      `<option value="all">${escapeHtml(t("allCategories"))}</option>` +
      merged.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(translateCategory(c))}</option>`).join("");
    el.filterCategory.value = prev;
  }

  function openDrawer(initialType = "Expense") {
    setDrawerType(initialType);
    applyLanguage();
    if (!el.txDate.value) el.txDate.value = todayISO();
    el.drawerBackdrop.classList.remove("hidden");
    el.txDrawer.classList.remove("hidden");
    setTimeout(() => el.txAmount.focus(), 60);
  }

  function closeDrawer() {
    el.drawerBackdrop.classList.add("hidden");
    el.txDrawer.classList.add("hidden");
  }

  function openDeleteModal(tx) {
    state.pendingDeleteTx = tx;
    el.deleteModalDesc.textContent = `${translateTxType(tx.type)} — ${formatMoneyFromINR(
      tx.amount
    )} (${translateCategory(tx.category)}) · ${formatDisplayDate(tx.date)}`;
    el.deleteModal.classList.remove("hidden");
  }

  function closeDeleteModal() {
    state.pendingDeleteTx = null;
    el.deleteModal.classList.add("hidden");
  }

  // ------------------------------------------------------------------------
  // CSV Export (Exports in active currency)
  // ------------------------------------------------------------------------
  function exportCurrentCSV() {
    const rows = getClientFilteredTransactions();
    if (!rows.length) {
      toast("No transactions to export.", "error");
      return;
    }

    const csvEscape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const headers = ["Date", "Type", "Category", "Description", `Amount (${state.currency})`];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [
          csvEscape(r.date),
          csvEscape(r.type),
          csvEscape(r.category),
          csvEscape(r.description || ""),
          fromINR(r.amount || 0).toFixed(2),
        ].join(",")
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `panda-finance-${state.currency}-${todayISO()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast(`Exported ${rows.length} rows (${state.currency}) to CSV.`, "success");
  }

  // ------------------------------------------------------------------------
  // Event Binding
  // ------------------------------------------------------------------------
  function bindUIEvents() {
    el.authLangSelect?.addEventListener("change", (e) => setLanguage(e.target.value));
    el.authCountrySelect?.addEventListener("change", (e) => setCountryAndCurrency(e.target.value));

    el.dashLangSelect?.addEventListener("change", (e) => setLanguage(e.target.value));
    el.dashCurrencySelect?.addEventListener("change", (e) => {
      setCountryAndCurrency(state.country, e.target.value);
    });

    el.profileCountrySelect?.addEventListener("change", (e) => {
      const cObj = COUNTRIES.find((c) => c.code === e.target.value);
      if (cObj && el.profileCurrencySelect) {
        el.profileCurrencySelect.value = cObj.currency;
      }
    });

    el.tabLogin.addEventListener("click", () => {
      state.isSignupMode = false;
      el.tabLogin.classList.add("active");
      el.tabSignup.classList.remove("active");
      el.resetBox.classList.add("hidden");
      applyLanguage();
    });

    el.tabSignup.addEventListener("click", () => {
      state.isSignupMode = true;
      el.tabSignup.classList.add("active");
      el.tabLogin.classList.remove("active");
      el.resetBox.classList.add("hidden");
      applyLanguage();
    });

    el.togglePasswordBtn.addEventListener("click", () => {
      const isHidden = el.authPassword.type === "password";
      el.authPassword.type = isHidden ? "text" : "password";
    });

    el.forgotPasswordBtn.addEventListener("click", () => {
      el.resetBox.classList.remove("hidden");
      el.resetEmail.value = el.authEmail.value;
      el.resetEmail.focus();
    });

    el.cancelResetBtn.addEventListener("click", () => {
      el.resetBox.classList.add("hidden");
    });

    el.sendResetBtn.addEventListener("click", async () => {
      const email = el.resetEmail.value.trim();
      if (!email) return toast("Enter your account email first.", "error");

      el.sendResetBtn.disabled = true;
      el.sendResetBtn.textContent = "...";
      try {
        const { error } = await state.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) toast(error.message, "error");
        else {
          toast("Recovery link sent. Check your inbox.", "success");
          el.resetBox.classList.add("hidden");
        }
      } catch {
        toast("Failed to send reset link.", "error");
      } finally {
        el.sendResetBtn.disabled = false;
        el.sendResetBtn.textContent = t("sendLinkBtn");
      }
    });

    el.authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = el.authEmail.value.trim();
      const password = el.authPassword.value;

      if (!email || !password) {
        return toast("Please enter both email and password.", "error");
      }

      el.authSubmitBtn.disabled = true;
      el.authSubmitBtn.textContent = "...";

      try {
        if (state.isSignupMode) {
          const { data, error } = await state.supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                country: state.country,
                currency: state.currency,
                lang: state.lang,
              },
            },
          });
          if (error) {
            toast(error.message, "error");
          } else if (data?.user) {
            saveLocalProfile(data.user.id, {
              name: email.split("@")[0],
              email,
              phone: "",
              city: "",
              goal: "",
              bio: "",
              country: state.country,
              currency: state.currency,
              lang: state.lang,
              extraFields: [],
            });
          }

          if (!error) {
            if (data?.session) toast("Account created and signed in.", "success");
            else toast("Account created! Confirm your email to sign in.", "success");
          }
        } else {
          const { error } = await state.supabase.auth.signInWithPassword({ email, password });
          if (error) toast(error.message, "error");
          else toast("Signed in successfully.", "success");
        }
      } catch {
        toast("Authentication failed. Try again.", "error");
      } finally {
        el.authSubmitBtn.disabled = false;
        applyLanguage();
      }
    });

    el.logoutBtn.addEventListener("click", async () => {
      await safeLocalSignOut();
      handleLoggedOut();
      toast("Signed out.", "success");
    });

    el.dismissGreetingBtn.addEventListener("click", () => {
      el.greetingBanner.classList.add("hidden");
    });
    el.greetingProfileBtn.addEventListener("click", openAccountModal);
    el.openAccountBtn.addEventListener("click", openAccountModal);
    el.quickAddExpenseBtn.addEventListener("click", () => openDrawer("Expense"));
    el.quickAddIncomeBtn.addEventListener("click", () => openDrawer("Income"));

    el.backToTopLink?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.querySelectorAll("[data-legal-modal]").forEach((btn) => {
      btn.addEventListener("click", () => openLegalModal(btn.dataset.legalModal));
    });

    document.addEventListener("portfolio:open-legal", (e) => {
      if (e.detail?.type) openLegalModal(e.detail.type);
    });

    el.closeLegalModalBtn?.addEventListener("click", closeLegalModal);
    el.okLegalModalBtn?.addEventListener("click", closeLegalModal);
    el.legalModal?.addEventListener("click", (e) => {
      if (e.target === el.legalModal) closeLegalModal();
    });

    el.closeAccountModalBtn.addEventListener("click", closeAccountModal);
    el.cancelAccountBtn.addEventListener("click", closeAccountModal);
    el.accountModal.addEventListener("click", (e) => {
      if (e.target === el.accountModal) closeAccountModal();
    });

    el.addExtraFieldBtn.addEventListener("click", () => {
      const label = el.newExtraLabel.value.trim();
      const value = el.newExtraValue.value.trim();
      if (!label || !value) {
        return toast("Enter both a label and a value for the extra detail.", "error");
      }
      state.draftExtraFields.push({ label, value });
      el.newExtraLabel.value = "";
      el.newExtraValue.value = "";
      renderDraftExtraFields();
    });

    el.customFieldsList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-extra]");
      if (!btn) return;
      const idx = Number(btn.dataset.removeExtra);
      state.draftExtraFields.splice(idx, 1);
      renderDraftExtraFields();
    });

    el.accountForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!state.user) return;

      const name = el.profileNameInput.value.trim();
      const email = el.profileEmailInput.value.trim();
      const phone = el.profilePhoneInput.value.trim();
      const country = el.profileCountrySelect.value || "IN";
      const currency = el.profileCurrencySelect.value || "INR";
      const lang = el.profileLangSelect.value || "en";
      const city = el.profileCityInput.value.trim();
      const goal = el.profileGoalInput.value.trim();
      const bio = el.profileBioInput.value.trim();

      if (!name) return toast("Name cannot be empty.", "error");
      if (!email) return toast("Email cannot be empty.", "error");

      const updatedProfile = {
        name,
        email,
        phone,
        city,
        goal,
        bio,
        country,
        currency,
        lang,
        extraFields: state.draftExtraFields.map((x) => ({ ...x })),
      };

      el.saveAccountBtn.disabled = true;
      el.saveAccountBtn.textContent = t("savingBtn");

      try {
        const updatePayload = {
          data: {
            full_name: name,
            phone,
            city,
            monthly_goal: goal,
            bio,
            country,
            currency,
            lang,
            extra_fields: updatedProfile.extraFields,
          },
        };

        const emailChanged = email.toLowerCase() !== (state.user.email || "").toLowerCase();
        if (emailChanged) {
          updatePayload.email = email;
        }

        const { data, error } = await state.supabase.auth.updateUser(updatePayload);
        if (error) {
          toast(error.message, "error");
          return;
        }

        if (data?.user) {
          state.user = data.user;
        }
        state.profile = updatedProfile;
        saveLocalProfile(state.user.id, updatedProfile);
        setLanguage(lang);
        setCountryAndCurrency(country, currency);
        closeAccountModal();

        if (emailChanged) {
          toast("Profile saved! Check both email inboxes to confirm email change.", "success");
        } else {
          toast("Account, country, language & currency saved.", "success");
        }
      } catch {
        toast("Could not update profile details.", "error");
      } finally {
        el.saveAccountBtn.disabled = false;
        el.saveAccountBtn.textContent = t("saveDetailsBtn");
      }
    });

    el.themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });

    el.navItems.forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });
    el.viewAllTxBtn.addEventListener("click", () => switchView("transactions"));
    el.mobileMenuBtn.addEventListener("click", openMobileSidebar);
    el.closeSidebarBtn.addEventListener("click", closeMobileSidebar);
    el.sidebarBackdrop.addEventListener("click", closeMobileSidebar);

    el.globalSearchInput.addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      el.txSearchInput.value = e.target.value;
      if (state.activeView !== "transactions" && e.target.value.trim().length > 0) {
        switchView("transactions");
      }
      renderTransactionsView();
    });

    el.typeFilterPills.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill-btn");
      if (!btn) return;
      el.typeFilterPills.querySelectorAll(".pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.filters.type = btn.dataset.type;
      reloadFilteredTransactions();
    });

    el.txSearchInput.addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      el.globalSearchInput.value = e.target.value;
      renderTransactionsView();
    });

    el.filterCategory.addEventListener("change", (e) => {
      state.filters.category = e.target.value;
      renderTransactionsView();
    });

    el.filterDateFrom.addEventListener("change", (e) => {
      state.filters.dateFrom = e.target.value;
      reloadFilteredTransactions();
    });

    el.filterDateTo.addEventListener("change", (e) => {
      state.filters.dateTo = e.target.value;
      reloadFilteredTransactions();
    });

    el.clearFiltersBtn.addEventListener("click", () => {
      state.filters = { type: "all", category: "all", dateFrom: "", dateTo: "", search: "" };
      el.txSearchInput.value = "";
      el.globalSearchInput.value = "";
      el.filterCategory.value = "all";
      el.filterDateFrom.value = "";
      el.filterDateTo.value = "";
      el.typeFilterPills.querySelectorAll(".pill-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.type === "all");
      });
      reloadFilteredTransactions();
    });

    el.exportCsvBtn.addEventListener("click", exportCurrentCSV);

    el.openDrawerBtn.addEventListener("click", () => openDrawer("Expense"));
    el.closeDrawerBtn.addEventListener("click", closeDrawer);
    el.cancelDrawerBtn.addEventListener("click", closeDrawer);
    el.drawerBackdrop.addEventListener("click", closeDrawer);
    el.drawerTypeExpense.addEventListener("click", () => setDrawerType("Expense"));
    el.drawerTypeIncome.addEventListener("click", () => setDrawerType("Income"));

    document.querySelectorAll(".quick-amt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const inc = Number(btn.dataset.add) || 0;
        const current = Number(el.txAmount.value) || 0;
        el.txAmount.value = current + inc;
        el.txAmount.focus();
      });
    });

    el.txForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const rawDisplayAmount = Number(el.txAmount.value.trim());
      const category = el.txCategory.value;
      const date = el.txDate.value || todayISO();
      const description = el.txDesc.value.trim();

      if (!rawDisplayAmount || rawDisplayAmount <= 0) {
        return toast("Please enter a valid positive amount.", "error");
      }

      const amountInINR = Number(toINR(rawDisplayAmount).toFixed(2));
      const endpoint = state.drawerType === "Income" ? "/api/income" : "/api/expense";
      el.txSubmitBtn.disabled = true;
      el.txSubmitBtn.textContent = t("savingBtn");

      try {
        const res = await apiFetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ amount: amountInINR, category, date, description }),
        });

        if (res.success) {
          toast(
            `${translateTxType(state.drawerType)}: ${formatDirectDisplayAmount(rawDisplayAmount)}`,
            "success"
          );
          el.txAmount.value = "";
          el.txDesc.value = "";
          el.txDate.value = todayISO();
          closeDrawer();
          await refreshAllData();
        } else {
          toast(res.message || "Could not save transaction.", "error");
        }
      } catch {
        toast("Request failed. Check your connection.", "error");
      } finally {
        el.txSubmitBtn.disabled = false;
        setDrawerType(state.drawerType);
      }
    });

    el.transactionsTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-delete-id]");
      if (!btn) return;
      const tx = state.transactions.find((item) => String(item.id) === String(btn.dataset.deleteId));
      if (tx) openDeleteModal(tx);
    });

    el.cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    el.deleteModal.addEventListener("click", (e) => {
      if (e.target === el.deleteModal) closeDeleteModal();
    });

    el.confirmDeleteBtn.addEventListener("click", async () => {
      if (!state.pendingDeleteTx) return;
      const id = state.pendingDeleteTx.id;

      el.confirmDeleteBtn.disabled = true;
      el.confirmDeleteBtn.textContent = "...";

      try {
        const res = await apiFetch(`/api/transactions/${id}`, { method: "DELETE" });
        if (res.success) {
          toast("Transaction deleted.", "success");
          closeDeleteModal();
          await refreshAllData();
        } else {
          toast(res.message || "Failed to delete.", "error");
        }
      } catch {
        toast("Error deleting transaction.", "error");
      } finally {
        el.confirmDeleteBtn.disabled = false;
        el.confirmDeleteBtn.textContent = t("deleteBtn");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!state.user) return;
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Escape") {
        closeDrawer();
        closeDeleteModal();
        closeAccountModal();
        closeLegalModal();
        closeMobileSidebar();
        return;
      }

      if (typing) return;

      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        openDrawer("Expense");
      } else if (e.key === "/") {
        e.preventDefault();
        if (window.innerWidth > 900) {
          el.globalSearchInput.focus();
        } else {
          switchView("transactions");
          el.txSearchInput.focus();
        }
      }
    });
  }

  boot();
});