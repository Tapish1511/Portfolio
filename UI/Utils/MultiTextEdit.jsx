"use client";

import { useEffect, useRef, useState } from "react";
import { MdOutlineCheck, MdEdit } from "react-icons/md";
import { useGetAppData } from "../Contexts/RootContext";
import TextStyles from "./textedit.module.css";
import { IoMdClose } from "react-icons/io";

export default function MultiTextEdit({
  onSave,
  onCancel,
  text,
  stylesEdit,
  stylesText,
  keyItem,
  className,
  animationTime,
  editMode,
  loop,
}) {
  const [editState, setEditState] = useState(-1);
  const [inputText, setInputText] = useState(text ? text : []);
  const [previewItem, setPreviewItem] = useState(
    text ? { text: text[0], item: 0 } : {}
  );
  const [additionText, setAdditionalText] = useState("");
  const parentRef = useRef(null);

  const appData = useGetAppData();
  const [animationPlayState, setAnimationPlayState] = useState("paused");

  function onKillEditFocus(event) {
    if (parentRef.current && !parentRef.current.contains(event.target)) {
      console.log("called...");
      if (editState > -1) {
        onCancel?.();
        setInputText(text);
        setEditState(-1);
      }
    }
  }

  async function onSaveEvent() {
    setEditState(-1);
    if (inputText.length == 0) {
      setInputText(text);
      return;
    }
    await onSave?.({ [keyItem]: inputText });
    setInputText(text);
  }

  async function onAddEvent() {
    if (additionText.length == 0) {
      setInputText(text);
      return;
    }
    await onSave?.({ [keyItem]: [...inputText, additionText] });
    setInputText(text);
    setAdditionalText("");
  }

  async function onDeleteEvent(ItemIndex) {
    const newText = inputText.filter((item, index) => index != ItemIndex);
    await onSave?.({ [keyItem]: newText });
    setInputText(text);
  }

  useEffect(() => {
    //if(editState >= 0)
    console.log("called from use effect");
    {
      document.addEventListener("click", onKillEditFocus);
    }
    // else{
    //     document.removeEventListener('click', onKillEditFocus);
    // }
    return () => {
      document.removeEventListener("click", onKillEditFocus);
    };
  }, [editState]);

  useEffect(() => {
    setInputText(text);
    setPreviewItem(text ? { text: text[0], item: 0 } : {});
  }, [text]);

  useEffect(() => {
    setAnimationPlayState("running");
    // if(appData && appData?.Styles?.mode !== 1)
    // {

    //     console.log('animation')
    //     let index = 0;
    //     async function RunAnimation() {
    //       if (index < text.length) {
    //         setPreviewItem({ text: text[index], item: index });
    //       }
    
    //       if (loop) {
    //         index += 1;
    //         index %= text.length;
    //       } else index += 1;
    //       if (index == text.length) {
    //         console.log("from heheh");
    //         setTimeout(() => {
    //           setAnimationPlayState("paused");
    //         }, animationTime * 2);
    //         clearInterval(animationInterval);
    //       }
    //       //console.log("index value: "+ index)
    //     }
    //     const animationInterval = setInterval(() => {
    //       //console.log("call from interval")
    //       RunAnimation();
    //     }, animationTime * 2);
    //     RunAnimation();
    // }
    
    //console.log('call from use effect')
  }, [appData, text]);

  function UpdateValueAt(index, value) {
    if (index >= 0 && index < inputText.length) {
      const newText = [...inputText];
      newText[index] = value;
      //console.log(newText);
      setInputText(newText);
    }
  }

  return (
    <>
      <>
        {editMode !== 1 ? (
          <>
            <div className="sm:w-fit flex px-2">
              <p
                style={{
                  ...stylesText,
                  animationPlayState: animationPlayState,
                  animationDuration: `${animationTime}ms, 350ms`,
                  animationIterationCount: "infinite",
                }}
                className={`w-full ${TextStyles.AmimatedEle2} ${className}`}
                onAnimationIteration={(ev)=>{
                  if(ev.animationName != TextStyles.GrowEle2) return;
                  
                  setPreviewItem(prev=>{
                  let currentIndex = prev.item;
                  if(loop)
                  {
                    currentIndex = (currentIndex+1)% text.length;
                    return {item:currentIndex, text:text[currentIndex]};
                  }
                  else
                  {
                    if(currentIndex === text.length-1)
                    {
                      setAnimationPlayState('paused');
                      return prev;
                    }
                    else 
                    {
                      currentIndex+=1;
                      return {item:currentIndex, text:text[currentIndex]};
                    }
                  }
                })}}
              >

                {previewItem.text}
              </p>
            </div>
          </>
        ) : (
          <div ref={parentRef}>
            {inputText?.length > 0 &&
              inputText?.map((item, index) => {
                return (
                  <div key={index} className="w-full py-1">
                    {editState !== index ? (
                      <>
                        <div
                          className="border-2 rounded px-2 relative w-full"
                          style={{
                            borderColor:
                              appData?.Styles?.theme === "dark"
                                ? "white"
                                : "black",
                          }}
                        >
                          <p style={{ ...stylesText }}>{item}</p>
                          <button
                            className="absolute right-[-5px] top-0 opacity-50"
                            onClick={() => {
                              setEditState(index);
                            }}
                          >
                            <MdEdit size={15} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`flex px-2 ${className} border-2 rounded`}
                          style={{
                            ...stylesEdit,
                            borderColor:
                              appData?.Styles?.theme === "dark"
                                ? "white"
                                : "black",
                          }}
                        >
                          <input
                            style={{
                              color: "inherit",
                              backgroundColor: "inherit",
                            }}
                            className="flex-grow border-none outline-none"
                            type="text"
                            value={item}
                            onChange={(e) =>{
                                UpdateValueAt(index, e.target.value)
                            }
                            }
                          />
                          <button className="px-1" onClick={onSaveEvent}>
                            <MdOutlineCheck />
                          </button>
                          <button
                            className="px-1"
                            onClick={() => {
                              onDeleteEvent(index);
                            }}
                          >
                            <IoMdClose />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            <div
              className={`flex px-2 ${className} border-2 rounded w-full py-1`}
              style={{
                ...stylesEdit,
                borderColor:
                  appData?.Styles?.theme === "dark" ? "white" : "black",
              }}
            >
              <input
                style={{ color: "inherit", backgroundColor: "inherit" }}
                className="flex-grow border-none outline-none"
                type="text"
                value={additionText}
                onChange={(e) => {
                  setAdditionalText(e.target.value);
                }}
              />
              <button className="px-1" onClick={onAddEvent}>
                <MdOutlineCheck />
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
}
