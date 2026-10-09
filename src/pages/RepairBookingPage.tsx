import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { RepairBookingModal } from '../components/RepairBookingModal';

export function RepairBookingPage() {
  const { closeOverlay, notify } = useApp();
  const [params] = useSearchParams();
  const selectedRepairService = params.get("service") ?? "Screen & OLED Replacement";
  return (
    <RepairBookingModal
      key={selectedRepairService}
      isOpen
      onClose={closeOverlay}
      initialService={selectedRepairService}
      onSuccessToast={(msg) => notify('Repair Booked', msg, 'success')}
    />
  );
}
