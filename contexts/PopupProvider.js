import { createContext, useState, useCallback, useContext } from 'react'

import ConfirmDialog from 'parts/ConfirmDialog'

const initInfo = {
  title: 'Alert',
  text: '',
  cancelLabel: 'Ok',
}

export const PopupContext = createContext(null)

export const usePopup = () => {
  const { setOpen, setPopupInfo } = useContext(PopupContext)

  const setPopUp = useCallback(
    (data) => {
      setPopupInfo({
        ...initInfo,
        ...data,
      })
      setOpen(true)
    },
    [setPopupInfo, setOpen]
  )

  return {
    setPopUp,
  }
}

export default function PopupProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [popupInfo, setPopupInfo] = useState(initInfo)

  const closePopUpHandler = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <PopupContext.Provider
      value={{
        setOpen,
        setPopupInfo,
      }}
    >
      {open && (
        <ConfirmDialog
          open={open}
          title={popupInfo?.title}
          text={popupInfo?.text}
          confirmLabel={popupInfo?.cancelLabel}
          onConfirm={closePopUpHandler}
          onClose={closePopUpHandler}
        />
      )}
      {children}
    </PopupContext.Provider>
  )
}
