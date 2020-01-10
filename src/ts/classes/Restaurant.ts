/**
 * Represents a restaurant. Contains one or more `Inspection`s.
 */
class Restaurant {
    public camis: string;  // Unique identifier for each restaurant, assigned by DOHMH
    public name: string;
    public address: string;
    public cuisine: string;
    public distance!: number;  // The distance (in degrees) from the user
    public inspections: Map<string, Inspection>;
    
    constructor(result: RestaurantResult) {
        this.camis = result.camis;
        this.name = result.dba;
        this.cuisine = result.cuisine_description;
        this.inspections = new Map();
        
        // Create the address
        this.address = result.building + ' ' + result.street;
        if (result.boro !== 0) {
            this.address += ', ' + result.boro;
        }
        
        this.calculateDistance(result.lat, result.long);
    }
    
    
    /**
     * Calculate the restaurant's distance from the user. This normalizes the values 
     * using the user's current location as the origin. Normalized coordinates are always 
     * positive.
     * 
     * E.g. if the user's current latitude is 40, and the latitude to normalize is 42, the 
     * latitude becomes 2. Similarly, a latitude of 38 would also become 2.
     */
    private calculateDistance(latitude: string, longitude: string) {
        const normalizedLat = Math.abs(parseFloat(latitude) - currentLatitude);
        const normalizedLong = Math.abs(parseFloat(longitude) - currentLongitude);
        
        // Use the Pythagorean theorem to determine the distance
        this.distance = Math.sqrt(Math.pow(normalizedLat, 2) + Math.pow(normalizedLong, 2));
    }
    
    
    /**
     * Take a `ViolationResult` and assign it to the correct `Inspection`, creating the 
     * `Inspection` if it doesn't already exist.
     * 
     * @param violationResult 
     */
    public assignViolation(violationResult: ViolationResult) {
        let inspection: Inspection|undefined;  // The inspection associated with the current violation
        
        /*
         * Check the current inspections to see if any of them match the current 
         * violation. It is assumed that there is only one inspection per restaurant per 
         * date, and that therefore all violations with the same date are from the same 
         * inspection.
         */
        inspection = this.inspections.get(violationResult.inspection_date);
        if (inspection === undefined) {
            /*
             * If we don't have an inspection for that day, create a new one and store it 
             * in our Map of inspections. Assume all datetimes are in UTC -- since we're 
             * only dealing with dates and not times, it doesn't really matter. Add a 'Z' 
             * to the end of the string to enforce UTC.
             */
            inspection = new Inspection(violationResult.inspection_date + 'Z', violationResult.grade);
            this.inspections.set(violationResult.inspection_date, inspection);
        }
        
        inspection.violations.push(new Violation(violationResult));
    }
    
    
    /**
     * Get the most recent grade.
     */
    public getGrade(): Grade|'?' {
        for (const inspection of this.inspections.values()) {
            if (inspection.grade !== null) {
                return inspection.grade;
            }
        }
        
        // Return a question mark otherwise
        return '?';
    }
}
