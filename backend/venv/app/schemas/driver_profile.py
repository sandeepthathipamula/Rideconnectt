from pydantic import BaseModel


class DriverProfile(BaseModel):
    mobile: str
    name: str
    vehicle_type: str
    vehicle_number: str