import axios from "axios";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ItemConversationCurrent from "../../components/ItemConversationCurrent";
import Message from "../../components/Message";
import LayoutClient from "../../layouts/LayoutClient";
import Picker from "emoji-picker-react";
import { v4 as uuidv4 } from "uuid";
import InputMessage from "../../components/InputMessage";
const Messager = ({ socket }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  // const [curentChat, setCurrentChat] = useState();
  const [conversation, setConversation] = useState();
  const [messages, setMesssages] = useState();
  const [friend, setFriend] = useState();
  const srcollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState();
  const { tokenCallVideo,curentChat } = useSelector((state) => state.user);

  // const socket = useRef();
  //socket io
  // useEffect(() => {
  //   setSocket(io("ws://localhost:8900"));
  // }, []);
  useEffect(() => {
    socket.off("alertMessage");

    // socket.current = io("ws://localhost:8900");
    socket?.on("getMessage", (data) => {
      console.log("get ne");
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    console.log("change arrivalMessage and curentChat");
    arrivalMessage &&
      [curentChat?.user_one, curentChat?.user_second]?.includes(
        arrivalMessage.sender
      ) &&
      setMesssages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, curentChat]);

  useEffect(() => {
    // socket?.current.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);
  //end socket io
  const FetchConversation = async () => {
    try {
      const response = await axios({
        url: "/auth/conversation",
      });
      console.log(response);
      if (response.status == 200) {
        setConversation(response.data);
      }
    } catch (e) {
      console.log(e);
      if (e.response.status == 401) {
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    FetchConversation();
  }, []);
  console.log(curentChat);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "/auth/message/" + curentChat?.id,
        });
        console.log(response);
        if (response.status === 200) {
          setMesssages(response.data);
        }
      } catch (e) {
        console.log(e);
        if (e.response.status == 401) {
          navigate("/login");
        }
      }
    };
    getMessages();
    if (curentChat) {
      const friend_id = [curentChat.user_one, curentChat.user_second].find(
        (u) => u !== user?.id
      );

      const getUser = async () => {
        try {
          const response = await axios({
            url: "auth/admin/user/" + friend_id,
          });
          console.log(response);
          if (response.status === 200) {
            setFriend(response.data);
          }
        } catch (e) {
          console.log(e);
          if (e.response.status == 401) {
            navigate("/login");
          }
        }
      };
      getUser();
    }
  }, [curentChat]);

  const createMessage = async (e,message) => {
    e.preventDefault();
    if (!message) return alert("vui lòng nhập kí tự");
    const message_data = {
      sender: user?.id,
      text: message,
      id_conversation: curentChat.id,
    };

    const receiverId = [curentChat.user_one, curentChat.user_second].find(
      (u) => u !== user?.id
    );
    socket?.emit("sendMessage", {
      senderId: user?.id,
      nameSender: user?.firstName + " " + user?.lastName,
      receiverId: receiverId,
      text: message,
    });

    try {
      const response = await axios({
        method: "POST",
        url: "/auth/message",
        data: message_data,
      });
      if (response.status === 200) {
        console.log(response);

        setMesssages([...messages, response.data]);
      }
    } catch (e) {
      console.log(e);
      if (e.response.status == 401) {
        navigate("/login");
      }
    }
    // console.log(messgae);
  };

  useEffect(() => {
    srcollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  //video call
  const [joinded, setJoined] = useState(false);
  const callVideoChat = async () => {
    try {
      // setJoined(true);
      socket?.emit("callVideo", {
        avatar: user?.avatar,
        senderId: user?.id,
        nameSender: user?.firstName + " " + user?.lastName,
        receiverId: friend?.id,
        text: "Bạn có cuộc gọi từ " + user?.firstName + " " + user?.lastName,
      });
      window.open(
        "https://nguyentram13.github.io/service_call//?callerId=" +
          user?.id +
          "&calleeId=" +
          friend?.id +
          "&token=" +
          tokenCallVideo +
          "&caller=" +
          1,
        "_blank"
      );
    } catch (e) {
      console.log(e);
      if (e.response.status == 401) {
        navigate("/login");
      }
    }
  };
  //end video call

  const [showInfoRoom, setShowInfoRoom] = useState(false);

  const [dropdowOne, setDropdowOne] = useState(false);
  const [dropdowTwo, setDropdowTwo] = useState(false);
  const [dropdowThree, setDropdowThree] = useState(false);

  return (
    <LayoutClient socket={socket}>
      <div className="grid grid-cols-12 h-[91.5vh] ">
        <div className="col-span-3 h-[91.5vh] ">
          <div className="p-3 h-full">
            <div className="xl:h-1/4 h-[1/8]">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-black">Chat</span>
                <div className="hidden xl:flex gap-2 items-center">
                  <span className="p-2 rounded-full bg-slate-300 transition-all hover:bg-gray-400 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 text-black h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  </span>
                  <span
                    onClick={() => {
                      window.open(
                        "https://nguyentram13.github.io/service_call/group_call.html",

                        "_blank"
                      );
                    }}
                    className="p-2 rounded-full bg-slate-300 transition-all hover:bg-gray-400 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 text-black h-6"
                    >
                      <path
                        strokeLinecap="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </span>
                  <span className="p-2 rounded-full bg-slate-300 transition-all hover:bg-gray-400 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 text-black h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="hidden xl:block my-3 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm trên messager"
                  className="pl-5 pr-3 py-2 w-full rounded-full outline-none bg-gray-200"
                />
                <span className="absolute top-1/2 -translate-y-1/2 left-[12px] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </span>
              </div>
              <div className="hidden xl:block  flex gap-3">
                <span className="py-2 cursor-pointer px-3 font-bold text-blue-500 bg-blue-100 opacity-70 transition-all hover:opacity-100 rounded-full">
                  Hộp thư
                </span>
              </div>
            </div>
            <div className="xl:h-3/4 h-[7/8] overflow-x-hidden overflow-y-auto">
              {conversation &&
                conversation.map((cv) => (
                  <ItemConversationCurrent
                    key={cv.id + uuidv4()}
                    // setCurrentChat={setCurrentChat}
                    conversation={cv}
                    arrivalMessage={arrivalMessage}
                    setArrivalMessage={setArrivalMessage}
                    currentUser={user}
                    curentChat={curentChat}
                    messages={messages}
                  ></ItemConversationCurrent>
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-9 h-[91.5vh] ">
          {curentChat ? (
            <div className="h-full grid grid-cols-12 w-full border-l-2 border-2 border-r-2 overflow-hidden">
              <div
                className={`h-full w-full overflow-hidden  ${
                  showInfoRoom ? "col-span-8" : "col-span-12"
                }`}
              >
                <div className="h-[10%] shadow-sm">
                  <div className="flex px-3 py-2 h-full justify-between items-center">
                    <div className="flex gap-3 items-center">
                      {friend && (
                        <>
                          <span className="h-full block">
                            <img
                              src={
                                friend?.avatar
                                  ? friend.avatar
                                  : "../../undraw_profile.svg"
                              }
                              className="h-[50px] rounded-full object-cover w-[50px]"
                              alt=""
                            />
                          </span>
                          <p className="m-0">
                            <span className="font-bold text-black">
                              {friend?.firstName + " " + friend.lastName}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span
                        onClick={callVideoChat}
                        className="p-2 hover:bg-gray-200 transition-all rounded-full cursor-pointer"
                      >
                        <img
                          src="../../phone-call.png"
                          className="w-[25px]"
                          alt=""
                        />
                      </span>
                      <span
                        onClick={callVideoChat}
                        className="p-2 hover:bg-gray-200 transition-all rounded-full cursor-pointer"
                      >
                        <img
                          src="../../video-camera.png"
                          className="w-[25px]"
                          alt=""
                        />
                      </span>
                      <span
                        onClick={() =>
                          setShowInfoRoom((showInfoRoom) => !showInfoRoom)
                        }
                        className="p-2 hover:bg-gray-200 transition-all rounded-full cursor-pointer"
                      >
                        <img
                          src="../../about.png"
                          className="w-[25px]"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-[80%] max-h-80%] overflow-y-auto px-3 ">
                  {messages &&
                    friend &&
                    user &&
                    messages.length > 0 &&
                    messages.map((item) => (
                      <div key={item.id} ref={srcollRef}>
                        <Message
                          item={item}
                          own={user}
                          friend={friend}
                          current={item.sender == user?.id ? 1 : 0}
                        ></Message>
                      </div>
                    ))}
                  {messages && messages.length <= 0 && (
                    <div className="h-full text-xl w-full bg-gray-200  mt-1 flex rounded-xl items-center justify-center">
                      Hãy bắt đầu cuộc trò chuyện ngay bây giờ!
                    </div>
                  )}
                </div>
                    <InputMessage  createMessage={createMessage} ></InputMessage>
                {/* <div className="h-[10%] p-3">
                  <form onSubmit={createMessage} action="">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        ref={input_value}
                        onChange={(e) => setMessage(e.target.value)}
                        name="message"
                        className="w-full resize-none py-2 px-4 text-black outline-none bg-gray-200 rounded-full"
                        placeholder="Aa"
                        value={message}
                      />
                      <div className="p-1 relative hover:bg-gray-300 rounded-full w-fit cursor-pointer">
                        {showEmoji && (
                          <div className="fixed  z-[100] top-[60%] right-[5%] -translate-y-1/2">
                            <Picker
                              pickerStyle={{ width: "100%" }}
                              onEmojiClick={onEmojiClick}
                            ></Picker>
                          </div>
                        )}
                        <img
                          onClick={() =>
                            setShowEmoji((showEmoji) => !showEmoji)
                          }
                          src="./smile.png"
                          className="w-[40px]"
                          alt=""
                        />
                      </div>
                      <button
                        type="submit"
                        className="p-2 hover:bg-gray-300 rounded-full transition-all"
                      >
                        <img src="../../send.png" className="w-[30px]" alt="" />
                      </button>
                    </div>
                  </form>
                </div> */}
              </div>
              {showInfoRoom && (
                <div className="p-3 col-span-4 right-0 top-0 bottom-0 w-[25vw] overflow-y-auto bg-white shadow_noti">
                  <p className="w-full flex justify-center mb-1">
                    <img
                      className="w-24 object-cover h-24 rounded-full border"
                      src={
                        friend?.avatar ? friend.avatar : "../undraw_profile.svg"
                      }
                      alt=""
                    />
                  </p>
                  <p className="text-center font-bold text-lg text-black">
                    {friend.firstName + " " + friend.lastName}
                  </p>
                  <div className="flex justify-around items-center">
                    <p className="flex flex-col items-center">
                      <Link
                        to={`/profile/${friend?.id}`}
                        className="text-2xl cursor-pointer hover:scale-105 transition-all flex items-center justify-center p-2 rounded-full bg-gray-200 w-[40px] h-[40px] leading-none text-slate-700"
                      >
                        <i class="fa-brands fa-facebook"></i>
                      </Link>
                      <span className="text-sm text-black">Trang cá nhân</span>
                    </p>
                    <p className="flex flex-col items-center">
                      <span className="text-2xl cursor-pointer hover:scale-105 transition-all flex items-center justify-center  p-2 rounded-full bg-gray-200 w-[40px] h-[40px] leading-none text-slate-700">
                        <i class="fa-solid fa-bell"></i>
                      </span>
                      <span className="text-sm text-black">Tắt thông báo</span>
                    </p>
                    <p className="flex flex-col items-center">
                      <span className="text-2xl cursor-pointer hover:scale-105 transition-all flex items-center justify-center  p-2 rounded-full bg-gray-200 w-[40px] h-[40px] leading-none text-slate-700">
                        <i class="fa-solid fa-magnifying-glass"></i>
                      </span>
                      <span className="text-sm text-black">Tìm kiếm</span>
                    </p>
                  </div>
                  <div
                    onClick={() => setDropdowOne((dropdowOne) => !dropdowOne)}
                    className="flex justify-between items-center mt-3 font-bold text-black p-2 transition-all hover:bg-gray-300 cursor-pointer rounded-lg"
                  >
                    <span>Tùy chỉnh đoạn chat</span>
                    {dropdowOne ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  {dropdowOne && (
                    <ul className="px-2 text-black font-bold">
                      <li className="flex gap-3 items-center p-2 hover:bg-gray-200 transition-all rounded-xl cursor-pointer">
                        <span className="text-2xl text-blue-800">
                          <i class="fa-brands fa-themeisle"></i>
                        </span>
                        <span>Thay đổi chủ đề</span>
                      </li>
                      <li className="flex gap-3 items-center p-2 hover:bg-gray-200 transition-all rounded-xl cursor-pointer">
                        <span className="text-2xl text-blue-800">
                          <i class="fa-solid fa-a"></i>
                        </span>
                        <span>Chỉnh sửa biệt danh</span>
                      </li>
                    </ul>
                  )}
                  <div
                    onClick={() => setDropdowTwo((dropdowTwo) => !dropdowTwo)}
                    className="flex justify-between items-center mt-3 font-bold text-black p-2 transition-all hover:bg-gray-300 cursor-pointer rounded-lg"
                  >
                    <span>File phương tiện, file liên kết</span>
                    {dropdowTwo ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  {dropdowTwo && (
                    <ul className="px-2 text-black font-bold">
                      <li className="flex gap-3 items-center p-2 hover:bg-gray-200 transition-all rounded-xl cursor-pointer">
                        <span className="text-2xl text-blue-800">
                          <i class="fa-solid fa-file"></i>
                        </span>
                        <span>File phương tiện</span>
                      </li>
                      <li className="flex gap-3 items-center p-2 hover:bg-gray-200 transition-all rounded-xl cursor-pointer">
                        <span className="text-2xl text-blue-800">
                          <i class="fa-regular fa-file-lines"></i>
                        </span>
                        <span>File</span>
                      </li>
                    </ul>
                  )}
                  <div
                    onClick={() =>
                      setDropdowThree((dropdowThree) => !dropdowThree)
                    }
                    className="flex justify-between items-center mt-3 font-bold text-black p-2 transition-all hover:bg-gray-300 cursor-pointer rounded-lg"
                  >
                    <span>Quyền riêng tư và hổ trợ</span>
                    {dropdowThree ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 15.75l7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  {dropdowThree && (
                    <ul className="px-2 text-black font-bold">
                      <li className="flex gap-3 items-center p-2 hover:bg-gray-200 transition-all rounded-xl cursor-pointer">
                        <span className="text-2xl text-blue-800">
                          <i class="fa-regular fa-bell"></i>
                        </span>
                        <span>Tắt thông báo</span>
                      </li>
                      <li className="flex gap-3 items-center p-2 hover:bg-gray-200 transition-all rounded-xl cursor-pointer">
                        <span className="text-2xl text-blue-800">
                          <i class="fa-solid fa-user-slash"></i>
                        </span>
                        <span>Chặn</span>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="h-full text-xl w-full bg-gray-200 flex items-center justify-center">
                Chưa có cuộc trò chuyện nào được chọn!
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutClient>
  );
};

export default Messager;
