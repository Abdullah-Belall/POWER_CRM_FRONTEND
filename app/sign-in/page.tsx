"use client";
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../utils/store/hooks";
import { openSnakeBar, SnakeBarTypeEnum } from "../utils/store/slices/snake-bar-slice";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../utils/store/slices/user-slice";
import { setCookie } from "../utils/requests/refresh-token-req";

export default function SignIn() {
  const lang = "ar";
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
          role: { ...res?.user?.role, roles: JSON.parse(res?.user?.role?.roles) },
        })
      );
      const roles: string[] = res?.user?.role?.roles;
      if (roles.includes("create-tenant")) {
        router.push("/managers");
      } else if (roles.includes("assignable")) {
        router.push("/supporters");
      } else if (roles.includes("create-complaint") && !roles.includes("update-complaint")) {
        router.push("/clients/complaints");
      } else {
        router.push("/");
      }
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

  return (
    <div className="w-full flex h-dvh">
      <section className="w-[35%] flex flex-col justify-center px-[20px] translate-y-[-60px]">
        <a href="https://www.power-soft.co" target="_blank">
          <img src="/LOGUP.gif" alt="" className="w-[110px] mx-auto pulse mt-[60px]" />
        </a>
        <img src="/LOGDown.gif" alt="" className="w-[300px] mx-auto mb-[60px]" />
        <div className=" flex flex-col justify-center items-start gap-4">
          <h1 className="text-xl font-semibold mb-[10px]">Welcome Back, Sign In</h1>
          <TextField
            className={`w-full`}
            value={data.user_name}
            onChange={(e) => handleData("user_name", e.target.value)}
            variant={"filled"}
            label={"User Name"}
          />
          <TextField
            className={`w-full`}
            value={data.password}
            onChange={(e) => handleData("password", e.target.value)}
            variant={"filled"}
            label={"Password"}
          />
          <Button onClick={handleSignIn} variant="contained">
            {isPending ? "Loading..." : "Sign In"}
          </Button>
        </div>
      </section>
      <section className="w-[65%] bg-darkgreen flex flex-col gap-4 justify-center items-center">
        <img className={`w-[95%]`} src={"login2.svg"} alt={`sign in svg`} />
        <p className="text-bg text-bg font-semibold font-usmodern">
          Continuous support... and communication without limits.
        </p>
      </section>
    </div>
  );
}

const translation = {
  welcome: {
    ar: "مرحبا بعودتك, سجل الدخول",
    en: "Welcome Back, Sign In",
  },
  labels: {
    user_name: {
      ar: "اسم المستخدم",
      en: "User Name",
    },
    password: {
      ar: "كلمة السر",
      en: "Password",
    },
  },
  confirm: {
    ar: "تسجيل الدخول",
    en: "Sign In",
  },
  sentence: {
    ar: "دعمٌ دائم... وتواصلٌ بلا حدود.",
    en: "Continuous support... and communication without limits.",
  },
};
