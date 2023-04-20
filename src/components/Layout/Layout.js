import { Outlet } from "react-router-dom"
import Header from "../Header/Header"
import { message } from "antd"
import { createContext } from "react";

export const MessageContext = createContext();

const Layout = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const pushMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  }

  return (
    <>
      {contextHolder}
      <MessageContext.Provider value={{pushMessage}}>
        <Header />
        <Outlet />
      </MessageContext.Provider>
    </>
  )
}

export default Layout