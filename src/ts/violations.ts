/*tslint:disable:object-literal-sort-keys*/
const violations: {[key: string]: string[]|null} = {
    'ok': ['✅', '<b>No violations</b>'],  // Custom code (not DOHMH) that means that there were no other violations
    '02A': ['🔥', '<b>Food not cooked</b> to required minimum temperature'],  // Food not cooked to required minimum temperature.
    '02B': ['🍲', '<b>Hot food<b> not kept at safe temperature'],  // Hot food item not held at or above 140º F.
    '02C': ['🥡', '<b>Hot food</b> not reheated properly'],  // Hot food item that has been cooked and refrigerated is being held for service without first being reheated to 165º F or above within 2 hours.
    '02D': ['🧆', '<b>Precooked potentially hazardous food</b> not heated to safe temperature'],  // Precooked potentially hazardous food from commercial food processing establishment that is supposed to be heated, but is not heated to 140º F within 2 hours.
    '02E': ['🐔', '<b>Frozen poultry</b> being cooked frozen or partially thawed'],  // Whole frozen poultry or poultry breasts, other than a single portion, is being cooked frozen or partially thawed.
    '02F': ['🦐', '<b>Meat/seafood</b> served raw or undercooked'],  // Meat, fish or molluscan shellfish served raw or undercooked without prior notification to customer.
    '02G': ['🧀', '<b>Cold food</b> not kept at safe temperature'],  // Cold food item held above 41º F (smoked fish and reduced oxygen packaged foods above 38 ºF) except during necessary preparation.
    '02H': ['💨', '<b>Food not cooled properly</b>'],  // Food not cooled by an approved method whereby the internal product temperature is reduced from 140º F to 70º F or less within 2 hours, and from 70º F to 41º F or less within 4 additional hours.
    '02I': ['🥩', '<b>Food not cooled</b> to safe temperature'],  // Food prepared from ingredients at ambient temperature not cooled to 41º F or below within 4 hours.
    '02J': ['🥟', '<b>Reduced oxygen packaged foods</b> not cooled properly'],  // Reduced oxygen packaged (ROP) foods not cooled by an approved method whereby the internal food temperature is reduced to 38º F within two hours of cooking and if necessary further cooled to a temperature of 34º F within six hours of reaching 38º F.
    '03A': ['🏠', '<b>Food from unapproved source</b>, such as home'],  // Food from unapproved or unknown source or home canned. Reduced oxygen packaged (ROP) fish not frozen before processing; or ROP foods prepared on premises transported to another site.
    '03B': ['🦪', '<b>Shellfish</b> not from approved source'],  // Shellfish not from approved source, improperly tagged/labeled; tags not retained for 90 days.
    '03C': ['🍳', '<b>Eggs</b> found dirty/cracked'],  // Eggs found dirty/cracked; liquid, frozen or powdered eggs not pasteurized.
    '03D': ['🥫', '<b>Canned food</b> swollen, leaking or rusted'],  // Canned food product observed swollen, leaking or rusted, and not segregated from other consumable food items.
    '03E': ['🚱', '<b>Water supply</b> inadequate'],  // Potable water supply inadequate. Water or ice not potable or from unapproved source.  Cross connection in potable water supply system observed.
    '03F': ['🥛', '<b>Unpasteurized milk</b>'],  // Unpasteurized milk or milk product present.
    '03G': ['🍣', '<b>Raw food</b> not properly washed'],  // Raw food not properly washed prior to serving.
    '04A': ['📑', '<b>Food Protection Certificate</b> not held by supervisor'],  // Food Protection Certificate not held by supervisor of food operations.
    '04B': ['🤒', '<b>Sick workers</b> with open cuts'],  // Food worker prepares food or handles utensil when ill with a disease transmissible by food, or have exposed infected cut or burn on hand.
    '04C': ['🖐', '<b>Workers touch food</b> directly with hands'],  // Food worker does not use proper utensil to eliminate bare hand contact with food that will not receive adequate additional heat treatment.
    '04D': ['🤧', "<b>Workers don't wash hands</b> after using bathroom/sneezing"],  // Food worker does not wash hands thoroughly after using the toilet, coughing, sneezing, smoking, eating, preparing raw foods or otherwise contaminating hands.
    '04E': ['💀', '<b>Toxic chemical</b> improperly labeled or stored'],  // Toxic chemical improperly labeled, stored or used such that food contamination may occur.
    '04F': ['☣', '<b>Food contaminated</b> by sewage or liquid waste'],  // Food, food preparation area, food storage area, area used by employees or patrons, contaminated by sewage or liquid waste.
    '04G': ['🔄', '<b>Potentially hazardous food re-served</b>'],  // Unprotected potentially hazardous food re-served.
    '04H': ['🔀', '<b>Food cross-contaminated</b>'],  // Raw, cooked or prepared food is adulterated, contaminated, cross-contaminated, or not discarded in accordance with HACCP plan.
    '04I': ['🥨', '<b>Unprotected food re-served</b>'],  // Unprotected food re-served.
    '04J': ['🌡', '<b>Thermometer</b> not properly used'],  // Appropriately scaled metal stem-type thermometer or thermocouple not provided or used to evaluate temperatures of potentially hazardous foods during cooking, cooling, reheating and holding.
    '04K': ['🐀', '<b>Live rats</b>'],  // Evidence of rats or live rats present in facility's food and/or non-food areas.
    '04L': ['🐭', '<b>Live mice</b>'],  // Evidence of mice or live mice present in facility's food and/or non-food areas.
    '04M': ['🐞', '<b>Live roaches</b>'],  // Live roaches present in facility's food and/or non-food areas.
    '04N': ['🦟', '<b>Filth flies</b>'],  // Filth flies or food/refuse/sewage-associated (FRSA) flies present in facility’s food and/or non-food areas. Filth flies include house flies, little house flies, blow flies, bottle flies and flesh flies. Food/refuse/sewage-associated flies include fruit flies, drain flies and Phorid flies.
    '04O': ['😼', '<b>Live animals other than fish</b>'],  // Live animals other than fish in tank or service animal present in facility's food and/or non-food areas.
    '05A': ['🧻', '<b>Sewage disposal system</b> improper or unapproved'],  // Sewage disposal system improper or unapproved.
    '05B': ['☠', '<b>Harmful gas or vapor</b> detected, including carbon monoxide'],  // Harmful, noxious gas or vapor detected. CO ~1 3 ppm.
    '05C': ['📦', 'Improper <b>food contact surface</b>'],  // Food contact surface improperly constructed or located. Unacceptable material used.
    '05D': ['🧼', 'No <b>hand washing facility and/or soap</b>'],  // Hand washing facility not provided in or near food preparation area and toilet room. Hot and cold running water at adequate pressure to enable cleanliness of employees not provided at facility. Soap and an acceptable hand-drying device not provided.
    '05E': ['🚽', '<b>Toilet not provided</b>'],  // Toilet facility not provided for employees or for patrons when required.
    '05F': ['🌡', '<b>Food not kep</b>proper temperatures'],  // Insufficient or no refrigerated or hot holding equipment to keep potentially hazardous foods at required temperatures.
    '05H': ['🚿', '<b>No facilities to wash equipment</b>'],  // No facilities available to wash, rinse and sanitize utensils and/or equipment.
    '06A': ['💩', '<b>Worker cleanliness inadequate</b>'],  // Personal cleanliness inadequate. Outer garment soiled with possible contaminant. Effective hair restraint not worn in an area where food is prepared.
    '06B': ['🌿', '<b>Tobacco use or eating</b> from open container'],  // Tobacco use, eating, or drinking from open container in food preparation, food storage or dishwashing area observed.
    '06C': ['🔀', '<b>Food not protected</b> from contamination'],  // Food not protected from potential source of contamination during storage, preparation, transportation, display or service.
    '06D': ['💧', '<b>Food contact surface</b> not properly washed'],  // Food contact surface not properly washed, rinsed and sanitized after each use and following any activity when contamination may have occurred.
    '06E': ['🧽', '<b>Sanitized equipment</b> improperly used'],  // Sanitized equipment or utensil, including in-use food dispensing utensil, improperly used or stored.
    '06F': ['🧺', '<b>Wiping cloths</b> dirty'],  // Wiping cloths soiled or not stored in sanitizing solution.
    '06G': ['📄', '<b>HACCP plan</b> not approved'],  // HACCP plan not approved or approved HACCP plan not maintained on premises.
    '06H': ['📜', '<b>Records and logs</b> not maintained'],  // Records and logs not maintained to demonstrate that HACCP plan has been properly implemented.
    '06I': ['🎫', '<b>Food not labeled</b> properly'],  // Food not labeled in accordance with HACCP plan.
    '07A': ['👷‍♂️', '<b>Department of Health obstructed</b>'],  // Duties of an officer of the Department interfered with or obstructed.
    '08A': ['🐁', '<b>Facility not vermin proof</b>'],  // Facility not vermin proof. Harborage or conditions conducive to attracting vermin to the premises and/or allowing vermin to exist.
    '08B': ['🚮', '<b>Garbage can</b> missing or inadequate'],  // Covered garbage receptacle not provided or inadequate, except that garbage receptacle may be uncovered during active use. Garbage storage area not properly constructed or maintained; grinder or compactor dirty.
    '08C': ['💀', '<b>Misuse of pesticides</b> or prohibited chemicals'],  // Pesticide use not in accordance with label or applicable laws. Prohibited chemical used/stored. Open bait station used.
    '09A': ['🥫', '<b>Canned food</b> dented'],  // Canned food product observed dented and not segregated from other consumable food items.
    '09B': ['❄', '<b>Improper thawing</b>'],  // Thawing procedures improper.
    '09C': ['💀', '<b>Food contact surface</b> not properly maintained'],  // Food contact surface not properly maintained.
    '10A': ['🚽', '<b>Toilet</b> not maintained properly'],  // Toilet facility not maintained and provided with toilet paper, waste receptacle and self-closing door.
    '10B': ['🚽', '<b>Plumbing</b> not properly installed'],  // Plumbing not properly installed or maintained; anti-siphonage or backflow prevention device not provided where required; equipment or floor not properly drained; sewage disposal system in disrepair or not functioning properly.
    '10C': ['💡', '<b>Inadequate lighting</b>'],  // Lighting inadequate; permanent lighting not provided in food preparation areas, ware washing areas, and storage rooms.
    '10D': ['🌬', '<b>Insufficient ventilation</b>'],  // Mechanical or natural ventilation system not provided, improperly installed, in disrepair and/or fails to prevent excessive build-up of grease, heat, steam condensation vapors, odors, smoke, and fumes.
    '10E': ['🌡', '<b>Thermometer</b> is not accurate for refrigerated or hot food'],  // Accurate thermometer not provided in refrigerated or hot holding equipment.
    '10F': ['📦', '<b>Non-food contact surface</b> improperly constructed'],  // Non-food contact surface improperly constructed. Unacceptable material used. Non-food contact surface or equipment improperly maintained and/or not properly sealed, raised, spaced or movable to allow accessibility for cleaning on all sides, above and underneath the unit.
    '10G': ['🛌', '<b>People living/sleeping</b> in restaurant'],  // Food service operation occurring in room used as living or sleeping quarters.
    '10H': ['🍴', '<b>Improper sanitization</b> of utensils'],  // Proper sanitization not provided for utensil ware washing operation.
    '10I': ['🍽', '<b>Single service item</b> reused'],  // Single service item reused, improperly stored, dispensed; not used when required.
    '10J': ['🧼', '<b>"Wash hands" sign</b> not posted'],  // "Wash hands" sign not posted at hand wash facility.
    '15I': ['🚬', '<b>Smoking signs</b> not conspicuously posted'],  // "No Smoking" and/or "Smoking Permitted" sign not conspicuously posted. Health warning not present on "Smoking Permitted".
    '15J': ['🚬', '<b>Ashtray</b> in smoke-free area'],  // Ashtray present in smoke-free area.
    '15K': ['🚬', 'Workers <b>did not prevent smoking</b>'],  // Operator failed to make good faith effort to inform smokers of the Smoke-free Act prohibition of smoking.
    '15L': ['🚬', '<b>Smoke-free workplace</b> policy not clear'],  // Smoke free workplace smoking policy inadequate, not posted, not provided to employees.
    '15S': ['🌿', '<b>Flavored tobacco</b> sold'],  // Flavored tobacco products sold or offered for sale.
    '15T': ['🌿', '<b>Original label for tobacco</b> sold'],  // Original label for tobacco products sold or offered for sale.
    '16A': ['🛢', 'Food served with <b>artificial trans fat</b>'],  // A food containing artificial trans fat, with 0.5 grams or more of trans fat per serving, is being stored, distributed, held for service, used in preparation of a menu item, or served.
    '16B': ['🏷', '<b>Food labels</b> not kept on site'],  // The original nutritional fact labels and/or ingredient label for a cooking oil, shortening or margarine or food item sold in bulk, or acceptable manufacturer’s documentation not maintained on site.
    '16C': ['🔟', '<b>Calories not posted</b>'],  // Caloric content not posted on menus, menu boards or food tags, in a food service establishment that is 1 of 15 or more outlets operating the same type of business nationally under common ownership or control, or as a franchise or doing business under the same name, for each menu item that is served in portions, the size and content of which are standardized.
    '16D': ['🔟', '<b>Calories not correctly posted</b> at drive-through'],  // Posted caloric content on the menu(s), menu board(s), food tag(s) or stanchions adjacent to menu boards for drive-through windows deficient, in that the size and/or font for posted calories is not as prominent as the name of the menu item or its price.
    '16E': ['🔟', '<b>Calories not correctly posted</b> for each flavor/size of food'],  // Caloric content range (minimum to maximum) not posted on menus and or menu boards for each flavor, variety and size of each menu item that is offered for sale in different flavors, varieties and sizes.
    '16F': ['🔟', '<b>Calories not correctly posted</b> for combo meals'],  // Specific caloric content or range thereof not posted on menus, menu boards or food tags for each menu item offered as a combination meal with multiple options that are listed as single items.
    '18B': ['📃', '<b>Forged Department of Health document</b>'],  // Document issued by the Board of Health, Commissioner or Department unlawfully reproduced or altered.
    '18C': ['📃', '<b>Forged Department of Health notice</b>'],  // Notice of the Department of Board of Health mutilated, obstructed, or removed.
    '18D': ['⛔', '<b>Failure to comply</b> with Department of Health'],  // Failure to comply with an Order of the Board of Health, Commissioner, or Department.
    '18F': ['📑', '<b>Permit</b> not conspicuously displayed'],  // Permit not conspicuously displayed.
    '18G': ['🍦', 'Unauthorized <b>frozen dessert</b> production'],  // Manufacture of frozen dessert not authorized on Food Service Establishment permit.
    '20A': ['🥜', '<b>Allergy information</b> not conspicuously posted'],  // Food allergy information poster not conspicuously posted where food is being prepared or processed by food workers.
    '20B': ['🔠', '<b>Allergy information</b> not in understood language'],  // Food allergy information poster not posted in language understood by all food workers.
    '20D': ['➕', '<b>"First Aid"/"Alcohol and Pregnancy" posters</b> missing or not posted'],  // “Choking first aid” poster not posted. “Alcohol and pregnancy” warning sign not posted. Resuscitation equipment: exhaled air resuscitation masks (adult & pediatric), latex gloves, sign not posted. Inspection report sign not posted.
    '20E': ['🅱', '<b>Letter Grade or Grade Pending</b> not conspicuously shown'],  // Letter Grade or Grade Pending card not conspicuously posted and visible to passersby.
    '20F': ['🅱', '<b>Current letter grade</b> not posted'],  // Current letter grade card not posted.
    '22A': ['💥', '<b>Nuisance</b> created or allowed to exist'],  // Nuisance created or allowed to exist. Facility not free from unsafe, hazardous, offensive or annoying conditions.
    '22B': ['🚺', '<b>Toilet facility used by women</b> does not have a covered garbage can'],  // Toilet facility used by women does not have at least one covered garbage receptacle.
    '22C': ['💡', '<b>Lightbulb</b> not shielded or shatterproof'],  // Bulb not shielded or shatterproof, in areas where there is extreme heat, temperature changes, or where accidental contact may occur.
    '22E': ['⛔', '<b>ROP processing equipment</b> not approved by Department of Health'],  // ROP processing equipment not approved by DOHMH.
    '22F':  null,
    '22G':  null,
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
/*tslint:enable:object-literal-sort-keys*/
