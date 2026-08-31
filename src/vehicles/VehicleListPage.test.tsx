import { render, screen } from "@testing-library/react";
import { VehicleListPage } from "./VehicleListPage";

describe("VehicleListPage", () => {
  it("shows a loading state while fetching", () => {
    render(<VehicleListPage loading />);
    expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument();
  });

  it("shows an empty state when no vehicles match", () => {
    render(<VehicleListPage vehicles={[]} />);
    expect(screen.getByText(/no vehicles match these filters/i)).toBeInTheDocument();
  });

  it("shows an error state when loading fails", () => {
    render(<VehicleListPage vehicles={[]} error="Failed to load vehicles" />);
    expect(screen.getByText(/failed to load vehicles/i)).toBeInTheDocument();
  });
});
