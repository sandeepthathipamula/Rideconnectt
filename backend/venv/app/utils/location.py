import requests

def reverse_geocode(
    lat,
    lng
):

    url = (
        f"https://nominatim.openstreetmap.org/"
        f"reverse?format=jsonv2"
        f"&lat={lat}"
        f"&lon={lng}"
    )

    headers = {
        "User-Agent":"RideConnect"
    }

    response = requests.get(
        url,
        headers=headers
    )

    data = response.json()

    return data.get(
        "display_name",
        "Unknown Location"
    )