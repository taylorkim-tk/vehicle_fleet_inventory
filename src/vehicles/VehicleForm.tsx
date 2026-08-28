import { useEffect, useState } from "react";
import type { Vehicle } from "./vehicle.types";

export type VehicleFormValues = Omit<Vehicle, "id">;

type VehicleFormProps = {
	vehicle?: Vehicle;
	onSubmit: (values: VehicleFormValues) => void;
	onCancel?: () => void;
};

const emptyVehicle: VehicleFormValues = {
	vin: "",
	make: "",
	model: "",
	year: new Date().getFullYear(),
	agency: "",
	status: "IN_SERVICE",
	mileage: 0,
	acquiredDate: "",
};

function getFormValues(vehicle?: Vehicle): VehicleFormValues {
	if (!vehicle) {
		return emptyVehicle;
	}

	const { id: _id, ...values } = vehicle;
	return values;
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
	const [values, setValues] = useState<VehicleFormValues>(() =>
		getFormValues(vehicle),
	);
	const [error, setError] = useState("");
	const isEditing = Boolean(vehicle);

	useEffect(() => {
		setValues(getFormValues(vehicle));
		setError("");
	}, [vehicle]);

	const updateField = <Field extends keyof VehicleFormValues>(
		field: Field,
		value: VehicleFormValues[Field],
	) => {
		setValues((currentValues) => ({ ...currentValues, [field]: value }));
		setError("");
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!values.vin.trim() || !values.make.trim() || !values.model.trim()) {
			setError("VIN, make, and model are required.");
			return;
		}

		if (!values.agency.trim() || !values.acquiredDate) {
			setError("Agency and acquired date are required.");
			return;
		}

		if (!Number.isInteger(values.year) || values.year < 1886) {
			setError("Enter a valid vehicle year.");
			return;
		}

		if (!Number.isFinite(values.mileage) || values.mileage < 0) {
			setError("Mileage cannot be negative.");
			return;
		}

		onSubmit({
			...values,
			vin: values.vin.trim(),
			make: values.make.trim(),
			model: values.model.trim(),
			agency: values.agency.trim(),
		});
	};

	return (
		<form onSubmit={handleSubmit} noValidate>
			<h1>{isEditing ? "Edit vehicle" : "Create vehicle"}</h1>

			{error && (
				<p role="alert">{error}</p>
			)}

			<label>
				VIN
				<input
					required
					value={values.vin}
					onChange={(event) => updateField("vin", event.target.value)}
				/>
			</label>

			<label>
				Make
				<input
					required
					value={values.make}
					onChange={(event) => updateField("make", event.target.value)}
				/>
			</label>

			<label>
				Model
				<input
					required
					value={values.model}
					onChange={(event) => updateField("model", event.target.value)}
				/>
			</label>

			<label>
				Year
				<input
					required
					min="1886"
					type="number"
					value={values.year}
					onChange={(event) => updateField("year", Number(event.target.value))}
				/>
			</label>

			<label>
				Agency
				<input
					required
					value={values.agency}
					onChange={(event) => updateField("agency", event.target.value)}
				/>
			</label>

			<label>
				Status
				<select
					value={values.status}
					onChange={(event) =>
						updateField("status", event.target.value as Vehicle["status"])
					}
				>
					<option value="IN_SERVICE">In service</option>
					<option value="IN_MAINTENANCE">In maintenance</option>
					<option value="RETIRED">Retired</option>
				</select>
			</label>

			<label>
				Mileage
				<input
					required
					min="0"
					type="number"
					value={values.mileage}
					onChange={(event) => updateField("mileage", Number(event.target.value))}
				/>
			</label>

			<label>
				Acquired date
				<input
					required
					type="date"
					value={values.acquiredDate}
					onChange={(event) =>
						updateField("acquiredDate", event.target.value)
					}
				/>
			</label>

			<button type="submit">{isEditing ? "Save changes" : "Create vehicle"}</button>
			{onCancel && (
				<button type="button" onClick={onCancel}>
					Cancel
				</button>
			)}
		</form>
	);
}