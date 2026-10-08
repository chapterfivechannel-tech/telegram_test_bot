from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import hashlib
import hmac
from urllib.parse import parse_qsl

app = Flask(__name__)
CORS(app, resources={r"/telegram-auth": {"origins": "*"}})

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


def validate_telegram_init_data(init_data):
    if not init_data:
        return None

    try:
        parsed = dict(
            parse_qsl(
                init_data,
                keep_blank_values=True
            )
        )

        received_hash = parsed.pop("hash", None)

        if not received_hash:
            return None

        data_check_string = "\n".join(
            f"{key}={value}"
            for key, value in sorted(parsed.items())
        )

        secret_key = hmac.new(
            b"WebAppData",
            BOT_TOKEN.encode(),
            hashlib.sha256
        ).digest()

        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(
            calculated_hash,
            received_hash
        ):
            return None

        user_data = json.loads(
            parsed["user"]
        )

        return user_data

    except Exception as error:

        print("Validation error:", error)

        return None


@app.route("/telegram-auth", methods=["POST"])
def telegram_auth():

    data = request.get_json()

    if not data:
        return jsonify({
            "ok": False,
            "error": "No JSON received"
        }), 400

    init_data = data.get("initData")

    if not init_data:
        return jsonify({
            "ok": False,
            "error": "No initData"
        }), 400

    user = validate_telegram_init_data(
        init_data
    )

    if not user:

        print("❌ Telegram verification FAILED")

        return jsonify({
            "ok": False,
            "error": "Invalid Telegram data"
        }), 401

    print()
    print("==============================")
    print("TELEGRAM USER VERIFIED")
    print("==============================")
    print("ID:", user.get("id"))
    print("First name:", user.get("first_name"))
    print("Last name:", user.get("last_name", ""))
    print("Username:", user.get("username", ""))
    print("Language:", user.get("language_code", ""))
    print("==============================")
    print()

    return jsonify({
        "ok": True,
        "user": user
    })


if __name__ == "__main__":

    if not BOT_TOKEN:
        raise RuntimeError(
            "TELEGRAM_BOT_TOKEN is not set."
        )

    print()
    print("Python Telegram backend starting...")
    print("http://127.0.0.1:8000")
    print()

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )