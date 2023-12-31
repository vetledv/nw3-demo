import type { MaybeVehicle } from '~/types/vehicles';
import { useHoveredVehicle, useSelectedVehicle } from '~/store/VehicleStore';
import { useMarkerEvents } from '~/store/MarkerStore';

export function MarkerCard({
  marker,
}: Record<string, { longitude: number; latitude: number }>) {
  return (
    <div className='p-2 space-y-2 rounded-md bg-slate-600'>
      <div>{marker.latitude}</div>
      <div>{marker.longitude}</div>
    </div>
  );
}

export function VehicleCard({ vehicle }: { vehicle: MaybeVehicle }) {
  const idSplit = vehicle.vehicleId?.split(':');
  return (
    <div className='p-2 space-y-2 rounded-md bg-slate-600'>
      <h3 className='flex gap-2 text-xl font-bold'>
        <span>{idSplit?.[0]}</span>
        <span>{idSplit?.[2]}</span>
      </h3>
      <p>Latitude: {vehicle.location?.latitude}</p>
      <p>Latitude: {vehicle.location?.longitude}</p>
    </div>
  );
}

export function VehicleDetailWrapper() {
  const hoveredVehicle = useHoveredVehicle();
  const selectedVehicle = useSelectedVehicle();
  const marker = useMarkerEvents();

  return (
    <div className='space-y-4'>
      {marker && (
        <div className='space-y-2'>
          <p>Marker</p>
          <MarkerCard marker={marker} />
        </div>
      )}
      {selectedVehicle && (
        <div className='space-y-2'>
          <p>Selected</p>
          <VehicleCard vehicle={selectedVehicle} />
        </div>
      )}
      {hoveredVehicle && (
        <div className='space-y-2'>
          <p>Hovered</p>
          <VehicleCard vehicle={hoveredVehicle} />
        </div>
      )}
    </div>
  );
}
