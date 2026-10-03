from fastapi import APIRouter

from app.database import SessionLocal

from app.schemas.driver import AcceptRide
from app.schemas.ride import RideRequest
from app.schemas.ride import VerifyRideOTP

from app.models.ride import Ride
from app.models.user import User
from app.models.driver import Driver
import random
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="rideconnect")

router = APIRouter()


@router.post("/create-ride")
def create_ride(data: RideRequest):

    db = SessionLocal()

    try:

        print("Latitude:", data.pickup_lat)
        print("Longitude:", data.pickup_lng)
        print("Drop Location:", data.drop_location)

        # Convert coordinates to address
        try:
            location = geolocator.reverse(
                f"{data.pickup_lat},{data.pickup_lng}", exactly_one=True
            )

            pickup_address = location.address if location else "Unknown Location"

        except Exception as e:
            print("Geocoding Error:", e)
            pickup_address = "Unknown Location"

        print("Resolved Address:", pickup_address)

        user = db.query(User).filter(User.mobile == data.mobile).first()

        if not user:
            return {"success": False, "message": "User not found"}

        ride = Ride(
            rider_id=user.id,
            pickup_address=pickup_address,
            pickup_lat=data.pickup_lat,
            pickup_lng=data.pickup_lng,
            drop_address=data.drop_location,
            ride_type=data.ride_type,
            status="SEARCHING",
        )

        db.add(ride)
        db.commit()
        db.refresh(ride)

        return {
            "success": True,
            "ride_id": ride.id,
            "status": ride.status,
            "pickup_address": ride.pickup_address,
            "pickup_lat": ride.pickup_lat,
            "pickup_lng": ride.pickup_lng,
            "drop_location": ride.drop_address,
        }

    finally:
        db.close()


@router.get("/available-rides")
def available_rides():

    db = SessionLocal()

    try:

        rides = db.query(Ride).filter(Ride.status == "SEARCHING").all()
        return {
            "success": True,
            "rides": [
                {
                    "id": ride.id,
                    "pickup": ride.pickup_address,
                    "pickup_lat": ride.pickup_lat,
                    "pickup_lng": ride.pickup_lng,
                    "drop": ride.drop_address,
                    "ride_type": ride.ride_type,
                    "status": ride.status,
                }
                for ride in rides
            ],
        }

    finally:
        db.close()


@router.post("/accept-ride")
def accept_ride(data: AcceptRide):

    db = SessionLocal()

    try:

        ride = (
            db.query(Ride)
            .filter(Ride.id == data.ride_id, Ride.status == "SEARCHING")
            .first()
        )

        if not ride:
            return {"success": False, "message": "Ride already accepted"}

        otp = str(random.randint(1000, 9999))

        ride.driver_id = data.driver_id
        ride.status = "ACCEPTED"
        ride.otp = otp

        db.commit()

        return {
            "success": True,
            "message": "Ride accepted",
            "ride_id": ride.id,
            "otp": otp,
        }

    finally:
        db.close()


@router.get("/ride-status/{ride_id}")
def ride_status(ride_id: int):

    db = SessionLocal()

    try:

        ride = db.query(Ride).filter(Ride.id == ride_id).first()

        if not ride:
            return {"success": False, "message": "Ride not found"}

        driver = None

        if ride.driver_id:

            driver = db.query(Driver).filter(Driver.id == ride.driver_id).first()

        return {
            "success": True,
            "ride_id": ride.id,
            "status": ride.status,
            "pickup_address": ride.pickup_address,
            "drop_address": ride.drop_address,
            "pickup_lat": ride.pickup_lat,
            "pickup_lng": ride.pickup_lng,
            "fare": ride.fare,
            "driver_id": ride.driver_id,
            "driver_name": driver.name if driver else None,
            "driver_mobile": driver.mobile if driver else None,
            "vehicle_type": driver.vehicle_type if driver else None,
            "otp": ride.otp,
        }

    finally:
        db.close()


@router.post("/verify-ride-otp")
def verify_ride_otp(data: VerifyRideOTP):

    db = SessionLocal()

    try:

        ride = db.query(Ride).filter(Ride.id == data.ride_id).first()

        if not ride:
            return {"success": False, "message": "Ride not found"}

        if ride.otp != data.otp:
            return {"success": False, "message": "Invalid OTP"}

        ride.status = "STARTED"

        db.commit()

        return {"success": True, "message": "Ride Started Successfully"}

    finally:
        db.close()
