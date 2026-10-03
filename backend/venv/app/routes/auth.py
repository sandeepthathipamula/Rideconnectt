from fastapi import APIRouter
from app.schemas.auth import SendOTP, VerifyOTP
from app.database import SessionLocal
from app.models.user import User

from twilio.rest import Client
from dotenv import load_dotenv
import os

router = APIRouter()

load_dotenv()

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID")

client = Client(
    ACCOUNT_SID,
    AUTH_TOKEN
)


@router.post("/send-otp")
def send_otp(request: SendOTP):

    try:

        verification = (
            client.verify.v2
            .services(VERIFY_SERVICE_SID)
            .verifications
            .create(
                to=f"+91{request.mobile}",
                channel="sms"
            )
        )

        return {
            "success": True,
            "message": "OTP sent successfully",
            "status": verification.status
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


@router.post("/verify-otp")
def verify_otp(request: VerifyOTP):

    try:

        check = (
            client.verify.v2
            .services(VERIFY_SERVICE_SID)
            .verification_checks
            .create(
                to=f"+91{request.mobile}",
                code=request.otp
            )
        )

        if check.status != "approved":

            return {
                "success": False,
                "message": "Invalid OTP"
            }

        db = SessionLocal()

        try:

            user = (
                db.query(User)
                .filter(User.mobile == request.mobile)
                .first()
            )

            if not user:

                user = User(
                    mobile=request.mobile
                )

                db.add(user)
                db.commit()
                db.refresh(user)

            return {
                "success": True,
                "message": "Verification successful",
                "user_id": user.id,
                "mobile": user.mobile
            }

        finally:
            db.close()

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }