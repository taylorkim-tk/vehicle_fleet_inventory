import { useEffect, useMemo, useState } from "react";
import type { Vehicle } from "./vehicle.types";

type VehicleListPageProps = {
	vehicles?: Vehicle[];
	loading?: boolean;
	error?: string | null;
};

type VehicleStatusFilter = Vehicle["status"] | "ALL";

type VehicleFilter = (vehicles: Vehicle[]) => Vehicle[];

const searchableFields: Array<keyof Vehicle> = [
	"vin",
	"make",
	"model",
	"year",
	"agency",
	"status",
];

const searchQueryParameter = "search";
const statusQueryParameter = "status";

function getSearchQuery(): string {
	if (typeof window === "undefined") {
		return "";
	}

	return new URLSearchParams(window.location.search).get(searchQueryParameter) ?? "";
}

function getStatusFilter(): VehicleStatusFilter {
	if (typeof window === "undefined") {
		return "ALL";
	}

	const status = new URLSearchParams(window.location.search).get(statusQueryParameter);
	if (status === "IN_SERVICE" || status === "IN_MAINTENANCE" || status === "RETIRED") {
		return status;
	}

	return "ALL";
}

function updateSearchQuery(query: string): void {
	if (typeof window === "undefined") {
		return;
	}

	const url = new URL(window.location.href);
	const normalizedQuery = query.trim();

	if (normalizedQuery) {
		url.searchParams.set(searchQueryParameter, normalizedQuery);
	} else {
		url.searchParams.delete(searchQueryParameter);
	}

	window.history.replaceState(window.history.state, "", url);
}

function updateStatusQuery(status: VehicleStatusFilter): void {
	if (typeof window === "undefined") {
		return;
	}

	const url = new URL(window.location.href);

	if (status === "ALL") {
		url.searchParams.delete(statusQueryParameter);
	} else {
		url.searchParams.set(statusQueryParameter, status);
	}

	window.history.replaceState(window.history.state, "", url);
}

export function searchVehicles(vehicles: Vehicle[], query: string): Vehicle[] {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) {
		return vehicles;
	}

	return vehicles.filter((vehicle) =>
		searchableFields.some((field) =>
			String(vehicle[field]).toLowerCase().includes(normalizedQuery),
		),
	);
}

export function filterByStatus(
	vehicles: Vehicle[],
	status: VehicleStatusFilter,
): Vehicle[] {
	if (status === "ALL") {
		return vehicles;
	}

	return vehicles.filter((vehicle) => vehicle.status === status);
}

export function composeVehicleFilters(...filters: VehicleFilter[]): VehicleFilter {
	return (vehicles: Vehicle[]) =>
		filters.reduce((currentVehicles, filter) => filter(currentVehicles), vehicles);
}

export function VehicleListPage({
	vehicles = [],
	loading = false,
	error = null,
}: VehicleListPageProps) {
	const [query, setQuery] = useState(getSearchQuery);
	const [status, setStatus] = useState<VehicleStatusFilter>(getStatusFilter);

	useEffect(() => {
		const handleUrlChange = () => {
			setQuery(getSearchQuery());
			setStatus(getStatusFilter());
		};

		window.addEventListener("popstate", handleUrlChange);
		return () => window.removeEventListener("popstate", handleUrlChange);
	}, []);

	const handleQueryChange = (nextQuery: string) => {
		setQuery(nextQuery);
		updateSearchQuery(nextQuery);
	};

	const handleStatusChange = (nextStatus: VehicleStatusFilter) => {
		setStatus(nextStatus);
		updateStatusQuery(nextStatus);
	};

	const filteredVehicles = useMemo(
		() =>
			composeVehicleFilters(
				(vehiclesToFilter) => filterByStatus(vehiclesToFilter, status),
				(vehiclesToFilter) => searchVehicles(vehiclesToFilter, query),
			)(vehicles),
		[vehicles, query, status],
	);

	if (loading) {
		return (
			<main>
				<h1>Vehicles</h1>
				<div role="status" aria-live="polite">
					<span aria-hidden="true">⏳</span> Loading vehicles...
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main>
				<h1>Vehicles</h1>
				<p role="alert">{error}</p>
			</main>
		);
	}

	return (
		<main>
			<h1>Vehicles</h1>
			<div>
				<label htmlFor="vehicle-search">Search vehicles</label>
				<input
					id="vehicle-search"
					type="search"
					value={query}
					onChange={(event) => handleQueryChange(event.target.value)}
					placeholder="Search by VIN, make, model, agency, or status"
				/>
			</div>

			<div>
				<label htmlFor="vehicle-status">Status</label>
				<select
					id="vehicle-status"
					value={status}
					onChange={(event) =>
						handleStatusChange(event.target.value as VehicleStatusFilter)
					}
				>
					<option value="ALL">All statuses</option>
					<option value="IN_SERVICE">In service</option>
					<option value="IN_MAINTENANCE">In maintenance</option>
					<option value="RETIRED">Retired</option>
				</select>
			</div>

			{filteredVehicles.length === 0 ? (
				<p role="status">No vehicles match these filters.</p>
			) : (
				<ul>
					{filteredVehicles.map((vehicle) => (
						<li key={vehicle.id}>
							<strong>
								{vehicle.year} {vehicle.make} {vehicle.model}
							</strong>
							<span>VIN: {vehicle.vin}</span>
							<span>Agency: {vehicle.agency}</span>
							<span>Status: {vehicle.status}</span>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
