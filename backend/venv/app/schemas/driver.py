from pydantic import BaseModel

class AcceptRide(BaseModel):
    ride_id: int
    driver_id: int
    
class DriverProfile(BaseModel):
    name: str
    mobile: str
    vehicle_type: str
    vehicle_number: str