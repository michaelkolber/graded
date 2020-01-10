namespace restaurants {
    /*
    * See https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles
    * The average latitude of NYC (in decimal degrees) is about 40.6.
    * Since the length of 1° longitude in miles = cosine(latitude in decimal degrees) * length of degree (miles) at equator,
    * 1° longitude in miles in NYC = cosine(40.6) * 69.172 = 0.759271307 * 69.172 = 52.5203148.
    * Therefore, 1 mile = 1/52.5203148 degrees longitude, or 0.0190402514 degrees longitude.
    * 
    * The length of a degree of latitude remains relatively constant at around 69 miles, so 
    * one mile = 0.0144927536 degrees latitude.
    */
    const ONE_MILE_IN_DEGREES_LONGITUDE = 0.0190402514;
    const ONE_MILE_IN_DEGREES_LATITUDE  = 0.0144927536;
    
    
    
    /**
     * Get the list of closest restaurants within a certain distance. Because of how NYC OpenData 
     * has structured the data, we can't use Socrata's `within_circle()` method. Instead, we'll 
     * get all the restaurants within a square of size `2n` x `2n`, where `n` is the distance 
     * in miles from the user. This will lead to false positives (we'll catch restaurants in 
     * the corners of the square), but since we're ordering them by distance anyway then it 
     * shouldn't really matter as they'll be at the bottom of the list or cut off by the maximum 
     * length of the list.
     * 
     * We'll do this in 2 steps:
     * 
     * 1. Get all of the restaurants in the area.
     * 2. Get the inspections for the restaurants and associate them with the restaurants.
     * 
     * This should reduce the intensity of having to check every inspection for its restuarant 
     * name, address, etc. Everything will be grouped by the `CAMIS`, a unique identifier for 
     * each restaurant assigned by the DOHMH.
     * 
     * 
     * @param latitude The current latitude of the user
     * @param longitude The current longitude of the user
     * @param distanceMiles The distance in miles from the user to search
     */
    export function getClosestRestaurants(latitude: number, longitude: number, distanceMiles: number) {
        // Clean up from the last call
        emptyRestaurantLists();
        
        const minLat  = latitude  - distanceMiles * ONE_MILE_IN_DEGREES_LATITUDE;
        const maxLat  = latitude  + distanceMiles * ONE_MILE_IN_DEGREES_LATITUDE;
        const minLong = longitude - distanceMiles * ONE_MILE_IN_DEGREES_LONGITUDE;
        const maxLong = longitude + distanceMiles * ONE_MILE_IN_DEGREES_LONGITUDE;
        
        /*tslint:disable:object-literal-sort-keys*/
        $.ajax({
            url: 'https://data.cityofnewyork.us/resource/43nn-pn8j.json',
            headers: {
                'X-App-Token': 'EzUyVVwmCI69PONhqh9mUkWBZ',
            },
            data: {
                $select: 'camis, MIN(dba) as dba, MIN(latitude) as lat, MIN(longitude) as long, MIN(boro) as boro, MIN(building) as building, MIN(street) as street, MIN(cuisine_description) as cuisine_description',
                $where: "latitude between '" + minLat + "' and '" + maxLat + "' AND longitude between '" + minLong + "' and '" + maxLong + "'",
                $group: 'camis',
            },
            success: (results: RestaurantResult[], textStatus: string, jqHXR: JQueryXHR) => {
                // Store the restaurants into the global `restaurantResults` variable
                const done = handleRestaurantResults(results, textStatus, jqHXR);
                if (done) {  // If there were no results
                    return;
                }
                
                // Get the violations
                $.ajax({
                    url: 'https://data.cityofnewyork.us/resource/43nn-pn8j.json',
                    headers: {
                        'X-App-Token': 'EzUyVVwmCI69PONhqh9mUkWBZ',
                    },
                    data: {
                        $select: 'camis, inspection_date, action, violation_code, critical_flag, grade',
                        $where: "latitude between '" + minLat + "' and '" + maxLat + "' AND longitude between '" + minLong + "' and '" + maxLong + "'",
                        $order: 'inspection_date DESC',
                    },
                    success: handleViolationResults,
                    dataType: 'json',
                });
            },
            dataType: 'json',
        });
        /*tslint:enable:object-literal-sort-keys*/
    }


    /**
     * Store the restaurants.
     * 
     * Returns `true` if no further action is needed, i.e. if there were no results. 
     * Otherwise returns false.
     * 
     * @param results The result received from the API
     * @param textStatus 
     * @param jqHXR 
     */
    function handleRestaurantResults(results: RestaurantResult[], textStatus: string, jqHXR: JQueryXHR): boolean {
        if (results.length === 0) {
            renderers.renderResults(null);
            return true;
        }
        
        // Store the results as `Restaurant` objects
        for (const result of  results) {
            restaurantResults[result.camis] = new Restaurant(result);
        }
        
        return false;
    }


    /**
     * Store the violations and render the results onto the page.
     * 
     * Due to the `$order` parameter in our query, we know they will be in reverse 
     * chronological order (i.e. newest first).
     * 
     * @param results The result received from the API
     * @param textStatus 
     * @param jqHXR 
     */
    function handleViolationResults(results: ViolationResult[], textStatus: string, jqHXR: JQueryXHR) {
        if (results.length === 0) {
            console.error('No violation results were returned. Since restaurants were found, this indicates an issue with the query or the Socrata API. Received a text status of ' + textStatus + '. jqXHR object:');
            console.error(jqHXR);
            return;
        }
        
        // Add each violation to the appropriate restaurant
        for (const result of results) {
            if (restaurantResults.hasOwnProperty(result.camis)) {
                restaurantResults[result.camis].assignViolation(result);
            } else {
                console.error('Found a violation with no associated restaurant:');
                console.error(result);
            }
        }
        
        // Sort the restaurants by distance from the user
        orderedResults = Object.values(restaurantResults);
        orderedResults.sort((a: Restaurant, b: Restaurant) => {
            return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
        });
        
        // Render the results onto the page
        renderers.renderResults(orderedResults);
    }
    
    
    /**
     * Empties `restaurantResults` and `orderedResults`.
     */
    function emptyRestaurantLists() {
        restaurantResults = {};
        orderedResults = [];
    }
}
