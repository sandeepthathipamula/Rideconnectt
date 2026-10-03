from sqlalchemy import (
    Column,
    Integer,
    String,
    Double,
    Text,
    DECIMAL
)

from app.database import Base


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)

    rider_id = Column(Integer)

    driver_id = Column(Integer, nullable=True)

    pickup_address = Column(Text)

    pickup_lat = Column(Double)
    pickup_lng = Column(Double)

    drop_address = Column(Text)

    drop_lat = Column(Double, nullable=True)
    drop_lng = Column(Double, nullable=True)

    otp = Column(String(6))

    ride_type = Column(String(20))

    booking_mode = Column(String(20))

    fare = Column(DECIMAL(10, 2), nullable=True)

    status = Column(String(30))