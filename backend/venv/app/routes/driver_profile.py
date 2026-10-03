from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.driver import Driver
from app.schemas.driver_profile import DriverProfile

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/driver-profile")
def save_driver_profile(
    data: DriverProfile,
    db: Session = Depends(get_db)
):

    driver = (
        db.query(Driver)
        .filter(Driver.mobile == data.mobile)
        .first()
    )

    if driver:

        driver.name = data.name
        driver.vehicle_type = data.vehicle_type
        driver.vehicle_number = data.vehicle_number

        db.commit()
        db.refresh(driver)

        return {
            "success": True,
            "message": "Profile Updated",
            "driver_id": driver.id
        }

    driver = Driver(
        name=data.name,
        mobile=data.mobile,
        vehicle_type=data.vehicle_type,
        vehicle_number=data.vehicle_number,
        latitude=0,
        longitude=0,
        is_online=True
    )

    db.add(driver)
    db.commit()
    db.refresh(driver)

    return {
        "success": True,
        "message": "Profile Saved",
        "driver_id": driver.id
    }


@router.get("/driver-profile/{mobile}")
def get_driver_profile(
    mobile: str,
    db: Session = Depends(get_db)
):

    driver = (
        db.query(Driver)
        .filter(Driver.mobile == mobile)
        .first()
    )

    if not driver:
        return {
            "success": False,
            "message": "Driver not found"
        }

    return {
        "success": True,
        "driver": {
            "id": driver.id,
            "name": driver.name,
            "mobile": driver.mobile,
            "vehicle_type": driver.vehicle_type,
            "vehicle_number": driver.vehicle_number,
            "is_online": driver.is_online
        }
    }