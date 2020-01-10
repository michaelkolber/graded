namespace renderers {
    /**
     * Create the HTML for each restaurant, inspection, and violation, and add it to the page
     * 
     * @param restaurants The processed results of the query
     */
    export function renderResults(restaurants: Restaurant[]|null) {
        // Check if there were no results
        if (restaurants === null) {
            helpers.resultList.renderEmpty('Are you in New York City?');
            return;
        }
        
        const $resultList = $('#js-results');
        let $newResult: JQuery;
        let $newInspection: JQuery;
        let $newViolation: JQuery;
        
        for (const restaurant of restaurants) {
            // Insert the newResult data
            // Clone the template and remove the id to avoid any duplicate id issues
            $newResult = templates.$result.clone().removeAttr('id');
            
            // Add the name
            $newResult.find('.result__name').html(restaurant.name);
            
            // Set the grade color
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
            
            // Add the grade
            $newResult.find('.result__grade-letter').html(restaurant.getGrade());
            
            // Add the details
            const $newResultDetails = $newResult.find('.result__details');
            $newResultDetails.children('address').html(restaurant.address);
            $newResultDetails.children('span').html(' &bull; ' + restaurant.cuisine);
            
            // Add the number of unshown inspections
            const unshownInspections = restaurant.inspections.size - INSPECTIONS_TO_SHOW;
            if (unshownInspections > 0) {
                let htmlString = '(' + unshownInspections + ' older inspection';
                if (unshownInspections !== 1) {
                    htmlString += 's';  // Account for singular vs. plural
                }
                htmlString += ' not shown)';
                
                $newResult.find('.result__not-shown').html(htmlString);
            }
            
            
            // Insert the newInspection data for each inspection. Only show a certain amount.
            let inspectionsInserted = 0;
            for (const inspection of restaurant.inspections.values()) {
                // Clone the template and remove the id to avoid any duplicate id issues
                $newInspection = templates.$inspection.clone().removeAttr('id');
                
                // Add the inspection data
                const $newInspectionData = $newInspection.find('.inspection__data');
                
                // Account for special date used by DOHMH to denote restaurant was not yet inspected
                if (inspection.date.toISOString() === '1900-01-01T00:00:00.000Z') {
                    $newInspectionData.children('.inspection__date').html('Not yet inspected');
                    $newInspectionData.children('.inspection__grade-explanation').html('No grade');
                } else {
                    $newInspectionData.children('.inspection__date').html('Inspected ' + inspection.date.toLocaleDateString());
                    
                    if (inspection.grade === null) {
                        // Let the user know the grade wasn't changed as a result of this inspection
                        $newInspectionData.children('.inspection__grade-explanation').html('Grade unchanged');
                    } else if (inspection.grade == 'P' || inspection.grade == 'Z') {
                        // Deal with pending grades
                        $newInspectionData.children('.inspection__grade-explanation').html('Grade Pending ');
                        $newInspectionData.children('.inspection__grade').html('(' + inspection.grade + ')');
                    } else if (inspection.grade == 'N') {
                        // Deal with restaurants that haven't been graded yet
                        $newInspectionData.children('.inspection__grade-explanation').html('Not yet graded ');
                        $newInspectionData.children('.inspection__grade').html('(' + inspection.grade + ')');
                    } else {
                        $newInspectionData.children('.inspection__grade-explanation').html('Received grade of ');
                        $newInspectionData.children('.inspection__grade').html(inspection.grade);
                    }
                }
                
                
                // Insert the newViolation data for each violation
                // First, sort the violations so that the critical ones are on top
                inspection.sortViolations();
                for (const violation of inspection.violations) {
                    // Clone the template and remove the id to avoid any duplicate id issues
                    $newViolation = templates.$violation.clone().removeAttr('id');
                    const violationText = violation.getTextRepresentation();
                    
                    if (violationText === null) {  // If there's no mapping for the violation
                        continue;
                    }
                    
                    /*
                    * Check for violations of the format "No violations were recorded at the 
                    * time of this inspection.". If the number of violations is more than 1, 
                    * then this "violation" is a mistake in the data. Sometimes, the data 
                    * will say no violations were recorded on the same date that violations 
                    * actually were recorded. In this case, we just won't render the 
                    * untrue "violation".
                    */
                    if (inspection.violations.length !== 1 && violation.code == 'ok') {
                        continue;
                    }
                    
                    // Add the appropriate CSS class for critical violations
                    if (violation.critical) {
                        $newViolation.addClass('violation--critical');
                    }
                    
                    $newViolation.find('.violation__emoji').html(violationText[0]);
                    $newViolation.find('.violation__text').html(violationText[1]);
                    
                    // Add the newViolation to the newInspection
                    $newInspection.find('.inspection__violations').append($newViolation);
                }
                
                
                // Add the newInspection to the newResult
                $newResult.find('.result__inspections').append($newInspection);
                
                // Check if we should run the loop again
                if (++inspectionsInserted >= INSPECTIONS_TO_SHOW) {
                    break;
                }
            }
            
            
            // Add the newResult to the DOM
            $resultList.append($newResult);
        }
    }
}
