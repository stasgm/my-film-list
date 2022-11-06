import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ButtonGroup";


interface IModalProps {
  title?: string;
  message?: string;
  children?: React.ReactElement;
  onCancel: () => void;
  onOk: () => void;
};

const Modal = ({ children, title, message, onOk, onCancel }: IModalProps): JSX.Element => {
  useEffect(() => {
    const bind = (e: { keyCode: number }) => {
      if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
        return
      }

      if (e.keyCode === 27) {
        // ESC
        onCancel();
      }

      if (e.keyCode === 13) {
        // Enter
        onOk();
      }
    }

    document.addEventListener('keyup', bind)
    return () => document.removeEventListener('keyup', bind)
  }, [onCancel, onOk])

  return (
    <div className="fixed inset-0 z-30 backdrop-blur-sm backdrop-brightness-75" onClick={onCancel}>
      <div className="justify-center z-31 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
        <div className="relative max-w-xl sm:p-0 p-4" onClick={e => e.stopPropagation()}>
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="px-4 pt-6 pb-4 sm:p-4 sm:pb-4 sm:pt-6 rounded-t bg-gray-200">
              <div className="text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-semibold uppercase text-gray-900">{title || "Alert"}</h3>
                {/* </div> */}
                {message && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>)}
              </div>
            </div>
            {/* body */}
            {/*footer*/}
            {children ? children : (
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-end rounded-b border-slate-200">
                <Button
                  className="w-full uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-20 sm:text-sm"
                  onClick={onOk}
                >
                  Ok
                </Button>
                <Button
                  className="w-full uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm mt-3"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface IState {
  component?: React.ReactElement;
  title?: string;
  message?: string;
  onOk?: (value?: any) => void;
  onCancel?: () => void;
}

interface IModalContext {
  openModal: React.Dispatch<React.SetStateAction<IState | null>>;
  closeModal: () => void;
};

const defaultValue: IModalContext = {
  openModal: () => {},
  closeModal: () => {}
};

const ModalContext = React.createContext<IModalContext>(defaultValue);

interface IModalProviderProps {
  children: React.ReactElement;
};

const ModalProvider = (props: IModalProviderProps) => {
  const [modalContent, openModal] = useState<IState | null>(null);

  const closeModal = useCallback(() => {
    openModal(null);
  }, [openModal]);

  const onCancel = useCallback(() => {
    modalContent?.onCancel?.();
    closeModal();
  }, [modalContent, closeModal]);

  const onOk = useCallback(() => {
    modalContent?.onOk?.();
    closeModal();
  }, [modalContent, closeModal]);


  return (
    <ModalContext.Provider value={{ openModal, closeModal }} {...props}>
      {props.children}
      {modalContent
        ? (
          <Modal
            title={modalContent.title}
            message={modalContent.message}
            children={modalContent.component}
            onOk={onOk}
            onCancel={onCancel}
          />
        )
        : null
      }
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a UserProvider')
  }

  return context;
}

export { ModalProvider, useModal }
