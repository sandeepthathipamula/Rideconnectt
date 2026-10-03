from pydantic import BaseModel

class SendOTP(BaseModel):
    mobile:str

class VerifyOTP(BaseModel):
    mobile:str
    otp:str