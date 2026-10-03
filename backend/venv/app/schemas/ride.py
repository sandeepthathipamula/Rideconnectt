from pydantic import BaseModel
class RideRequest(BaseModel):
    mobile: str
    pickup_lat: float
    pickup_lng: float
    drop_location: str
    ride_type: str
    booking_mode: str

class VerifyRideOTP(BaseModel):
    ride_id: int
    otp: str