import { Modal, notification } from 'antd'
import { useCallback, useState } from 'react'
import { useAppContext } from '../../context/appStore'
import {
  getContractDetails,
  requestAccounts,
} from '../../utils/contract'

function notifySuccessfulConnection(balance: string): void {
  notification.success({
    message: 'Successful connection.',
    description: (
      <div>
        Your wallet, with balance <strong>{balance} ETH</strong>, is now
        connected.
      </div>
    ),
  })
}

function notifySomethingWentWrong(error: unknown): void {
  notification.error({
    message: 'Something went wrong',
    description: `${error}`,
  })
}

export default function ConnectButton() {
  const [connecting, setConnecting] = useState(false);
  const [appState, appDispatch] = useAppContext();

  const clickConnect = useCallback(async () => {
    if (!appState.address) {
      setConnecting(true);
      try {
        const accounts = await requestAccounts();
        const address = accounts[0];
        const { balance, isManager, hasEntered, participants } = await getContractDetails(address);
        appDispatch({ address, balance, isManager, hasEntered, participants });
        notifySuccessfulConnection(balance);
      } catch (error) {
        notifySomethingWentWrong(error)
      } finally {
        setConnecting(false)
      }
    }
  }, [appState.address])

  const clickDisconnect = useCallback(async () => {
    Modal.info({
      content: 'Not yet implemented',
      footer: null,
      closable: true,
      maskClosable: true,
    })
  }, [])

  return {
    appState,
    connecting,
    clickConnect,
    clickDisconnect,
  }
}