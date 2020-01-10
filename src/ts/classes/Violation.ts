/**
 * A violation that was found as part of an `Inspection`.
 */
class Violation {
    public action: string;
    public code: string|null;
    public critical: boolean;
    
    constructor(violationResult: ViolationResult) {
        this.action = violationResult.action;
        
        // Check for a "no violations" reason and assign a custom code if so
        if (violationResult.action === 'No violations were recorded at the time of this inspection.') {
            this.code = 'ok';
        } else if (violationResult.action === undefined) {  // Some weird edge case
            this.code = null;
        } else {
            this.code = violationResult.violation_code;
        }
        
        this.critical = violationResult.critical_flag === 'Y' ? true : false;
    }
    
    
    /**
     * Returns the appropriate emoji and HTML string based on the violation's code as an 
     * array of length 2, or `null` if there is no representation.
     */
    public getTextRepresentation(): string[]|null {
        // Deal with cases where the `ViolationResult` does not have an `action`
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
