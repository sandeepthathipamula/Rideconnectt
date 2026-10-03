from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.ride import router as ride_router
from app.routes.driver_auth import router as driver_auth_router
from app.routes.driver_profile import router as driver_profile_router

# from app.routes.sms_booking import router as sms_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(sms_router)

app.include_router(auth_router)
app.include_router(ride_router)
app.include_router(driver_auth_router)
app.include_router(driver_profile_router)

@app.get("/")
def root():
    return {
        "message": "RideConnect Backend Running"
    }