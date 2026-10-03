from geopy.distance import geodesic

def find_nearby_drivers(
    pickup_lat,
    pickup_lng,
    drivers
):

    nearby=[]

    for driver in drivers:

        distance = geodesic(
            (
                pickup_lat,
                pickup_lng
            ),
            (
                driver.latitude,
                driver.longitude
            )
        ).km

        if distance <= 5:

            nearby.append(
                {
                    "driver_id":driver.id,
                    "distance":distance
                }
            )

    nearby.sort(
        key=lambda x:x["distance"]
    )

    return nearby