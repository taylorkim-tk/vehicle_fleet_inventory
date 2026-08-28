export type Vehicle = {
    id: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    agency: string;
    status: "IN_SERVICE" | "IN_MAINTENANCE" | "RETIRED";
    mileage: number;
    acquiredDate: string;
}