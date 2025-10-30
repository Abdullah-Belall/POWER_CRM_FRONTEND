"use client";
import { Button, ButtonGroup, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "../utils/store/slices/snake-bar-slice";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../utils/store/slices/user-slice";
import { setCookie } from "../utils/requests/refresh-token-req";
import { changeLang, getPageTrans } from "../utils/store/slices/languages-slice";

export default function SignIn() {
  const trans = useAppSelector(getPageTrans("signInPage"));
  const router = useRouter();
  const [data, setData] = useState({
    user_name: "",
    password: "",
    lang: "en",
    tenant_domain: "",
  });
  const dispatch = useAppDispatch();
  const handleData = (key: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    handleData("lang", window.localStorage.getItem("lang") || "en");
    handleData("tenant_domain", window.location.hostname);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSignIn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: typeof data) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-in`,
        payload,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: (res) => {
      dispatch(
        setCurrentUser({
          ...res?.user,
        })
      );
      router.push("/");
      setCookie("access_token", res.access_token);
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Signed In successfully");
    },
    onError: (error: any) => {
      console.log(error);
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, error.response.data.message);
    },
  });

  const handleSignIn = () => {
    if (isPending) return;
    const { user_name, password } = data;
    if (user_name.length < 4) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "No user found with this info");
      return;
    }
    if (password.length < 8) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Incorrect password");
      return;
    }
    return mutate({
      ...data,
      tenant_domain: data.tenant_domain === "localhost" ? "localhost.com" : data.tenant_domain,
    });
  };
  const handlechangeLang = (lang: "ar" | "en") => {
    dispatch(
      changeLang({
        lang,
      })
    );
  };
  return (
    <div className="w-full flex h-dvh">
      <section className="w-[30%] bg-white h-full flex flex-col justify-center px-[20px]">
        <a href="https://www.power-soft.co" target="_blank">
          <img src="/LOGUP.gif" alt="" className="w-[110px] mx-auto pulse mt-[60px]" />
        </a>
        <img src="/LOGDown.gif" alt="" className="w-[300px] mx-auto mb-[40px]" />
        <div className=" flex flex-col justify-center items-start gap-4">
          <div className="w-full flex justify-center my-4">
            <ButtonGroup variant="text" className="!flex" aria-label="Basic button group">
              <Button onClick={() => handlechangeLang("ar")}>Ar</Button>
              <Button onClick={() => handlechangeLang("en")}>En</Button>
            </ButtonGroup>
          </div>
          <TextField
            className={`w-full`}
            style={{
              fontFamily: "cairo !important",
            }}
            value={data.user_name}
            onChange={(e) => handleData("user_name", e.target.value)}
            variant={"filled"}
            label={trans.lables.userName}
          />
          <TextField
            className={`w-full`}
            style={{
              fontFamily: "cairo !important",
              fontStyle: "cairo !important",
            }}
            value={data.password}
            onChange={(e) => handleData("password", e.target.value)}
            variant={"filled"}
            label={trans.lables.password}
          />
          <Button disabled={isPending} onClick={handleSignIn} variant="contained">
            {trans.btn}
          </Button>
        </div>
      </section>
      <section className="w-[70%] h-full bg- flex flex-col items-center">
        <div className="w-full px-6 flex-1 flex items-center">
          <img className={`w-full opacity-[1]`} src={"signin4.svg"} alt={`sign in svg`} />
        </div>
        <p className={`text-white text-bg font-semibold mb-4`}>{trans.sentence}</p>
      </section>
    </div>
  );
}
