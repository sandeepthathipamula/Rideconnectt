from sqlalchemy import Column, Integer, String, Double, Boolean
from app.database import Base


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True)

    name = Column(String(100))

    mobile = Column(String(10), unique=True)

    vehicle_type = Column(String(30))

    vehicle_number = Column(String(30))

    latitude = Column(Double, default=0)

    longitude = Column(Double, default=0)

    is_online = Column(Boolean, default=True)