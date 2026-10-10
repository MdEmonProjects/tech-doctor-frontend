import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import { closeModal } from '../features/modal/modalSlice';
import type { AppDispatch, RootState } from '../app/store';
import AddRepairDevice from './AddRepairDevice';
import AddRepairBrand from './AddRepairBrand';

export default function DefaultModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, title, modalType } = useSelector((state: RootState) => state.modal);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && dispatch(closeModal())}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-2xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <button type="button" onClick={() => dispatch(closeModal())} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close dialog">×</button>
            </header>
            <div className="max-h-[75dvh] overflow-y-auto p-5">
              {modalType === 'ADD_REPAIR_DEVICE' && <AddRepairDevice />}
              {modalType === 'ADD_REPAIR_BRAND' && <AddRepairBrand />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
