import os
from datetime import datetime
from functools import wraps
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv
from supabase import create_client, Client, ClientOptions

# Load environment variables from .env file (if present)
load_dotenv()

app = Flask(__name__, static_folder="static")

# -----------------------------------------------------------------------------
# Configuration & Supabase Initialization
# -----------------------------------------------------------------------------
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# Standard Categories (Preserves your original 6 expense categories)
EXPENSE_CATEGORIES = [
    "Food",
    "Education",
    "Transport",
    "Shopping",
    "Entertainment",
    "Other"
]

INCOME_CATEGORIES = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Other"
]

# Base Supabase client for auth token verification
supabase_base: Client = None
if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL.startswith("http"):
    try:
        supabase_base = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client: {e}")


def get_user_supabase_client(token: str) -> Client:
    """
    Creates a scoped Supabase client with the user's JWT access token.
    This ensures that all PostgreSQL queries enforce Row Level Security (RLS)
    so PostgreSQL knows which user is executing the query (auth.uid()).
    """
    opts = ClientOptions(headers={"Authorization": f"Bearer {token}"})
    return create_client(SUPABASE_URL, SUPABASE_KEY, options=opts)


def require_auth(f):
    """
    Authentication Decorator:
    Extracts the Bearer JWT token from the HTTP Authorization header,
    verifies it with Supabase Auth, and passes the authenticated `user`
    and `user_client` to the route function.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not supabase_base:
            return jsonify({
                "success": False,
                "message": "Supabase credentials are not configured. Please check your .env file."
            }), 500

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Authorization token is missing. Please log in."
            }), 401

        token = auth_header.split(" ")[1].strip()
        if not token:
            return jsonify({
                "success": False,
                "message": "Empty authorization token. Please log in again."
            }), 401

        try:
            # Verify the token cryptographically with Supabase Auth
            user_response = supabase_base.auth.get_user(token)
            if not user_response or not user_response.user:
                return jsonify({
                    "success": False,
                    "message": "Invalid or expired session. Please log in again."
                }), 401

            user = user_response.user
            user_client = get_user_supabase_client(token)
            return f(user=user, user_client=user_client, *args, **kwargs)

        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Authentication verification failed: {str(e)}"
            }), 401

    return decorated_function


# -----------------------------------------------------------------------------
# Static & Public Routes
# -----------------------------------------------------------------------------
@app.route("/")
def index():
    """Serves the single-page frontend application."""
    return send_from_directory("static", "index.html")


@app.route("/static/<path:filename>")
def serve_static(filename):
    """Serves CSS, JavaScript, and other static assets."""
    return send_from_directory("static", filename)


@app.route("/api/config", methods=["GET"])
def get_config():
    """
    Provides public Supabase configuration and category lists to the frontend.
    NOTE: Only the public SUPABASE_URL and publishable anon key are shared.
    Never expose the service-role key here.
    """
    return jsonify({
        "supabase_url": SUPABASE_URL,
        "supabase_anon_key": SUPABASE_KEY,
        "expense_categories": EXPENSE_CATEGORIES,
        "income_categories": INCOME_CATEGORIES
    })


# -----------------------------------------------------------------------------
# Feature 1: Add Income
# Original Logic Preserved:
#   Validates float(amount) > 0 and records transaction for the current user.
# -----------------------------------------------------------------------------
@app.route("/api/income", methods=["POST"])
@require_auth
def add_income(user, user_client):
    data = request.get_json(silent=True) or {}
    raw_amount = data.get("amount")
    category = data.get("category", "Other")
    description = (data.get("description") or "").strip()
    date_str = (data.get("date") or "").strip()

    # 1. Number Validation (Original logic)
    try:
        income = float(raw_amount)
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Please enter numbers only"}), 400

    # 2. Positive Amount Validation (Original logic)
    if income <= 0:
        return jsonify({
            "success": False,
            "message": "Wrong amount\nPlease enter correct amount"
        }), 400

    # 3. Category Validation
    if category not in INCOME_CATEGORIES:
        category = "Other"

    # 4. Date Validation (Defaults to today)
    if date_str:
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"success": False, "message": "Invalid date format. Use YYYY-MM-DD"}), 400
    else:
        date_str = datetime.utcnow().strftime("%Y-%m-%d")

    # 5. Insert Record into Supabase PostgreSQL
    try:
        payload = {
            "user_id": str(user.id),
            "type": "Income",
            "amount": income,
            "category": category,
            "description": description,
            "date": date_str
        }
        res = user_client.table("transactions").insert(payload).execute()
        return jsonify({
            "success": True,
            "message": f"Income of ₹{income:g} recorded successfully!",
            "record": res.data[0] if res.data else payload
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Database error recording income: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# Feature 2: Add Expense
# Original Logic Preserved:
#   Validates float(amount) > 0, validates category, and records transaction.
# -----------------------------------------------------------------------------
@app.route("/api/expense", methods=["POST"])
@require_auth
def add_expense(user, user_client):
    data = request.get_json(silent=True) or {}
    raw_amount = data.get("amount")
    category = data.get("category")
    description = (data.get("description") or "").strip()
    date_str = (data.get("date") or "").strip()

    # 1. Number Validation (Original logic)
    try:
        expense = float(raw_amount)
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Please enter numbers only"}), 400

    # 2. Positive Amount Validation (Original logic)
    if expense <= 0:
        return jsonify({
            "success": False,
            "message": "Wrong amount\nPlease enter correct amount"
        }), 400

    # 3. Category Validation (Original logic)
    if category not in EXPENSE_CATEGORIES:
        return jsonify({"success": False, "message": "Invalid Category"}), 400

    # 4. Date Validation (Defaults to today)
    if date_str:
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"success": False, "message": "Invalid date format. Use YYYY-MM-DD"}), 400
    else:
        date_str = datetime.utcnow().strftime("%Y-%m-%d")

    # 5. Insert Record into Supabase PostgreSQL
    try:
        payload = {
            "user_id": str(user.id),
            "type": "Expense",
            "amount": expense,
            "category": category,
            "description": description,
            "date": date_str
        }
        res = user_client.table("transactions").insert(payload).execute()
        return jsonify({
            "success": True,
            "message": f"Expense of ₹{expense:g} recorded successfully!",
            "record": res.data[0] if res.data else payload
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Database error recording expense: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# Feature 3: View Transactions (with Filtering)
# -----------------------------------------------------------------------------
@app.route("/api/transactions", methods=["GET"])
@require_auth
def get_transactions(user, user_client):
    tx_type = request.args.get("type", "all").strip().capitalize()
    date_from = request.args.get("date_from", "").strip()
    date_to = request.args.get("date_to", "").strip()

    try:
        # Build query for the current authenticated user
        query = user_client.table("transactions").select("*").eq("user_id", user.id)

        if tx_type in ("Income", "Expense"):
            query = query.eq("type", tx_type)

        if date_from:
            query = query.gte("date", date_from)

        if date_to:
            query = query.lte("date", date_to)

        # Order by date descending, then created_at descending
        query = query.order("date", desc=True).order("created_at", desc=True)

        res = query.execute()
        records = res.data or []

        return jsonify({
            "success": True,
            "total_count": len(records),
            "transactions": records
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to retrieve transactions: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# Feature 4: Delete Transaction
# -----------------------------------------------------------------------------
@app.route("/api/transactions/<tx_id>", methods=["DELETE"])
@require_auth
def delete_transaction(user, user_client, tx_id):
    try:
        # Ensure deletion only applies to records owned by the authenticated user
        res = (
            user_client.table("transactions")
            .delete()
            .eq("id", tx_id)
            .eq("user_id", user.id)
            .execute()
        )

        return jsonify({
            "success": True,
            "message": "Transaction deleted successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to delete transaction: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# Feature 5: View Balance (Preserves your Python calculation logic)
# -----------------------------------------------------------------------------
@app.route("/api/balance", methods=["GET"])
@require_auth
def get_balance(user, user_client):
    try:
        res = user_client.table("transactions").select("type, amount").eq("user_id", user.id).execute()
        records = res.data or []

        # Original calculation logic preserved in Python:
        total_income = 0.0
        total_expense = 0.0

        for row in records:
            amount = float(row.get("amount", 0.0))
            if row.get("type") == "Income":
                total_income += amount
            elif row.get("type") == "Expense":
                total_expense += amount

        balance = total_income - total_expense

        return jsonify({
            "success": True,
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to calculate balance: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# Feature 6: Category Summary (Preserves your Python grouping logic)
# -----------------------------------------------------------------------------
@app.route("/api/categories", methods=["GET"])
@require_auth
def get_category_summary(user, user_client):
    try:
        res = (
            user_client.table("transactions")
            .select("amount, category")
            .eq("user_id", user.id)
            .eq("type", "Expense")
            .execute()
        )
        records = res.data or []

        # Original aggregation logic preserved in Python:
        category_totals = {cat: 0.0 for cat in EXPENSE_CATEGORIES}
        has_expenses = False

        for row in records:
            amount = float(row.get("amount", 0.0))
            cat = row.get("category", "Other")
            if cat in category_totals:
                category_totals[cat] += amount
            else:
                category_totals[cat] = amount
            has_expenses = True

        return jsonify({
            "success": True,
            "has_expenses": has_expenses,
            "categories": EXPENSE_CATEGORIES,
            "totals": category_totals
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to calculate category summary: {str(e)}"
        }), 500


# -----------------------------------------------------------------------------
# Feature 7: Monthly Summary (New Python calculation)
# -----------------------------------------------------------------------------
@app.route("/api/summary/monthly", methods=["GET"])
@require_auth
def get_monthly_summary(user, user_client):
    try:
        res = (
            user_client.table("transactions")
            .select("type, amount, date")
            .eq("user_id", user.id)
            .order("date", desc=True)
            .execute()
        )
        records = res.data or []

        # Group by month (YYYY-MM) in Python
        monthly_data = {}

        for row in records:
            date_val = str(row.get("date", ""))
            month_key = date_val[:7] if len(date_val) >= 7 else "Unknown"
            amount = float(row.get("amount", 0.0))
            tx_type = row.get("type")

            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "month": month_key,
                    "income": 0.0,
                    "expense": 0.0,
                    "savings": 0.0
                }

            if tx_type == "Income":
                monthly_data[month_key]["income"] += amount
            elif tx_type == "Expense":
                monthly_data[month_key]["expense"] += amount

        for m in monthly_data.values():
            m["savings"] = m["income"] - m["expense"]

        sorted_months = sorted(monthly_data.values(), key=lambda x: x["month"], reverse=True)

        return jsonify({
            "success": True,
            "monthly_summary": sorted_months
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to calculate monthly summary: {str(e)}"
        }), 500


if __name__ == "__main__":
    print("Personal Finance Tracker is running on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
