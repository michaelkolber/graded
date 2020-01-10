namespace geolocation {
    /**
     * Set up the Geolocation API. Show appropriate error messages to the user.
     */
    export function setUpGeolocation() {
        if ('geolocation' in navigator) {
            console.log('Geolocation available.');
        } else {
            helpers.locationSearch.disable('Geolocation is not available on this device.');
        }
    }


    /**
     * Get a high-accuracy reading of the user's location.
     * 
     * @param successCallback A function called if getting the geolocation succeeds
     */
    export function getGeolocation(successCallback: (position: Position) => void) {
        navigator.geolocation.getCurrentPosition(
            (position: Position) => {
                currentLatitude = position.coords.latitude;
                currentLongitude = position.coords.longitude;
                successCallback(position);
            },
            (err) => {
                console.error('Error getting location. Error code: ' + err.code + '. Error message:\n' + err.message);
                
                // Let the user know what happened
                if (err.code === err.PERMISSION_DENIED) {
                    helpers.locationSearch.disable('You must allow access to your location.');
                    return;
                }
                if (err.code === err.POSITION_UNAVAILABLE) {
                    helpers.errorMessage.render('Could not get your position, please try again.');
                }
            },
            {
                enableHighAccuracy: true,
            },
        );
    }
}
