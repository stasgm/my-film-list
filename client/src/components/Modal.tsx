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
    const bind = (e: { keyCode: number; }) => {
      if (e.keyCode === 27) {
        // ESC
        if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
          return
        }

        onCancel();
      }

      if (e.keyCode === 13) {
        // Enter
        if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
          return
        }

        onOk();
      }
    }

    document.addEventListener('keyup', bind)
    return () => document.removeEventListener('keyup', bind)
  }, [onCancel, onOk])

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto max-w-xl w-screen sm:p-0 p-4">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="bg-white px-4 pt-6 pb-4 sm:p-4 sm:pb-4 sm:pt-6 rounded-t">
              <div className="text-center sm:mt-0 sm:text-left">
                {/* <div className="sm:flex sm:items-start rounded-t"> */}
                {/* <h3 className="text-2xl font-semibold">{title || "Alert"}</h3> */}
                <h3 className="text-lg leading-6 font-medium text-gray-900">{title || "Alert"}</h3>
                {/* </div> */}
                {message && (
                  // <div className="relative p-4 flex-auto">
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>)}
              </div>
            </div>
            {/* body  */}
            {children}
            {/*footer*/}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b border-slate-200">
              <Button
                className="w-full font-bold uppercase inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button className="font-bold uppercase w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-20 sm:text-sm mt-3">
                Ok
              </Button>
              {/* <Button
                className="text-red-500 font-bold uppercase px-6 py-3 rounded text-sm outline-none hover:bg-gray-100 focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded hover:bg-emerald-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={onOk}
              >
                Ok
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

interface IState {
  content?: React.ReactElement;
  title?: string;
  message?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

interface IModalContext {
  setModal: React.Dispatch<React.SetStateAction<IState | null>>;
};

const defaultValue: IModalContext = {
  setModal: () => {}
};

const ModalContext = React.createContext<IModalContext>(defaultValue);

interface IModalProviderProps {
  children: React.ReactElement;
};

const ModalProvider = (props: IModalProviderProps) => {
  const [modalContent, setModal] = useState<IState | null>(null);

  const onCancel = useCallback(() => {
    modalContent?.onCancel?.();
    setModal(null);
  }, [setModal, modalContent]);

  const onOk = useCallback(() => {
    modalContent?.onOk?.();
    setModal(null);
  }, [setModal, modalContent]);

  return (
    <ModalContext.Provider value={{ setModal }} {...props} >
      {props.children}
      {modalContent && <Modal
        title={modalContent.title}
        message={modalContent.message}
        children={modalContent.content}
        onOk={onOk}
        onCancel={onCancel}
      />}
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
