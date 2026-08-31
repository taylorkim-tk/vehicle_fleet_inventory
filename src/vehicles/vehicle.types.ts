import { z } from "zod";

const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;

export const vehicleFormSchema = z.object({
	vin: z
		.string()
		.trim()
		.min(1, "VIN is required.")
		.regex(vinPattern, "VIN must be a valid 17-character VIN."),
	make: z.string().trim().min(1, "Make is required."),
	model: z.string().trim().min(1, "Model is required."),
	year: z
		.number()
		.int("Year must be a whole number.")
		.min(1886, "Enter a valid vehicle year.")
		.max(new Date().getFullYear(), "Year cannot be in the future."),
	agency: z.string().trim().min(1, "Agency is required."),
	status: z.enum(["IN_SERVICE", "IN_MAINTENANCE", "RETIRED"]),
	mileage: z.number().nonnegative("Mileage cannot be negative."),
	acquiredDate: z.string().min(1, "Acquired date is required."),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

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
};