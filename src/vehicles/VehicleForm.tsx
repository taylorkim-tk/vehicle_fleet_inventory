import { useEffect, useState } from "react";
import { vehicleFormSchema, type VehicleFormValues } from "./vehicle.types";
import type { Vehicle } from "./vehicle.types";

type VehicleFormProps = {
	vehicle?: Vehicle;
	onSubmit: (values: VehicleFormValues) => void;
	onCancel?: () => void;
};

type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>;

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

function getFieldErrors(values: VehicleFormValues): VehicleFormErrors {
	const result = vehicleFormSchema.safeParse(values);
	if (result.success) {
		return {};
	}

	return result.error.issues.reduce<VehicleFormErrors>((errors, issue) => {
		const field = issue.path[0];
		if (typeof field === "string" && !errors[field as keyof VehicleFormValues]) {
			errors[field as keyof VehicleFormValues] = issue.message;
		}
		return errors;
	}, {});
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
	const [values, setValues] = useState<VehicleFormValues>(() =>
		getFormValues(vehicle),
	);
	const [error, setError] = useState("");
	const [fieldErrors, setFieldErrors] = useState<VehicleFormErrors>({});
	const isEditing = Boolean(vehicle);

	useEffect(() => {
		setValues(getFormValues(vehicle));
		setError("");
		setFieldErrors({});
	}, [vehicle]);

	const updateField = <Field extends keyof VehicleFormValues>(
		field: Field,
		value: VehicleFormValues[Field],
	) => {
		const nextValues = { ...values, [field]: value };
		setValues(nextValues);
		setFieldErrors(getFieldErrors(nextValues));
		setError("");
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextErrors = getFieldErrors(values);
		if (Object.keys(nextErrors).length > 0) {
			setFieldErrors(nextErrors);
			setError("Please correct the highlighted fields.");
			return;
		}

		setError("");
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
					aria-invalid={Boolean(fieldErrors.vin)}
					value={values.vin}
					onChange={(event) => updateField("vin", event.target.value)}
				/>
				{fieldErrors.vin && <small role="alert">{fieldErrors.vin}</small>}
			</label>

			<label>
				Make
				<input
					required
					aria-invalid={Boolean(fieldErrors.make)}
					value={values.make}
					onChange={(event) => updateField("make", event.target.value)}
				/>
				{fieldErrors.make && <small role="alert">{fieldErrors.make}</small>}
			</label>

			<label>
				Model
				<input
					required
					aria-invalid={Boolean(fieldErrors.model)}
					value={values.model}
					onChange={(event) => updateField("model", event.target.value)}
				/>
				{fieldErrors.model && <small role="alert">{fieldErrors.model}</small>}
			</label>

			<label>
				Year
				<input
					required
					min="1886"
					type="number"
					aria-invalid={Boolean(fieldErrors.year)}
					value={values.year}
					onChange={(event) => updateField("year", Number(event.target.value))}
				/>
				{fieldErrors.year && <small role="alert">{fieldErrors.year}</small>}
			</label>

			<label>
				Agency
				<input
					required
					aria-invalid={Boolean(fieldErrors.agency)}
					value={values.agency}
					onChange={(event) => updateField("agency", event.target.value)}
				/>
				{fieldErrors.agency && <small role="alert">{fieldErrors.agency}</small>}
			</label>

			<label>
				Status
				<select
					value={values.status}
					aria-invalid={Boolean(fieldErrors.status)}
					onChange={(event) =>
						updateField("status", event.target.value as Vehicle["status"])
					}
				>
					<option value="IN_SERVICE">In service</option>
					<option value="IN_MAINTENANCE">In maintenance</option>
					<option value="RETIRED">Retired</option>
				</select>
				{fieldErrors.status && <small role="alert">{fieldErrors.status}</small>}
			</label>

			<label>
				Mileage
				<input
					required
					min="0"
					type="number"
					aria-invalid={Boolean(fieldErrors.mileage)}
					value={values.mileage}
					onChange={(event) => updateField("mileage", Number(event.target.value))}
				/>
				{fieldErrors.mileage && <small role="alert">{fieldErrors.mileage}</small>}
			</label>

			<label>
				Acquired date
				<input
					required
					type="date"
					aria-invalid={Boolean(fieldErrors.acquiredDate)}
					value={values.acquiredDate}
					onChange={(event) =>
						updateField("acquiredDate", event.target.value)
					}
				/>
				{fieldErrors.acquiredDate && (
					<small role="alert">{fieldErrors.acquiredDate}</small>
				)}
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