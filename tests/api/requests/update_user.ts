
function generateUpdateInfoRequest() {
    return {
        "firstname" : "Juan",
        "lastname" : "Moze",
        "totalprice" : 555,
        "depositpaid" : true,
        "bookingdates" : {
            "checkin" : "2024-01-01",
            "checkout" : "2024-02-01"
        },
        "additionalneeds" : "Breakfast"
    }
}

export default generateUpdateInfoRequest;