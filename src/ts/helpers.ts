namespace helpers {
    const $locationButton = $('#js-search-button');
    const $errorDiv = $('#js-location-error');
    const $emptyState = $('#js-empty-state');  // The empty state message and graphic for when no results are returned
    
    
    /**
     * Remove error messages, destroy results, and remove empty state display.
     */
    export function resetPage() {
        errorMessage.remove();
        resultList.reset();
    }
    
    
    export namespace locationSearch {
        /**
         * Disable the 'Show Nearby Restaurants' button (UI-wise and in the JS) and optionally 
         * provide an error message.
         * 
         * @param message An optional message to show to the user
         */
        export function disable(message: string|null) {
            $locationButton.addClass('is-disabled');
            
            if (message !== null && message !== '') {
                errorMessage.render(message);
            }
            locationEnabled = false;
        }
    
    
        /**
         * Enable the 'Show Nearby Restaurants' button (UI-wise and in the JS) and remove the 
         * error message.
         */
        export function enable() {
            $locationButton.removeClass('is-disabled');
            
            errorMessage.remove();
            locationEnabled = true;
        }
    }
    
    
    export namespace errorMessage {
        /**
         * Renders an error message on the webpage, underneath the 'Show Nearby Restaurants' button.
         * 
         * @param message The message to show to the user
         */
        export function render(message: string) {
            $errorDiv.html(message);
            $errorDiv.addClass('is-visible');
        }


        /**
         * Removes any error message shown on the webpage underneath the 'Show Nearby Restaurants' button.
         */
        export function remove() {
            $errorDiv.removeClass('is-visible');
            $errorDiv.html('');
        }
    }
    
    
    export namespace resultList {
        /**
         * Shows a graphic and message stating that there were no results.
         * 
         * @param message The message to show to the user
         */
        export function renderEmpty(message: string) {
            $emptyState.find('.empty-state__tip').html(message);
            $emptyState.addClass('is-visible');
        }
        
        
        /**
         * Hides the graphic and message.
         */
        export function removeEmpty() {
            $emptyState.removeClass('is-visible');
            $emptyState.find('.empty-state__tip').html('');
        }
        
        
        /**
         * Hides any empty state graphic and message and removes any results.
         */
        export function reset() {
            $emptyState.removeClass('is-visible');
            $emptyState.find('.empty-state__tip').html('');
            $('.result').remove();
        }
    }
    
    
    // /**
    //  * Taken from https://stackoverflow.com/a/6913821.
    //  * 
    //  * Sort an array of objects by certain values.
    //  */
    // export let sort_by: Function;

    // (function() {
    //     // utility functions
    //     var default_cmp = function(a: any, b: any) {
    //             if (a == b) return 0;
    //             return a < b ? -1 : 1;
    //         },
    //         getCmpFunc = function(primer: Function, reverse: boolean) {
    //             var dfc = default_cmp, // closer in scope
    //                 cmp = default_cmp;
    //             if (primer) {
    //                 cmp = function(a, b) {
    //                     return dfc(primer(a), primer(b));
    //                 };
    //             }
    //             if (reverse) {
    //                 return function(a: any, b: any) {
    //                     return -1 * cmp(a, b);
    //                 };
    //             }
    //             return cmp;
    //         };

    //     // actual implementation
    //     sort_by = function() {
    //         var fields: any[] = [],
    //             n_fields = arguments.length,
    //             field, name, reverse, cmp;

    //         // preprocess sorting options
    //         for (var i = 0; i < n_fields; i++) {
    //             field = arguments[i];
    //             if (typeof field === 'string') {
    //                 name = field;
    //                 cmp = default_cmp;
    //             }
    //             else {
    //                 name = field.name;
    //                 cmp = getCmpFunc(field.primer, field.reverse);
    //             }
    //             fields.push({
    //                 name: name,
    //                 cmp: cmp
    //             });
    //         }

    //         // final comparison function
    //         return function(A: any, B: any) {
    //             var a, b, name, result;
    //             for (var i = 0; i < n_fields; i++) {
    //                 result = 0;
    //                 field = fields[i];
    //                 name = field.name;

    //                 result = field.cmp(A[name], B[name]);
    //                 if (result !== 0) break;
    //             }
    //             return result;
    //         }
    //     }
    // }());
}
