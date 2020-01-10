/**
 * An inspection that occurred on a certain day and the `Violation`s that were found.
 */
class Inspection {
    public date: Date;
    public grade: Grade|null;
    public violations: Violation[];
    
    constructor(date: string, grade: Grade|undefined) {
        this.date = new Date(date);
        this.grade = grade === undefined ? null : grade;
        this.violations = [];
    }
    
    
    /**
     * Sort the violations so that the critical ones are first.
     */
    public sortViolations() {
        this.violations.sort((a: Violation, b: Violation): number => {
            // Coerce to numbers
            const left = a.critical ? 1 : 0;
            const right = b.critical ? 1 : 0;
            
            // Return -1 if only `a` is critical, 0 if they're the same, and 1 if only `b` is critical
            return right - left;
        });
    }
}
