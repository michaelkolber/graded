// const RESULTS_TO_SHOW = 20;  // Only show this many results for name-based searches
const INSPECTIONS_TO_SHOW = 3;  // Only show this many inspections per result

let locationEnabled = true;
let currentLatitude: number;
let currentLongitude: number;
let restaurantResults: {[key: string]: Restaurant} = {};
let orderedResults: Restaurant[];

// The HTML templates
const templates = {
    $result: $('#js-result-template'),
    $inspection: $('#js-inspection-template'),  // tslint:disable-line:object-literal-sort-keys
    $violation: $('#js-violation-template'),
};



$(() => {
    // Set up geolocation
    geolocation.setUpGeolocation();
    
    // Register the handler
    $('#js-search-button').click(() => {
        // Reset the page
        helpers.resetPage();
        
        // Get the user's current location
        geolocation.getGeolocation((position) => {
            const distance = parseFloat($('#js-distance-select').val() as string);
            restaurants.getClosestRestaurants(currentLatitude, currentLongitude, distance);
        });
    });
});
