import { useEffect, useMemo, useState } from "react";
import type { Vehicle } from "./vehicle.types";

type VehicleListPageProps = {
	vehicles: Vehicle[];
};

const searchableFields: Array<keyof Vehicle> = [
	"vin",
	"make",
	"model",
	"year",
	"agency",
	"status",
];

const searchQueryParameter = "search";

function getSearchQuery(): string {
	if (typeof window === "undefined") {
		return "";
	}

	return new URLSearchParams(window.location.search).get(searchQueryParameter) ?? "";
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

export function VehicleListPage({ vehicles }: VehicleListPageProps) {
	const [query, setQuery] = useState(getSearchQuery);

	useEffect(() => {
		const handleUrlChange = () => setQuery(getSearchQuery());

		window.addEventListener("popstate", handleUrlChange);
		return () => window.removeEventListener("popstate", handleUrlChange);
	}, []);

	const handleQueryChange = (nextQuery: string) => {
		setQuery(nextQuery);
		updateSearchQuery(nextQuery);
	};

	const filteredVehicles = useMemo(
		() => searchVehicles(vehicles, query),
		[vehicles, query],
	);

	return (
		<main>
			<h1>Vehicles</h1>
			<label htmlFor="vehicle-search">Search vehicles</label>
			<input
				id="vehicle-search"
				type="search"
				value={query}
				onChange={(event) => handleQueryChange(event.target.value)}
				placeholder="Search by VIN, make, model, agency, or status"
			/>

			{filteredVehicles.length === 0 ? (
				<p role="status">
					No vehicles found{query.trim() ? ` for "${query}"` : ""}.
				</p>
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
