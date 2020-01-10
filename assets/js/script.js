"use strict";
var geolocation;
(function (geolocation) {
    function setUpGeolocation() {
        if ('geolocation' in navigator) {
            console.log('Geolocation available.');
        }
        else {
            helpers.locationSearch.disable('Geolocation is not available on this device.');
        }
    }
    geolocation.setUpGeolocation = setUpGeolocation;
    function getGeolocation(successCallback) {
        navigator.geolocation.getCurrentPosition((position) => {
            currentLatitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;
            successCallback(position);
        }, (err) => {
            console.error('Error getting location. Error code: ' + err.code + '. Error message:\n' + err.message);
            if (err.code === err.PERMISSION_DENIED) {
                helpers.locationSearch.disable('You must allow access to your location.');
                return;
            }
            if (err.code === err.POSITION_UNAVAILABLE) {
                helpers.errorMessage.render('Could not get your position, please try again.');
            }
        }, {
            enableHighAccuracy: true,
        });
    }
    geolocation.getGeolocation = getGeolocation;
})(geolocation || (geolocation = {}));
var helpers;
(function (helpers) {
    const $locationButton = $('#js-search-button');
    const $errorDiv = $('#js-location-error');
    const $emptyState = $('#js-empty-state');
    function resetPage() {
        errorMessage.remove();
        resultList.reset();
    }
    helpers.resetPage = resetPage;
    let locationSearch;
    (function (locationSearch) {
        function disable(message) {
            $locationButton.addClass('is-disabled');
            if (message !== null && message !== '') {
                errorMessage.render(message);
            }
            locationEnabled = false;
        }
        locationSearch.disable = disable;
        function enable() {
            $locationButton.removeClass('is-disabled');
            errorMessage.remove();
            locationEnabled = true;
        }
        locationSearch.enable = enable;
    })(locationSearch = helpers.locationSearch || (helpers.locationSearch = {}));
    let errorMessage;
    (function (errorMessage) {
        function render(message) {
            $errorDiv.html(message);
            $errorDiv.addClass('is-visible');
        }
        errorMessage.render = render;
        function remove() {
            $errorDiv.removeClass('is-visible');
            $errorDiv.html('');
        }
        errorMessage.remove = remove;
    })(errorMessage = helpers.errorMessage || (helpers.errorMessage = {}));
    let resultList;
    (function (resultList) {
        function renderEmpty(message) {
            $emptyState.find('.empty-state__tip').html(message);
            $emptyState.addClass('is-visible');
        }
        resultList.renderEmpty = renderEmpty;
        function removeEmpty() {
            $emptyState.removeClass('is-visible');
            $emptyState.find('.empty-state__tip').html('');
        }
        resultList.removeEmpty = removeEmpty;
        function reset() {
            $emptyState.removeClass('is-visible');
            $emptyState.find('.empty-state__tip').html('');
            $('.result').remove();
        }
        resultList.reset = reset;
    })(resultList = helpers.resultList || (helpers.resultList = {}));
})(helpers || (helpers = {}));
const INSPECTIONS_TO_SHOW = 3;
let locationEnabled = true;
let currentLatitude;
let currentLongitude;
let restaurantResults = {};
let orderedResults;
const templates = {
    $result: $('#js-result-template'),
    $inspection: $('#js-inspection-template'),
    $violation: $('#js-violation-template'),
};
$(() => {
    geolocation.setUpGeolocation();
    $('#js-search-button').click(() => {
        helpers.resetPage();
        geolocation.getGeolocation((position) => {
            const distance = parseFloat($('#js-distance-select').val());
            restaurants.getClosestRestaurants(currentLatitude, currentLongitude, distance);
        });
    });
});
var renderers;
(function (renderers) {
    function renderResults(restaurants) {
        if (restaurants === null) {
            helpers.resultList.renderEmpty('Are you in New York City?');
            return;
        }
        const $resultList = $('#js-results');
        let $newResult;
        let $newInspection;
        let $newViolation;
        for (const restaurant of restaurants) {
            $newResult = templates.$result.clone().removeAttr('id');
            $newResult.find('.result__name').html(restaurant.name);
            const $newResultGrade = $newResult.find('.result__grade');
            switch (restaurant.getGrade()) {
                case 'A':
                    $newResultGrade.addClass('result__grade--good');
                    break;
                case 'B':
                    $newResultGrade.addClass('result__grade--ok');
                    break;
                case 'C':
                    $newResultGrade.addClass('result__grade--bad');
                    break;
            }
            $newResult.find('.result__grade-letter').html(restaurant.getGrade());
            const $newResultDetails = $newResult.find('.result__details');
            $newResultDetails.children('address').html(restaurant.address);
            $newResultDetails.children('span').html(' &bull; ' + restaurant.cuisine);
            const unshownInspections = restaurant.inspections.size - INSPECTIONS_TO_SHOW;
            if (unshownInspections > 0) {
                let htmlString = '(' + unshownInspections + ' older inspection';
                if (unshownInspections !== 1) {
                    htmlString += 's';
                }
                htmlString += ' not shown)';
                $newResult.find('.result__not-shown').html(htmlString);
            }
            let inspectionsInserted = 0;
            for (const inspection of restaurant.inspections.values()) {
                $newInspection = templates.$inspection.clone().removeAttr('id');
                const $newInspectionData = $newInspection.find('.inspection__data');
                if (inspection.date.toISOString() === '1900-01-01T00:00:00.000Z') {
                    $newInspectionData.children('.inspection__date').html('Not yet inspected');
                    $newInspectionData.children('.inspection__grade-explanation').html('No grade');
                }
                else {
                    $newInspectionData.children('.inspection__date').html('Inspected ' + inspection.date.toLocaleDateString());
                    if (inspection.grade === null) {
                        $newInspectionData.children('.inspection__grade-explanation').html('Grade unchanged');
                    }
                    else if (inspection.grade == 'P' || inspection.grade == 'Z') {
                        $newInspectionData.children('.inspection__grade-explanation').html('Grade Pending ');
                        $newInspectionData.children('.inspection__grade').html('(' + inspection.grade + ')');
                    }
                    else if (inspection.grade == 'N') {
                        $newInspectionData.children('.inspection__grade-explanation').html('Not yet graded ');
                        $newInspectionData.children('.inspection__grade').html('(' + inspection.grade + ')');
                    }
                    else {
                        $newInspectionData.children('.inspection__grade-explanation').html('Received grade of ');
                        $newInspectionData.children('.inspection__grade').html(inspection.grade);
                    }
                }
                inspection.sortViolations();
                for (const violation of inspection.violations) {
                    $newViolation = templates.$violation.clone().removeAttr('id');
                    const violationText = violation.getTextRepresentation();
                    if (violationText === null) {
                        continue;
                    }
                    if (inspection.violations.length !== 1 && violation.code == 'ok') {
                        continue;
                    }
                    if (violation.critical) {
                        $newViolation.addClass('violation--critical');
                    }
                    $newViolation.find('.violation__emoji').html(violationText[0]);
                    $newViolation.find('.violation__text').html(violationText[1]);
                    $newInspection.find('.inspection__violations').append($newViolation);
                }
                $newResult.find('.result__inspections').append($newInspection);
                if (++inspectionsInserted >= INSPECTIONS_TO_SHOW) {
                    break;
                }
            }
            $resultList.append($newResult);
        }
    }
    renderers.renderResults = renderResults;
})(renderers || (renderers = {}));
var restaurants;
(function (restaurants) {
    const ONE_MILE_IN_DEGREES_LONGITUDE = 0.0190402514;
    const ONE_MILE_IN_DEGREES_LATITUDE = 0.0144927536;
    function getClosestRestaurants(latitude, longitude, distanceMiles) {
        emptyRestaurantLists();
        const minLat = latitude - distanceMiles * ONE_MILE_IN_DEGREES_LATITUDE;
        const maxLat = latitude + distanceMiles * ONE_MILE_IN_DEGREES_LATITUDE;
        const minLong = longitude - distanceMiles * ONE_MILE_IN_DEGREES_LONGITUDE;
        const maxLong = longitude + distanceMiles * ONE_MILE_IN_DEGREES_LONGITUDE;
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
            success: (results, textStatus, jqHXR) => {
                const done = handleRestaurantResults(results, textStatus, jqHXR);
                if (done) {
                    return;
                }
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
    }
    restaurants.getClosestRestaurants = getClosestRestaurants;
    function handleRestaurantResults(results, textStatus, jqHXR) {
        if (results.length === 0) {
            renderers.renderResults(null);
            return true;
        }
        for (const result of results) {
            restaurantResults[result.camis] = new Restaurant(result);
        }
        return false;
    }
    function handleViolationResults(results, textStatus, jqHXR) {
        if (results.length === 0) {
            console.error('No violation results were returned. Since restaurants were found, this indicates an issue with the query or the Socrata API. Received a text status of ' + textStatus + '. jqXHR object:');
            console.error(jqHXR);
            return;
        }
        for (const result of results) {
            if (restaurantResults.hasOwnProperty(result.camis)) {
                restaurantResults[result.camis].assignViolation(result);
            }
            else {
                console.error('Found a violation with no associated restaurant:');
                console.error(result);
            }
        }
        orderedResults = Object.values(restaurantResults);
        orderedResults.sort((a, b) => {
            return a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0;
        });
        renderers.renderResults(orderedResults);
    }
    function emptyRestaurantLists() {
        restaurantResults = {};
        orderedResults = [];
    }
})(restaurants || (restaurants = {}));
const violations = {
    'ok': ['✅', '<b>No violations</b>'],
    '02A': ['🔥', '<b>Food not cooked</b> to required minimum temperature'],
    '02B': ['🍲', '<b>Hot food<b> not kept at safe temperature'],
    '02C': ['🥡', '<b>Hot food</b> not reheated properly'],
    '02D': ['🧆', '<b>Precooked potentially hazardous food</b> not heated to safe temperature'],
    '02E': ['🐔', '<b>Frozen poultry</b> being cooked frozen or partially thawed'],
    '02F': ['🦐', '<b>Meat/seafood</b> served raw or undercooked'],
    '02G': ['🧀', '<b>Cold food</b> not kept at safe temperature'],
    '02H': ['💨', '<b>Food not cooled properly</b>'],
    '02I': ['🥩', '<b>Food not cooled</b> to safe temperature'],
    '02J': ['🥟', '<b>Reduced oxygen packaged foods</b> not cooled properly'],
    '03A': ['🏠', '<b>Food from unapproved source</b>, such as home'],
    '03B': ['🦪', '<b>Shellfish</b> not from approved source'],
    '03C': ['🍳', '<b>Eggs</b> found dirty/cracked'],
    '03D': ['🥫', '<b>Canned food</b> swollen, leaking or rusted'],
    '03E': ['🚱', '<b>Water supply</b> inadequate'],
    '03F': ['🥛', '<b>Unpasteurized milk</b>'],
    '03G': ['🍣', '<b>Raw food</b> not properly washed'],
    '04A': ['📑', '<b>Food Protection Certificate</b> not held by supervisor'],
    '04B': ['🤒', '<b>Sick workers</b> with open cuts'],
    '04C': ['🖐', '<b>Workers touch food</b> directly with hands'],
    '04D': ['🤧', "<b>Workers don't wash hands</b> after using bathroom/sneezing"],
    '04E': ['💀', '<b>Toxic chemical</b> improperly labeled or stored'],
    '04F': ['☣', '<b>Food contaminated</b> by sewage or liquid waste'],
    '04G': ['🔄', '<b>Potentially hazardous food re-served</b>'],
    '04H': ['🔀', '<b>Food cross-contaminated</b>'],
    '04I': ['🥨', '<b>Unprotected food re-served</b>'],
    '04J': ['🌡', '<b>Thermometer</b> not properly used'],
    '04K': ['🐀', '<b>Live rats</b>'],
    '04L': ['🐭', '<b>Live mice</b>'],
    '04M': ['🐞', '<b>Live roaches</b>'],
    '04N': ['🦟', '<b>Filth flies</b>'],
    '04O': ['😼', '<b>Live animals other than fish</b>'],
    '05A': ['🧻', '<b>Sewage disposal system</b> improper or unapproved'],
    '05B': ['☠', '<b>Harmful gas or vapor</b> detected, including carbon monoxide'],
    '05C': ['📦', 'Improper <b>food contact surface</b>'],
    '05D': ['🧼', 'No <b>hand washing facility and/or soap</b>'],
    '05E': ['🚽', '<b>Toilet not provided</b>'],
    '05F': ['🌡', '<b>Food not kep</b>proper temperatures'],
    '05H': ['🚿', '<b>No facilities to wash equipment</b>'],
    '06A': ['💩', '<b>Worker cleanliness inadequate</b>'],
    '06B': ['🌿', '<b>Tobacco use or eating</b> from open container'],
    '06C': ['🔀', '<b>Food not protected</b> from contamination'],
    '06D': ['💧', '<b>Food contact surface</b> not properly washed'],
    '06E': ['🧽', '<b>Sanitized equipment</b> improperly used'],
    '06F': ['🧺', '<b>Wiping cloths</b> dirty'],
    '06G': ['📄', '<b>HACCP plan</b> not approved'],
    '06H': ['📜', '<b>Records and logs</b> not maintained'],
    '06I': ['🎫', '<b>Food not labeled</b> properly'],
    '07A': ['👷‍♂️', '<b>Department of Health obstructed</b>'],
    '08A': ['🐁', '<b>Facility not vermin proof</b>'],
    '08B': ['🚮', '<b>Garbage can</b> missing or inadequate'],
    '08C': ['💀', '<b>Misuse of pesticides</b> or prohibited chemicals'],
    '09A': ['🥫', '<b>Canned food</b> dented'],
    '09B': ['❄', '<b>Improper thawing</b>'],
    '09C': ['💀', '<b>Food contact surface</b> not properly maintained'],
    '10A': ['🚽', '<b>Toilet</b> not maintained properly'],
    '10B': ['🚽', '<b>Plumbing</b> not properly installed'],
    '10C': ['💡', '<b>Inadequate lighting</b>'],
    '10D': ['🌬', '<b>Insufficient ventilation</b>'],
    '10E': ['🌡', '<b>Thermometer</b> is not accurate for refrigerated or hot food'],
    '10F': ['📦', '<b>Non-food contact surface</b> improperly constructed'],
    '10G': ['🛌', '<b>People living/sleeping</b> in restaurant'],
    '10H': ['🍴', '<b>Improper sanitization</b> of utensils'],
    '10I': ['🍽', '<b>Single service item</b> reused'],
    '10J': ['🧼', '<b>"Wash hands" sign</b> not posted'],
    '15I': ['🚬', '<b>Smoking signs</b> not conspicuously posted'],
    '15J': ['🚬', '<b>Ashtray</b> in smoke-free area'],
    '15K': ['🚬', 'Workers <b>did not prevent smoking</b>'],
    '15L': ['🚬', '<b>Smoke-free workplace</b> policy not clear'],
    '15S': ['🌿', '<b>Flavored tobacco</b> sold'],
    '15T': ['🌿', '<b>Original label for tobacco</b> sold'],
    '16A': ['🛢', 'Food served with <b>artificial trans fat</b>'],
    '16B': ['🏷', '<b>Food labels</b> not kept on site'],
    '16C': ['🔟', '<b>Calories not posted</b>'],
    '16D': ['🔟', '<b>Calories not correctly posted</b> at drive-through'],
    '16E': ['🔟', '<b>Calories not correctly posted</b> for each flavor/size of food'],
    '16F': ['🔟', '<b>Calories not correctly posted</b> for combo meals'],
    '18B': ['📃', '<b>Forged Department of Health document</b>'],
    '18C': ['📃', '<b>Forged Department of Health notice</b>'],
    '18D': ['⛔', '<b>Failure to comply</b> with Department of Health'],
    '18F': ['📑', '<b>Permit</b> not conspicuously displayed'],
    '18G': ['🍦', 'Unauthorized <b>frozen dessert</b> production'],
    '20A': ['🥜', '<b>Allergy information</b> not conspicuously posted'],
    '20B': ['🔠', '<b>Allergy information</b> not in understood language'],
    '20D': ['➕', '<b>"First Aid"/"Alcohol and Pregnancy" posters</b> missing or not posted'],
    '20E': ['🅱', '<b>Letter Grade or Grade Pending</b> not conspicuously shown'],
    '20F': ['🅱', '<b>Current letter grade</b> not posted'],
    '22A': ['💥', '<b>Nuisance</b> created or allowed to exist'],
    '22B': ['🚺', '<b>Toilet facility used by women</b> does not have a covered garbage can'],
    '22C': ['💡', '<b>Lightbulb</b> not shielded or shatterproof'],
    '22E': ['⛔', '<b>ROP processing equipment</b> not approved by Department of Health'],
    '22F': null,
    '22G': null,
    '15A1': null,
    '15E2': null,
    '15E3': null,
    '15F1': null,
    '15F2': null,
    '15F6': null,
    '15F7': null,
    '15F8': null,
    '15G7': null,
    '19A1': null,
    '19A3': null,
    '17A1': null,
    '17A3': null,
};
class Inspection {
    constructor(date, grade) {
        this.date = new Date(date);
        this.grade = grade === undefined ? null : grade;
        this.violations = [];
    }
    sortViolations() {
        this.violations.sort((a, b) => {
            const left = a.critical ? 1 : 0;
            const right = b.critical ? 1 : 0;
            return right - left;
        });
    }
}
class Restaurant {
    constructor(result) {
        this.camis = result.camis;
        this.name = result.dba;
        this.cuisine = result.cuisine_description;
        this.inspections = new Map();
        this.address = result.building + ' ' + result.street;
        if (result.boro !== 0) {
            this.address += ', ' + result.boro;
        }
        this.calculateDistance(result.lat, result.long);
    }
    calculateDistance(latitude, longitude) {
        const normalizedLat = Math.abs(parseFloat(latitude) - currentLatitude);
        const normalizedLong = Math.abs(parseFloat(longitude) - currentLongitude);
        this.distance = Math.sqrt(Math.pow(normalizedLat, 2) + Math.pow(normalizedLong, 2));
    }
    assignViolation(violationResult) {
        let inspection;
        inspection = this.inspections.get(violationResult.inspection_date);
        if (inspection === undefined) {
            inspection = new Inspection(violationResult.inspection_date + 'Z', violationResult.grade);
            this.inspections.set(violationResult.inspection_date, inspection);
        }
        inspection.violations.push(new Violation(violationResult));
    }
    getGrade() {
        for (const inspection of this.inspections.values()) {
            if (inspection.grade !== null) {
                return inspection.grade;
            }
        }
        return '?';
    }
}
class Violation {
    constructor(violationResult) {
        this.action = violationResult.action;
        if (violationResult.action === 'No violations were recorded at the time of this inspection.') {
            this.code = 'ok';
        }
        else if (violationResult.action === undefined) {
            this.code = null;
        }
        else {
            this.code = violationResult.violation_code;
        }
        this.critical = violationResult.critical_flag === 'Y' ? true : false;
    }
    getTextRepresentation() {
        if (this.code === null) {
            return null;
        }
        if (!violations.hasOwnProperty(this.code)) {
            console.error("Could not find a value for code '" + this.code + "'");
            return null;
        }
        return violations[this.code];
    }
}
//# sourceMappingURL=script.js.map