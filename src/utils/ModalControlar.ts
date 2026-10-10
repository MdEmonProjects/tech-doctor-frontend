import store from '../app/store';
import { closeModal, openModal, type ModalType } from '../features/modal/modalSlice';

export function showModal(title: string, modalType: Exclude<ModalType, null>) {
  store.dispatch(openModal({ title, modalType }));
}

export function hideModal() {
  store.dispatch(closeModal());
}
