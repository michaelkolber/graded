interface ViolationResult {
    camis: string;
    inspection_date: string;
    action: string;
    violation_code: string;
    critical_flag: string;
    grade: Grade|undefined;
}

interface RestaurantResult {
    camis: string;
    dba: string;
    lat: string;  // `latitude` appears to be reserved in SODA
    long: string; // `longitude` appears to be reserved in SODA
    boro: 'Bronx'|'Brooklyn'|'Manhattan'|'Queens'|'Staten Island'|0;
    building: string; // The house number
    street: string;
    cuisine_description: string;
}

type Grade = 'N'|'A'|'B'|'C'|'Z'|'P';
