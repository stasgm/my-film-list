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
        <div className="relative my-6 mx-auto max-w-xl w-screen">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-4 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">{title || "Alert"}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onCancel}
              >
                <span className="bg-transparent text-black h-7 w-7 block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/* body  */}
            {children}
            {message && (
              <div className="relative p-4 flex-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed">{message}</p>
              </div>)}
            {/*footer*/}
            <div className="flex items-center justify-end p-4 border-t border-solid border-slate-200 rounded-b">
              <Button
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
              </Button>
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
